import express from 'express'
import net from 'net'
import { parseSubscription } from '../utils/parsers.js'
import { convertToTarget } from '../utils/converters.js'
import { extensionForTarget, isSupportedTarget, normalizeTarget, supportedTargets } from '../utils/targets.js'
import { assertHostAllowed, fetchSubscriptionContent } from '../utils/subscription.js'

const router = express.Router()

// Maximum number of nodes tested in a single health check request.
// Kept at 100 so one request cannot tie up the server dialing hundreds of
// hosts; callers with larger subscriptions should split them into batches.
const MAX_NODES_PER_CHECK = 100
const MIN_TIMEOUT_MS = 250
const MAX_TIMEOUT_MS = 10000
const MAX_CONCURRENT = 10

async function testNodeConnection(server, port, timeout = 5000) {
    try {
        await assertHostAllowed(server)
    } catch (error) {
        return { success: false, latency: -1, error: error.message }
    }

    return new Promise((resolve) => {
        const startTime = Date.now()
        const socket = new net.Socket()

        socket.setTimeout(timeout)
        socket.on('connect', () => {
            const latency = Date.now() - startTime
            socket.destroy()
            resolve({ success: true, latency })
        })
        socket.on('timeout', () => {
            socket.destroy()
            resolve({ success: false, latency: -1, error: 'timeout' })
        })
        socket.on('error', (err) => {
            socket.destroy()
            resolve({ success: false, latency: -1, error: err.message })
        })

        try {
            socket.connect(Number(port), server)
        } catch (err) {
            resolve({ success: false, latency: -1, error: err.message })
        }
    })
}

router.post('/check', async (req, res) => {
    try {
        const {
            url,
            content,
            nodes: directNodes,
            timeout = 5000,
            concurrent = 10,
            exportTarget: rawExportTarget = 'v2rayn'
        } = req.body

        let nodes = []
        const exportTarget = normalizeTarget(rawExportTarget)

        if (!isSupportedTarget(exportTarget)) {
            return res.status(400).json({
                error: 'Invalid export target',
                supported: supportedTargets()
            })
        }

        if (url) {
            try {
                nodes = parseSubscription(await fetchSubscriptionContent(url))
            } catch (e) {
                return res.status(400).json({ error: 'Failed to parse subscription: ' + e.message })
            }
        } else if (content) {
            nodes = parseSubscription(content)
        } else if (Array.isArray(directNodes)) {
            nodes = directNodes.filter(node =>
                node &&
                typeof node.server === 'string' &&
                Number.isInteger(Number(node.port)) &&
                Number(node.port) > 0 &&
                Number(node.port) <= 65535
            )
        } else {
            return res.status(400).json({ error: 'Either url, content, or nodes array is required' })
        }

        nodes = nodes.slice(0, MAX_NODES_PER_CHECK)

        if (!nodes.length) {
            return res.json({
                nodes: [],
                summary: { total: 0, online: 0, offline: 0, avgLatency: 0, minLatency: 0, maxLatency: 0 },
                exportTarget,
                exportConfig: '',
                exportFileName: `online-nodes.${extensionForTarget(exportTarget)}`
            })
        }

        const results = []
        const batchSize = Math.min(Math.max(Number(concurrent) || 10, 1), MAX_CONCURRENT)
        const timeoutMs = Math.min(Math.max(Number(timeout) || 5000, MIN_TIMEOUT_MS), MAX_TIMEOUT_MS)

        for (let i = 0; i < nodes.length; i += batchSize) {
            const batch = nodes.slice(i, i + batchSize)
            const batchResults = await Promise.all(
                batch.map(async (node, offset) => {
                    const result = await testNodeConnection(node.server, node.port, timeoutMs)
                    return {
                        index: i + offset,
                        node,
                        name: node.name,
                        server: node.server,
                        port: node.port,
                        type: node.type,
                        status: result.success ? 'online' : 'offline',
                        latency: result.latency,
                        error: result.error || null
                    }
                })
            )
            results.push(...batchResults)
        }

        results.sort((a, b) => {
            if (a.status === 'online' && b.status !== 'online') return -1
            if (a.status !== 'online' && b.status === 'online') return 1
            return a.latency - b.latency
        })

        const onlineResults = results.filter(item => item.status === 'online')
        const onlineNodes = onlineResults.map(item => item.node)
        const avgLatency = onlineResults.length
            ? Math.round(onlineResults.reduce((sum, item) => sum + item.latency, 0) / onlineResults.length)
            : 0
        const exportConfig = onlineNodes.length
            ? convertToTarget(onlineNodes, exportTarget, { udp: true, skipCert: false, rulePreset: 'standard' })
            : ''

        res.json({
            nodes: results.map(({ node, index, ...item }) => item),
            summary: {
                total: results.length,
                online: onlineResults.length,
                offline: results.length - onlineResults.length,
                avgLatency,
                minLatency: onlineResults.length ? Math.min(...onlineResults.map(item => item.latency)) : 0,
                maxLatency: onlineResults.length ? Math.max(...onlineResults.map(item => item.latency)) : 0
            },
            exportTarget,
            exportConfig,
            exportFileName: `online-nodes.${extensionForTarget(exportTarget)}`
        })
    } catch (error) {
        console.error('Health check error:', error)
        res.status(500).json({ error: 'Health check failed: ' + error.message })
    }
})

router.get('/ping', async (req, res) => {
    const { server, port, timeout = 3000 } = req.query
    if (!server || !port) return res.status(400).json({ error: 'Server and port are required' })
    const targetPort = Number(port)
    if (!Number.isInteger(targetPort) || targetPort < 1 || targetPort > 65535) {
        return res.status(400).json({ error: 'Port must be between 1 and 65535' })
    }
    const timeoutMs = Math.min(Math.max(Number(timeout) || 3000, MIN_TIMEOUT_MS), MAX_TIMEOUT_MS)
    res.json(await testNodeConnection(server, targetPort, timeoutMs))
})

export default router
