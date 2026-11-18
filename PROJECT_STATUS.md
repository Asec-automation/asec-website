# Project Status — ASEC Automation website

_Last updated: 18 November 2026_

## Status: live
The website is live at **https://www.asecautomation.com**. It is hosted on GitHub Pages, with the careers and
contact system on a Cloudflare Worker. It replaced the old WordPress site, which had been hacked and had stopped working.

## Done
- English and Arabic versions of every page (right-to-left, simple everyday Arabic)
- Home, About, Projects (each with its own page), Global presence, Partners, Careers, Contact, Privacy, Terms, Cookies, 404
- Headline "We automate industry. / You run it better."; "A part of Qalaa Holdings" line under the logo
- Company profile 2025 PDF to view or download (compressed from 66 MB to 14 MB)
- Certificates shown by name
- Careers: job openings as baby-blue tabs, apply with CV upload (PDF, DOC or DOCX, up to 5 MB), job alerts
- Careers admin at `/careers/admin/`: HR adds, edits and deletes jobs, with an inbox for applications, CVs, contact
  messages and job alerts
- Contact: map that opens Google Maps, WhatsApp, LinkedIn; Saudi and Libya addresses not shown
- 59 photos enhanced, with smaller copies for phones
- SEO: prerendered HTML, titles and descriptions, canonical and hreflang links, sitemap, robots.txt, Organization data
- Redirects from old site addresses (for example `/about-us`, `/contact-us`, `/career`)
- Security: HTTPS enforced, Content-Security-Policy and referrer policy on every page, admin secrets kept in Cloudflare
- `REVIEW_MODE = false` (all drafts approved)
- HR guides in English and Arabic, a project report and a launch write-up

## Launch (18 Nov 2026)
- DNS stays at Vodafone. Records: `@` A 185.199.108.153 and `www` CNAME asec-automation.github.io. Email records unchanged.
- Repo made public (required for free GitHub Pages; no secrets in it).
- GitHub Pages: source "GitHub Actions", custom domain www.asecautomation.com, Enforce HTTPS on.

## Still to do
- [ ] IT / Vodafone: back up the old hosting space, then take the old site offline
- [ ] IT: change the old hosting, FTP and database passwords
- [ ] Change the Cloudflare password (it was shared for the DNS work)
- [ ] Turn on two-factor login for all GitHub owners/admins and the Cloudflare account
- [ ] Add `cloudflareAnalyticsToken` and `googleSiteVerification` in `src/content/company.ts` when available
- [ ] Set up the Google Business Profile
- [ ] Replace stock photos with original project photos when available
- [ ] Final Arabic read-through
- [ ] Email copies of applications from the inbox (needs Cloudflare Email Routing, which needs the domain's mail on Cloudflare)

## Known limitations
- No TypeScript type-check runs in the build (esbuild compiles without type-checking).
- No automated test suite in the repo. Checks were run with Playwright scripts during development.
- Google Fonts load from Google.
