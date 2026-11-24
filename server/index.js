import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import convertRouter from './routes/convert.js'
import shortlinkRouter from './routes/shortlink.js'
import healthRouter from './routes/health.js'
import mergeRouter from './routes/merge.js'
import { getRulePresets } from './utils/rules.js'
import { targetDefinitions } from './utils/targets.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const distDir = path.join(__dirname, '../dist')
const hasBuiltFrontend = fs.existsSync(path.join(distDir, 'index.html'))
const shouldServeFrontend = process.env.NODE_ENV === 'production' || hasBuiltFrontend
const trustProxy = process.env.TRUST_PROXY || '1'

app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy)
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// ---------------------------------------------------------------------------
// Basic global rate limiting (hand-written, no extra dependency).
//
// Defaults are deliberately loose so normal self-hosted use is unaffected:
//   RATE_LIMIT_WINDOW_MS  default 60000  (1 minute window)
//   RATE_LIMIT_MAX        default 300    (requests per IP per window)
// Set RATE_LIMIT_MAX=0 to disable the limiter entirely (not recommended for
// a publicly reachable instance). Counts are kept in memory only, so each
// process / container restart resets them and limits are per-instance.
// When the limit is hit the server answers 429 with a Retry-After header.
// ---------------------------------------------------------------------------
const rateLimitWindowMs = Math.max(
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    1000
)
// NOTE: parse RATE_LIMIT_MAX explicitly instead of `|| 300`, so that
// RATE_LIMIT_MAX=0 really disables the limiter instead of falling back.
const rateLimitMax = process.env.RATE_LIMIT_MAX === undefined || process.env.RATE_LIMIT_MAX === ''
    ? 300
    : Math.max(Number(process.env.RATE_LIMIT_MAX) || 0, 0)
const rateLimitStore = new Map()

function basicRateLimit(req, res, next) {
    if (!rateLimitMax) return next()
    const now = Date.now()
    const key = req.ip || req.socket?.remoteAddress || 'unknown'
    let entry = rateLimitStore.get(key)
    if (!entry || now - entry.windowStart >= rateLimitWindowMs) {
        entry = { windowStart: now, count: 0 }
        rateLimitStore.set(key, entry)
    }
    entry.count += 1
    if (entry.count > rateLimitMax) {
        const retryAfter = Math.ceil((entry.windowStart + rateLimitWindowMs - now) / 1000)
        res.setHeader('Retry-After', String(Math.max(retryAfter, 1)))
        return res.status(429).json({
            error: 'Too many requests, please slow down and retry later'
        })
    }
    return next()
}

// Prune stale entries once per window so the map cannot grow unbounded.
setInterval(() => {
    const cutoff = Date.now() - rateLimitWindowMs
    for (const [key, entry] of rateLimitStore) {
        if (entry.windowStart < cutoff) rateLimitStore.delete(key)
    }
}, rateLimitWindowMs).unref()

app.use(basicRateLimit)

app.use('/api/convert', convertRouter)
app.use('/api/shortlink', shortlinkRouter)
app.use('/api/health', healthRouter)
app.use('/api/merge', mergeRouter)
app.use('/s', shortlinkRouter)

app.get('/api/rules/presets', (req, res) => {
    res.json(getRulePresets())
})

app.get('/api/targets', (req, res) => {
    res.json(targetDefinitions())
})

const serverHealth = (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
}

app.get('/healthz', serverHealth)
app.get('/health', (req, res, next) => {
    if (shouldServeFrontend && req.headers.accept?.includes('text/html')) {
        return next()
    }
    return serverHealth(req, res)
})

app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' })
})

if (shouldServeFrontend) {
    app.use(express.static(distDir, {
        etag: true,
        setHeaders(res, filePath) {
            if (filePath.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-cache')
            } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            }
        }
    }))

    app.get('*', (req, res) => {
        res.setHeader('Cache-Control', 'no-cache')
        res.sendFile(path.join(distDir, 'index.html'))
    })
}

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})

if (path.resolve(process.argv[1] || '') === path.resolve(__filename)) {
    app.listen(PORT, () => {
        console.log(`LaoWang Sub-converter server running on port ${PORT}`)
        console.log(`API: http://localhost:${PORT}/api`)
        console.log(`Health: http://localhost:${PORT}/healthz`)
        console.log(`Rate limit: ${rateLimitMax ? `${rateLimitMax} requests per IP per ${rateLimitWindowMs}ms` : 'disabled (RATE_LIMIT_MAX=0)'}`)
        if (process.env.ADMIN_TOKEN) {
            console.log('Short link management: ADMIN_TOKEN is set, create/list/delete require the admin token')
        } else {
            console.warn('WARNING: ADMIN_TOKEN is not set, short link create/list/delete are unauthenticated. '
                + 'Set ADMIN_TOKEN before exposing this service publicly. See README Security section.')
        }
    })
}

export default app
