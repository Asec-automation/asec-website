/**
 * Cloudflare Worker entry: serves the built site from ./dist and the
 * Careers admin API at /api/careers (same code as the Pages Function).
 */
import { onRequest as careers } from '../functions/api/careers.js'
import { onRequest as inbox } from '../functions/api/inbox.js'
import { onRequest as staff } from '../functions/api/staff.js'

/** Pages that were removed from the site → where to send visitors instead. */
const MOVED = [
  [/^\/(expertise|solutions|industries|innovation|sustainability|news|insights)(\/.*)?$/, '/'],
  [/^\/career(\/.*)?$/, '/careers$1'],
  [/^\/(partners-technologies|technologies|technology)\/?$/, '/partners'],
  [/^\/(contact-us|contactus)\/?$/, '/contact'],
  [/^\/(about-us|aboutus)\/?$/, '/about'],
]

/** Sites allowed to call the API from another address (the public website on GitHub Pages). */
const ALLOWED_ORIGINS = new Set([
  'https://www.asecautomation.com',
  'https://asecautomation.com',
  'https://asec-automation.github.io',
])
function cors(request, response) {
  const origin = request.headers.get('Origin')
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return response
  const r = new Response(response.body, response)
  r.headers.set('Access-Control-Allow-Origin', origin)
  r.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  r.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
  r.headers.set('Access-Control-Max-Age', '86400')
  r.headers.append('Vary', 'Origin')
  return r
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const API = { '/api/careers': careers, '/api/inbox': inbox, '/api/staff': staff }
    if (API[url.pathname]) {
      if (request.method === 'OPTIONS') return cors(request, new Response(null, { status: 204 }))
      const handler = API[url.pathname]
      return cors(request, await handler({ request, env, ctx }))
    }

    // Forgiving addresses: /Careers/Admin → /careers/admin, old pages → new ones
    let path = url.pathname
    if (!path.startsWith('/images/') && !path.startsWith('/assets/') && !path.startsWith('/docs/') && path !== path.toLowerCase()) path = path.toLowerCase()
    for (const [re, to] of MOVED) if (re.test(path)) { path = path.replace(re, to); break }
    if (path !== url.pathname) { url.pathname = path; return Response.redirect(url.toString(), 301) }

    return env.ASSETS.fetch(request)
  },
}
