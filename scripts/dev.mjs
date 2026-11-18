// Dev server: build → serve dist/ → rebuild and reload the browser whenever src/ or public/ changes.
//   npm run dev → http://localhost:5173
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const port = Number(process.env.PORT) || 5173
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.xml': 'application/xml', '.txt': 'text/plain' }
// The build writes these files into src/ itself — ignore them or every build would trigger another.
const IGNORE = [path.join('config', 'available-images.json'), path.join('i18n', 'strings-en.json')]

const clients = new Set()
const reloadSnippet = `<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>`

// ---------- build (in a child process so each run starts fresh) ----------
let building = false, again = false
function runBuild() {
  if (building) { again = true; return }
  building = true
  const started = Date.now()
  const child = spawn(process.execPath, [path.join(root, 'scripts/build.mjs')], { cwd: root, stdio: 'inherit' })
  child.on('exit', (code) => {
    building = false
    if (code === 0) {
      console.log(`\n✔ built in ${((Date.now() - started) / 1000).toFixed(1)}s — http://localhost:${port}\n`)
      for (const res of clients) res.write('data: reload\n\n')
    } else console.log('\n✖ build failed — fix the error above and save again\n')
    if (again) { again = false; runBuild() }
  })
}

// ---------- watch ----------
let timer
const onChange = (dir) => (_event, file) => {
  if (file && IGNORE.some((p) => file.endsWith(p))) return
  clearTimeout(timer)
  timer = setTimeout(() => { console.log(`changed: ${dir}/${file ?? ''}`); runBuild() }, 150)
}
for (const dir of ['src', 'public']) {
  const abs = path.join(root, dir)
  if (fs.existsSync(abs)) fs.watch(abs, { recursive: true }, onChange(dir))
}

// ---------- serve ----------
http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })
    res.write('\n'); clients.add(res); req.on('close', () => clients.delete(res)); return
  }
  let file = path.join(dist, path.normalize(url).replace(/^(\.\.[/\\])+/, ''))
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
  let status = 200
  if (!fs.existsSync(file)) { file = path.join(dist, '404.html'); status = 404 }
  if (!fs.existsSync(file)) { res.writeHead(503, { 'Content-Type': 'text/plain' }).end('Building… refresh in a moment.'); return }
  const type = types[path.extname(file)] || 'application/octet-stream'
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  if (type.startsWith('text/html')) res.end(fs.readFileSync(file, 'utf8').replace('</body>', reloadSnippet + '</body>'))
  else fs.createReadStream(file).pipe(res)
}).listen(port, () => console.log(`Dev server at http://localhost:${port} (watching src/ and public/)`))

runBuild()
