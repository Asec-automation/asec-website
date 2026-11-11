/**
 * Cloudflare Worker entry: serves the built site from ./dist and the
 * Careers admin API at /api/careers (same code as the Pages Function).
 */
import { onRequest as careers } from '../functions/api/careers.js'

/** Pages that were removed from the site → where to send visitors instead. */
const MOVED = [
  [/^\/(expertise|solutions|industries|innovation|sustainability|news|insights)(\/.*)?$/, '/'],
  [/^\/career(\/.*)?$/, '/careers$1'],
  [/^\/(partners-technologies|technologies|technology)\/?$/, '/partners'],
  [/^\/(contact-us|contactus)\/?$/, '/contact'],
  [/^\/(about-us|aboutus)\/?$/, '/about'],
]

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    if (url.pathname === '/api/careers') return careers({ request, env, ctx })

    // Forgiving addresses: /Careers/Admin → /careers/admin, old pages → new ones
    let path = url.pathname
    if (!path.startsWith('/images/') && !path.startsWith('/assets/') && path !== path.toLowerCase()) path = path.toLowerCase()
    for (const [re, to] of MOVED) if (re.test(path)) { path = path.replace(re, to); break }
    if (path !== url.pathname) { url.pathname = path; return Response.redirect(url.toString(), 301) }

    return env.ASSETS.fetch(request)
  },
}
