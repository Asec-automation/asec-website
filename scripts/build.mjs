// Build: detect images → bundle → prerender every route to static HTML.
//   node scripts/build.mjs            → dist/  (deploy to any static host)
//   node scripts/build.mjs --hash --single → preview/index.html (one self-contained file)
import { build } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const SINGLE = args.has('--single')
const MODE = args.has('--hash') ? 'hash' : 'history'
const out = path.join(root, SINGLE ? 'preview' : 'dist')

// ---------- 1. image detection ----------
const regSrc = fs.readFileSync(path.join(root, 'src/config/images.ts'), 'utf8')
const slotPaths = {}
for (const m of regSrc.matchAll(/s\('([A-Z0-9_]+)'[\s\S]*?'(\/images\/[^']+)'/g)) slotPaths[m[1]] = m[2]
for (let i = 1; i <= 6; i++) { const n = String(i).padStart(2, '0'); slotPaths[`PARTNER_LOGO_${n}`] = `/images/partners/partner-${n}.png` }
const available = {}
for (const [id, p] of Object.entries(slotPaths)) {
  const base = p.replace(/\.[a-z]+$/i, '')
  for (const ext of ['.svg', '.png', '.webp', '.avif', '.jpg', '.jpeg']) {
    if (fs.existsSync(path.join(root, 'public', base + ext))) { available[id] = base + ext; break }
  }
}
// Single-file preview: embed images as data URIs (the preview cannot load separate files).
if (SINGLE) { try { (await import('node:child_process')).execSync('python3 scripts/preview_images.py', { cwd: root, stdio: 'inherit' }) } catch { console.log('preview images: using full-size files') } }
// Preview reads lightweight copies from .preview-cache/ when present (see scripts/preview_images.py).
const readImg = (rel) => { const c = path.join(root, '.preview-cache', rel); return fs.readFileSync(fs.existsSync(c) ? c : path.join(root, 'public', rel)) }
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml' }
const forBundle = SINGLE
  ? Object.fromEntries(Object.entries(available).map(([id, p]) => [id, `data:${mime[path.extname(p)]};base64,${readImg(p).toString('base64')}`]))
  : available
fs.writeFileSync(path.join(root, 'src/config/available-images.json'), JSON.stringify(forBundle, null, 2))
console.log(`images: ${Object.keys(available).length}/${Object.keys(slotPaths).length} slots filled`)

// ---------- 2. bundle ----------
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(out, { recursive: true })
const common = {
  bundle: true, jsx: 'automatic', jsxImportSource: '@i18n',
  alias: { '@i18n/jsx-runtime': path.join(root, 'src/i18n/jsx-runtime.ts'), '@i18n/jsx-dev-runtime': path.join(root, 'src/i18n/jsx-dev-runtime.ts') }, loader: { '.tsx': 'tsx', '.ts': 'ts' }, logLevel: 'warning',
  define: { __ROUTER_MODE__: JSON.stringify(MODE), 'process.env.NODE_ENV': '"production"' },
}
const client = await build({
  ...common, entryPoints: [path.join(root, 'src/main.tsx')], outdir: path.join(out, 'assets'),
  entryNames: SINGLE ? 'app' : 'app-[hash]', minify: true, format: 'esm', target: ['es2020'], write: !SINGLE, metafile: true,
  sourcemap: false,
})
const outputs = SINGLE ? Object.fromEntries(client.outputFiles.map((f) => [path.extname(f.path), f.text])) : null
const jsFile = !SINGLE && Object.keys(client.metafile.outputs).find((f) => f.endsWith('.js'))
const cssFile = !SINGLE && Object.keys(client.metafile.outputs).find((f) => f.endsWith('.css'))
const rel = (f) => '/' + path.relative(out, path.join(process.cwd(), f)).split(path.sep).join('/')

// ---------- 3. server bundle for prerender ----------
const ssrOut = path.join(root, '.ssr/server.mjs')
await build({ ...common, entryPoints: [path.join(root, 'src/server.tsx')], outfile: ssrOut, platform: 'node', format: 'esm', loader: { ...common.loader, '.css': 'empty' }, external: ['react', 'react-dom'] })
const { render, paths, indexable, seenStrings } = await import(pathToFileURL(ssrOut).href + `?t=${Date.now()}`)

const company = fs.readFileSync(path.join(root, 'src/content/company.ts'), 'utf8')
const siteUrl = (company.match(/siteUrl:\s*'([^']+)'/) || [])[1] || ''
// Content-Security-Policy: only our own files plus the few outside services the site really uses.
const apiOrigin = (company.match(/apiBase:\s*'([^']+)'/) || [])[1] || ''
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${apiOrigin} https://formsubmit.co https://cloudflareinsights.com`,
  "frame-src https://maps.google.com https://www.google.com https://formsubmit.co",
  "form-action 'self' https://formsubmit.co",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')
const cfToken = (company.match(/cloudflareAnalyticsToken:\s*'([^']*)'/) || [])[1] || ''
const gVerify = (company.match(/googleSiteVerification:\s*'([^']*)'/) || [])[1] || ''
const orgLd = {
  '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': `${siteUrl}/#organization`,
  name: 'ASEC Automation', alternateName: 'ASA', url: siteUrl || undefined,
  logo: `${siteUrl}/images/brand/logo-dark-full.png`, image: `${siteUrl}/images/brand/logo-dark-full.png`,
  description: 'Industrial automation, electrical and control systems engineering, LV panel building and PV solar EPC for heavy industry across the Middle East and Africa.',
  email: 'contact@asecautomation.com', telephone: '+20 106 564 8082',
  address: { '@type': 'PostalAddress', streetAddress: '9 Street 286, New Maadi', addressLocality: 'Cairo', postalCode: '4234220', addressCountry: 'EG' },
  sameAs: ['https://www.linkedin.com/company/3069601/'],
  areaServed: ['Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Libya', 'Middle East', 'Africa'],
  knowsAbout: ['Industrial automation', 'PLC', 'SCADA', 'DCS', 'Electrical engineering', 'LV panel building', 'PV solar EPC', 'Cement industry'],
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const og = available.OG_DEFAULT_01 ? `${siteUrl}${available.OG_DEFAULT_01}` : ''

const page = ({ html, title, description, image, type, noindex, lang = 'en' }, p) => {
  const enPath = p.startsWith('/ar') ? (p.slice(3) || '/') : p
  const arPath = enPath === '/' ? '/ar' : '/ar' + enPath
  const ogImg = image && image.startsWith('/') ? `${siteUrl}${image}` : image && available[image] ? `${siteUrl}${available[image]}` : og
  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}" class="no-js">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
${p !== '/404' && !SINGLE && !noindex ? `<link rel="canonical" href="${siteUrl}${p === '/' ? '/' : p}" />\n<link rel="alternate" hreflang="en" href="${siteUrl}${enPath}" />\n<link rel="alternate" hreflang="ar" href="${siteUrl}${arPath}" />\n<link rel="alternate" hreflang="x-default" href="${siteUrl}${enPath}" />` : '<meta name="robots" content="noindex" />'}
<meta property="og:type" content="${type || 'website'}" />
${!SINGLE && p !== '/404' ? `<meta property="og:url" content="${siteUrl}${p}" />` : ''}
<meta property="og:site_name" content="ASEC Automation" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
${ogImg ? `<meta property="og:image" content="${ogImg}" /><meta name="twitter:image" content="${ogImg}" />` : ''}
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#040F47" />
${SINGLE ? '' : `<meta http-equiv="Content-Security-Policy" content="${CSP}" />`}
<meta name="referrer" content="strict-origin-when-cross-origin" />
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/images/brand/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
${p === '/' ? `<script type="application/ld+json">${JSON.stringify(orgLd)}</script>` : ''}
${p === '/' && gVerify && !SINGLE ? `<meta name="google-site-verification" content="${gVerify}" />` : ''}
${cfToken && !SINGLE ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify({ token: cfToken })}'></script>` : ''}
${SINGLE ? `<style>${outputs['.css']}</style>` : `<link rel="stylesheet" href="${rel(cssFile)}" />`}
</head>
<body>
<div id="root">${html}</div>
${SINGLE ? `<script type="module">${outputs['.js'].replace(/<\/script/g, '<\\/script')}</script>` : `<script type="module" src="${rel(jsFile)}"></script>`}
</body>
</html>`
}

if (SINGLE) {
  // Inline gallery / project photos (referenced by path in content) as data URIs.
  const inline = (txt) => {
    for (const sub of ['gallery', 'projects', 'projects/refs', 'tools', 'industries/tiles', 'industries', 'tech', 'global/regions', 'home']) {
      const dir = path.join(root, 'public/images', sub)
      for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
        if (!mime[path.extname(f)]) continue
        const ref = `/images/${sub}/${f}`
        if (txt.includes(ref)) txt = txt.split(ref).join(`data:${mime[path.extname(f)]};base64,${readImg(path.join('images', sub, f)).toString('base64')}`)
      }
    }
    return txt
  }
  outputs['.js'] = inline(outputs['.js'])
  fs.writeFileSync(path.join(out, 'index.html'), inline(page(render('/'), '/')))
  console.log('preview → preview/index.html')
} else {
  for (const p of paths) {
    const file = p === '/404' ? path.join(out, '404.html') : path.join(out, p, 'index.html')
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, page(render(p), p))
  }
  // ---------- 4. static files ----------
  fs.cpSync(path.join(root, 'public'), out, { recursive: true })
  const pub = indexable
  fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pub.map((p) => `  <url><loc>${siteUrl}${p}</loc></url>`).join('\n')}\n</urlset>\n`)
  fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /careers/admin\nDisallow: /business/admin\nDisallow: /login\nDisallow: /api/\nSitemap: ${siteUrl}/sitemap.xml\n`)
  // GitHub Pages: custom domain + no Jekyll processing
  fs.writeFileSync(path.join(out, 'CNAME'), new URL(siteUrl).hostname + '\n')
  fs.writeFileSync(path.join(out, '.nojekyll'), '')
  // Old addresses from the previous website → new pages (static hosts have no server redirects)
  const OLD = { expertise: '/', solutions: '/', industries: '/', innovation: '/', sustainability: '/', news: '/', insights: '/',
    career: '/careers/', 'partners-technologies': '/partners/', technologies: '/partners/', technology: '/partners/',
    'contact-us': '/contact/', contactus: '/contact/', 'about-us': '/about/', aboutus: '/about/' }
  for (const [from, to] of Object.entries(OLD)) {
    const dir = path.join(out, from)
    if (fs.existsSync(path.join(dir, 'index.html'))) continue
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Moved</title><meta name="robots" content="noindex"><link rel="canonical" href="${siteUrl}${to}"><meta http-equiv="refresh" content="0; url=${to}"></head><body><a href="${to}">Continue</a></body></html>`)
  }
  console.log(`prerendered ${paths.length} pages → dist/`)
  // list every English UI string, and which ones still lack an Arabic translation
  const ar = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/ar.json'), 'utf8'))
  const strings = seenStrings().filter((x) => !/[\u0600-\u06FF]/.test(x))
  const missing = strings.filter((x) => ar[x] === undefined)
  fs.writeFileSync(path.join(root, 'src/i18n/strings-en.json'), JSON.stringify(strings, null, 1))
  console.log(`arabic: ${strings.length - missing.length}/${strings.length} strings translated`)
}
fs.rmSync(path.join(root, '.ssr'), { recursive: true, force: true })
if (SINGLE) fs.writeFileSync(path.join(root, 'src/config/available-images.json'), JSON.stringify(available, null, 2))
