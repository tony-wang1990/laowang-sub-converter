import express from 'express'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_FILE = path.join(
    process.env.DATA_DIR || path.join(__dirname, '../../data'),
    'shortlinks.json'
)

// ---------------------------------------------------------------------------
// Optional admin authentication for short link management.
//
// When ADMIN_TOKEN is set, creating, listing and deleting short links
// require the token, sent either as the `X-Admin-Token` request header or
// as the `?token=` query parameter. The redirect itself (GET /s/:code) and
// the public stats endpoint stay unauthenticated: a short link is meant to
// be shared and followed by anyone.
// When ADMIN_TOKEN is not set, management stays unauthenticated exactly as
// before (self-hosted / trusted-network use); the server logs a warning at
// startup and the README Security section says so. Comparison is
// constant-time so a wrong token does not leak its length by timing.
// ---------------------------------------------------------------------------
function requireAdminToken(req, res, next) {
    const expected = String(process.env.ADMIN_TOKEN || '')
    if (!expected) return next()
    const supplied = String(req.get('X-Admin-Token') || req.query?.token || '')
    const expectedBuffer = Buffer.from(expected)
    const suppliedBuffer = Buffer.from(supplied)
    const matches = suppliedBuffer.length === expectedBuffer.length
        && crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
    if (!matches) {
        return res.status(401).json({ error: 'Admin token is required for short link management' })
    }
    return next()
}

router.post('/', requireAdminToken, (req, res) => {
    try {
        const originalUrl = normalizeRedirectUrl(req.body?.url)
        const requestedCode = String(req.body?.code || '').trim()

        if (requestedCode && !/^[a-zA-Z0-9_-]{3,32}$/.test(requestedCode)) {
            return res.status(400).json({
                error: 'Custom code must be 3-32 letters, numbers, underscores, or hyphens'
            })
        }

        const data = readData()
        if (!requestedCode) {
            const existing = Object.entries(data.links)
                .find(([, link]) => link.originalUrl === originalUrl)
            if (existing) {
                return res.json(publicLink(req, existing[0], existing[1]))
            }
        }

        if (requestedCode && data.links[requestedCode]) {
            return res.status(409).json({ error: 'Custom code already exists' })
        }

        let code = requestedCode
        while (!code || data.links[code]) code = generateShortCode()

        data.links[code] = {
            originalUrl,
            createdAt: new Date().toISOString(),
            clicks: 0
        }
        writeData(data)

        return res.status(201).json(publicLink(req, code, data.links[code]))
    } catch (error) {
        return handleStorageError(res, 'Create short link', error)
    }
})

router.get('/list', requireAdminToken, (req, res) => {
    try {
        const links = Object.entries(readData().links)
            .map(([code, link]) => publicLink(req, code, link))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        return res.json({ links })
    } catch (error) {
        return handleStorageError(res, 'List short links', error)
    }
})

router.delete('/:code', requireAdminToken, (req, res) => {
    try {
        const data = readData()
        if (!data.links[req.params.code]) {
            return res.status(404).json({ error: 'Short link not found' })
        }

        delete data.links[req.params.code]
        writeData(data)
        return res.json({ success: true })
    } catch (error) {
        return handleStorageError(res, 'Delete short link', error)
    }
})

router.get('/:code/stats', (req, res) => {
    try {
        const link = readData().links[req.params.code]
        if (!link) return res.status(404).json({ error: 'Short link not found' })
        return res.json(publicLink(req, req.params.code, link))
    } catch (error) {
        return handleStorageError(res, 'Get short link stats', error)
    }
})

router.get('/:code', (req, res) => {
    try {
        const data = readData()
        const link = data.links[req.params.code]
        if (!link) return res.status(404).json({ error: 'Short link not found' })

        link.clicks += 1
        try {
            writeData(data)
        } catch (error) {
            console.warn('Update short link click count failed:', error.message)
        }
        return res.redirect(302, link.originalUrl)
    } catch (error) {
        return handleStorageError(res, 'Redirect short link', error)
    }
})

function readData() {
    if (!fs.existsSync(DATA_FILE)) return emptyData()

    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    if (!parsed || typeof parsed !== 'object' || !parsed.links || typeof parsed.links !== 'object') {
        throw new Error('Short link data file has an invalid structure')
    }

    return {
        version: 1,
        links: Object.fromEntries(Object.entries(parsed.links)
            .filter(([, link]) => link && typeof link.originalUrl === 'string')
            .map(([code, link]) => [code, {
                originalUrl: link.originalUrl,
                createdAt: link.createdAt || new Date(0).toISOString(),
                clicks: Number.isFinite(Number(link.clicks)) ? Number(link.clicks) : 0
            }]))
    }
}

function writeData(data) {
    const directory = path.dirname(DATA_FILE)
    fs.mkdirSync(directory, { recursive: true })

    const temporaryFile = path.join(
        directory,
        `.${path.basename(DATA_FILE)}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`
    )
    try {
        fs.writeFileSync(temporaryFile, JSON.stringify(data, null, 2), {
            encoding: 'utf8',
            mode: 0o600
        })
        fs.renameSync(temporaryFile, DATA_FILE)
    } finally {
        if (fs.existsSync(temporaryFile)) fs.rmSync(temporaryFile, { force: true })
    }
}

function emptyData() {
    return { version: 1, links: {} }
}

function generateShortCode(length = 7) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const bytes = crypto.randomBytes(length)
    return Array.from(bytes, byte => chars[byte % chars.length]).join('')
}

function normalizeRedirectUrl(value) {
    let url
    try {
        url = new URL(String(value || '').trim())
    } catch {
        const error = new Error('Invalid URL format')
        error.status = 400
        throw error
    }
    if (!['http:', 'https:'].includes(url.protocol)) {
        const error = new Error('Short links only support http or https URLs')
        error.status = 400
        throw error
    }
    return url.toString()
}

function publicLink(req, code, link) {
    return {
        id: code,
        shortUrl: `${publicBaseUrl(req)}/s/${code}`,
        originalUrl: link.originalUrl,
        clicks: link.clicks || 0,
        createdAt: link.createdAt,
        created: link.createdAt
    }
}

function publicBaseUrl(req) {
    const configured = String(process.env.PUBLIC_BASE_URL || '').trim()
    if (configured) {
        try {
            const url = new URL(configured)
            if (['http:', 'https:'].includes(url.protocol)) {
                return url.toString().replace(/\/+$/, '')
            }
        } catch {
            console.warn('Ignoring invalid PUBLIC_BASE_URL')
        }
    }
    return `${req.protocol}://${req.get('host')}`
}

function handleStorageError(res, action, error) {
    if (error.status) return res.status(error.status).json({ error: error.message })
    console.error(`${action} error:`, error)
    return res.status(500).json({
        error: 'Short link storage is unavailable',
        message: `Check that DATA_DIR is writable: ${path.dirname(DATA_FILE)}`
    })
}

export default router
