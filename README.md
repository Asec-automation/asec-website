# ASEC Automation — Company Website

Live at **https://www.asecautomation.com** (launched 18 November 2026).

A fast, prerendered React + TypeScript website in English and Arabic. Pages are hosted free on
**GitHub Pages**. The careers and contact system (jobs, applications with CVs, contact messages, job alerts)
runs on a **Cloudflare Worker**.

```
Visitor ─▶ DNS (Vodafone) ─▶ GitHub Pages  (website files, HTTPS)
                                   │ forms
                                   ▼
                       Cloudflare Worker "asec-website"  (careers + inbox API, KV storage)
```

## How to update the website
1. Edit files in `src/` (see the table below).
2. Commit and push to `main`.
3. GitHub Actions (`.github/workflows/pages.yml`) builds the site and publishes it in about a minute.
   You can follow it in the repo's **Actions** tab.

Job openings don't need a code change. HR adds, edits and deletes them at
**https://www.asecautomation.com/careers/admin/**, which also holds the inbox.

## Run it on your computer
Needs [Node.js](https://nodejs.org) 20 or newer.
```bash
npm install          # once
npm run dev          # http://localhost:5173 — rebuilds and reloads when you save
npm run build        # builds the site into dist/
npm run serve        # preview dist/ at http://localhost:4173
```

## Where to edit things
| What | File |
|---|---|
| Company details, phone, WhatsApp, LinkedIn, addresses, site URL, API address | `src/content/company.ts` |
| Services / expertise pages | `src/content/expertise.ts` |
| Projects | `src/content/my-projects.ts`, `src/content/projects-extra.ts`, `projects` in `src/content/catalogue.ts` |
| Partners, industries, solutions, countries, leadership, values | `src/content/catalogue.ts` |
| Certificates | `src/content/company.ts` |
| Software and tools | `src/content/software.ts` |
| Cement process areas | `src/content/cement.ts` |
| Arabic translations (keyed by the English text) | `src/i18n/ar.json` |
| Page titles and descriptions | `src/routes.tsx` |
| Colours, fonts, spacing | `src/styles.css` |
| Images | `public/images/` (see `IMAGE_REQUIREMENTS.md`) |
| Company profile PDF | `public/docs/asec-automation-company-profile-2025.pdf` |

Use official brand files only. Don't recreate, stretch or recolour the logos.

## Arabic
Every page has an Arabic version under `/ar/` (right-to-left). The build translates text using
`src/i18n/ar.json`. When you add or change English text, add its Arabic line there. The build prints how many
strings are translated. Untranslated ones are mostly brand and product names.

## Careers and contact system (Cloudflare)
| Part | Where |
|---|---|
| Worker code | `worker/index.js`, `functions/api/careers.js`, `functions/api/inbox.js` |
| Settings | `wrangler.jsonc` (Worker name `asec-website`, KV namespace `CAREERS_KV`) |
| Address | `https://asec-website.sara-sabry.workers.dev` (`apiBase` in `company.ts`) |

- It only accepts calls from `https://www.asecautomation.com`, `https://asecautomation.com` and
  `https://asec-automation.github.io`.
- The admin password and token key are **Cloudflare secrets** (`CAREERS_ADMIN_PASSWORD`, `CAREERS_TOKEN_SECRET`).
  Never put them in this repo. This repo is public.
- To deploy Worker changes: `npx wrangler deploy` (signed in to the company Cloudflare account).

## DNS (at Vodafone, SolidCP panel)
| Name | Type | Value |
|---|---|---|
| (empty / @) | A | 185.199.108.153 |
| www | CNAME | asec-automation.github.io |

Keep the MX, TXT (SPF, google-site-verification), autodiscover, sip and Teams records as they are, because company email depends on them.

## Security
- HTTPS is enforced in GitHub Pages settings.
- Every page carries a Content-Security-Policy and a referrer policy (built in `scripts/build.mjs`). If you add
  a new outside service (a font, script, embed or form), add its address to the `CSP` list there, or it will be blocked.
- Admin sign-ins expire after 8 hours, and repeated attempts are rate-limited. CV links are signed and expire after 10 minutes.
- No passwords, keys or tokens belong in this repo.

## Scripts
| Command | Does |
|---|---|
| `npm run dev` | Build, serve and reload on every save |
| `npm run build` | Build and prerender all pages (English + Arabic) to `dist/` |
| `npm run serve` | Serve `dist/` locally |
| `npm run images` | Regenerate `IMAGE_REQUIREMENTS.md` |
| `npm run build:preview` | One self-contained HTML file in `preview/` for quick sharing |

## Tech
React 19 + TypeScript, bundled with esbuild, prerendered to static HTML at build time (good for SEO).
Custom i18n JSX runtime for Arabic. Hand-written CSS. Cloudflare Worker + KV for the careers and inbox API.
