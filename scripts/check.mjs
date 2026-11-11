// Visual + console check of every page with Playwright (desktop & mobile).
import { chromium } from 'playwright'
import fs from 'node:fs'
const base = process.argv[2] || 'http://localhost:4173'
const pages = (process.argv[3] || '/').split(',')
const outDir = process.argv[4] || '/tmp/shots'
fs.mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch()
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: vp })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
  page.on('pageerror', (e) => errs.push(String(e)))
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' }).catch((e) => errs.push(String(e)))
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 60)) } window.scrollTo({ top: 0, behavior: 'instant' }) })
    await page.waitForTimeout(500)
    const slug = p === '/' ? 'home' : p.replace(/\//g, '_')
    await page.screenshot({ path: `${outDir}/${name}${slug}.png`, fullPage: true })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
    if (overflow) errs.push(`${p}: horizontal overflow at ${name}`)
  }
  console.log(name, errs.length ? errs.join('\n') : 'no errors')
  await ctx.close()
}
await browser.close()
