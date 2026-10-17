// Local stand-in for the instance, for developing and testing the browser side without one.
//   npm run build && npm run dev        then open http://localhost:8080/
//
//  * serves the SDK's built UI assets at /uxasset/externals/x_doom/* and the two UI pages
//  * serves a fake "classic UI" shell (/nav_to.do) whose content frames include the global UI Script
//  * answers /api/x_doom/doom/* with the REAL server handlers running on the in-memory Glide emulator
// Pick a user with ?user=marine|isabella|mallory (remembered in a cookie).
import http from 'node:http'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { boot, handle, USERS } from './platform.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const staticDir = join(root, 'dist', 'static')
const uiScript = readFileSync(join(root, 'src', 'scripts', 'ui-script', 'doomguy-loader.client.js'), 'utf8')
const PORT = Number(process.env.PORT ?? 8080)

const types = {
    '.jsdbx': 'text/javascript',
    '.map': 'application/json',
    '.html': 'text/html',
    '.json': 'application/json',
}

const updateDir = join(root, 'dist', 'app', 'update')

/**
 * Serves each UI Page exactly as the platform will: the `html` field of the generated
 * sys_ui_page record (not the SDK's intermediate dist/static/*.html, which uses XML-style empty tags).
 */
function loadPages() {
    const pages = {}
    for (const file of readdirSync(updateDir).filter((f) => f.startsWith('sys_ui_page_'))) {
        const xml = readFileSync(join(updateDir, file), 'utf8')
        const endpoint = /<endpoint>(.*?)<\/endpoint>/.exec(xml)?.[1]
        const html = /<html><!\[CDATA\[(.*?)\]\]><\/html>/s.exec(xml)?.[1]
        if (endpoint && html) pages['/' + endpoint] = html
    }
    return pages
}

const renderPage = (html) => html.replace(/\$\[UxFrameworkScriptables\.getFlushTimestamp\(\)\]/g, String(Date.now()))

const chrome = (
    body,
    title = 'Dev instance'
) => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font:14px sans-serif;margin:0;background:#f4f6f8;color:#1d2733} header{background:#293e40;color:#fff;padding:10px 16px}
main{padding:16px} table{border-collapse:collapse;background:#fff} td,th{border:1px solid #ccd;padding:6px 10px;text-align:left}
input,textarea{padding:6px;width:320px} .box{background:#fff;border:1px solid #ccd;padding:12px;margin:12px 0;max-width:700px}</style></head><body>${body}
<script>${uiScript}</script></body></html>`

const contentPages = {
    '/incident_list.do': chrome(`<header>Incidents (dev list)</header><main><h2>Incidents</h2>
        <table><tr><th>Number</th><th>Short description</th><th>Priority</th></tr>
        ${Array.from({ length: 30 }, (_, i) => `<tr><td>INC00${1000 + i}</td><td>Printer ${i} is on fire</td><td>${(i % 4) + 1}</td></tr>`).join('')}</table>
        <p><a id="to-form" href="/incident.do">Open a record</a></p></main>`),
    '/incident.do': chrome(`<header>Incident (dev form)</header><main><h2>INC0010001</h2>
        <div class="box"><label>Short description<br><input id="short" value=""></label></div>
        <div class="box"><label>Description<br><textarea id="desc" rows="4"></textarea></label></div>
        <p><a id="to-list" href="/incident_list.do">Back to the list</a></p></main>`),
}

const shell = `<!doctype html><html><head><meta charset="utf-8"><title>Dev instance (classic UI)</title>
<style>html,body{margin:0;height:100%} body{display:flex;flex-direction:column;font:14px sans-serif}
#banner{background:#1d2733;color:#fff;padding:8px 12px} iframe{flex:1;border:0}</style></head>
<body><div id="banner">Dev instance &mdash; classic UI shell &nbsp;
<a style="color:#9cf" href="/incident_list.do" target="gsft_main">Incidents</a> &nbsp;
<a style="color:#9cf" href="/x_doom_play.do" target="gsft_main">Play Doom</a> &nbsp;
<a style="color:#9cf" href="/x_doom_doomguy.do" target="gsft_main">Doomguy</a></div>
<iframe name="gsft_main" id="gsft_main" src="/incident_list.do"></iframe></body></html>`

function userFrom(url, cookie = '') {
    const fromQuery = url.searchParams.get('user')
    const fromCookie = /(?:^|;\s*)devuser=(\w+)/.exec(cookie)?.[1]
    const chosen = fromQuery ?? fromCookie ?? 'marine'
    return USERS[chosen] ? chosen : 'marine'
}

await boot()
const pages = loadPages()

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const user = userFrom(url, req.headers.cookie)
    res.setHeader('Set-Cookie', `devuser=${user}; Path=/`)

    if (url.pathname.startsWith('/api/x_doom/doom')) {
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        const raw = Buffer.concat(chunks).toString('utf8')
        let body
        try {
            body = raw ? JSON.parse(raw) : undefined
        } catch {
            body = undefined
        }
        const query = Object.fromEntries(url.searchParams)
        const reply = handle({ method: req.method, path: url.pathname, query, body, user })
        res.writeHead(reply.status, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(reply.body ?? {}))
    }

    if (url.pathname.startsWith('/uxasset/externals/x_doom/')) {
        const file = join(staticDir, url.pathname.slice('/uxasset/externals/x_doom/'.length))
        if (!file.startsWith(staticDir) || !existsSync(file)) return void res.writeHead(404).end('not found')
        res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' })
        return res.end(readFileSync(file))
    }

    if (pages[url.pathname]) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end(renderPage(pages[url.pathname]))
    }
    if (contentPages[url.pathname]) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end(contentPages[url.pathname])
    }
    if (url.pathname === '/' || url.pathname === '/nav_to.do') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        return res.end(shell)
    }
    res.writeHead(404).end('not found')
})

server.listen(PORT, () =>
    console.log(`Dev instance on http://localhost:${PORT}/  (users: ${Object.keys(USERS).join(', ')})`)
)
