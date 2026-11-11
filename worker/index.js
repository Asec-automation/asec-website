/**
 * Cloudflare Worker entry: serves the built site from ./dist and the
 * Careers admin API at /api/careers (same code as the Pages Function).
 */
import { onRequest as careers } from '../functions/api/careers.js'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    if (url.pathname === '/api/careers') return careers({ request, env, ctx })
    return env.ASSETS.fetch(request)
  },
}
