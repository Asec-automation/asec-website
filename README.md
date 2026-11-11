# ASEC Automation — Corporate Website (free static edition)

A fast, prerendered React + TypeScript website you can host **for free** on Vercel, Netlify,
Cloudflare Pages or GitHub Pages. No server, database or paid hosting is needed.

> This is the **static edition** of the master specification. It covers the full public
> website. The admin dashboard/CMS, database and server-side features from the master prompt
> need paid hosting and are **not** included — see `PROJECT_STATUS.md`.

## Requirements
- [Node.js](https://nodejs.org) 20 or newer (LTS). Works on Windows, macOS and Linux.

## Quick start
```bash
npm install          # once
npm run build        # builds the site into dist/
npm run serve        # preview at http://localhost:4173
```
Edit files in `src/`, run `npm run build` again, and refresh.

## Deploy for free
The `dist/` folder is a complete static website (one prerendered HTML file per page).

**Vercel** — import the GitHub repo → Framework preset: *Other* → Build command `npm run build`
→ Output directory `dist`. (`vercel.json` is included.)

**Netlify** — New site from Git → Build command `npm run build` → Publish directory `dist`.
(`netlify.toml` is included.)

**Cloudflare Pages** — Build command `npm run build`, output `dist`.

**GitHub Pages** — run `npm run build` and publish `dist/` (e.g. with the
`actions/upload-pages-artifact` action). Use a custom domain or root repository so links resolve from `/`.

After choosing a domain, set `siteUrl` in `src/content/company.ts` (used for canonical URLs and the sitemap).

## Where to edit things
| What | File |
|---|---|
| Company name, tagline, contact details, social links, form endpoint | `src/content/company.ts` |
| Expertise / service pages | `src/content/expertise.ts` |
| Solutions, industries, countries, projects, partners, articles, jobs, leadership, values | `src/content/catalogue.ts` |
| Cement process areas (interactive diagram) | `src/content/cement.ts` |
| Image slots (IDs, sizes, file paths) | `src/config/images.ts` |
| Colours, fonts, spacing (design system) | `src/styles.css` (`:root` variables) |
| Navigation menu | `src/components/Layout.tsx` (`NAV`) |
| Page titles & meta descriptions | `src/routes.tsx` |

Every piece of content has an approval status (`confirmed`, `proposed`, `missing`).
While `REVIEW_MODE = true` (in `company.ts`) the site shows draft badges and image-slot labels so reviewers
can see what still needs approval. **Set `REVIEW_MODE = false` before going live** — unpublished countries,
placeholder leadership cards and review notes are then hidden.

## Images
All images are placeholders until you add your photos. See **`IMAGE_REQUIREMENTS.md`** for every slot,
its size and its exact file path. Drop a file at that path in `public/`, rebuild, done — no code changes.
Replace the logo by adding `public/images/brand/logo-light.png` (or `.svg`).
Run `npm run images` to refresh the checklist and see which slots are filled.

## Contact form
Static sites can't send email by themselves. Create a free form endpoint (e.g. Formspree, Basin or Getform),
paste its URL into `formEndpoint` in `src/content/company.ts`, and rebuild. Until then the form validates input
and tells visitors clearly that online submission isn't connected — it never pretends a message was sent.

## Adding content
- **Project:** add an object to `projects` in `catalogue.ts` (set `clientVisible: true` only with client permission; `featured: true` to show on the homepage).
- **Article:** add to `articles`. **Job:** add to `jobs` (with an `applyEmail`). **Partner:** add to `partners` with its category and a `PARTNER_LOGO_xx` image.
- **Country relationship:** in `countries`, set `relationship` (e.g. `'Office'`) and `published: true` once approved.

## Scripts
| Command | Does |
|---|---|
| `npm run build` | Detect images, bundle, prerender all pages to `dist/` |
| `npm run serve` | Serve `dist/` locally |
| `npm run images` | Regenerate `IMAGE_REQUIREMENTS.md` |
| `npm run build:preview` | One self-contained HTML file in `preview/` (for quick sharing; uses `#/` URLs) |

## Tech
React 19 + TypeScript, bundled with esbuild, prerendered to static HTML at build time (good for SEO),
hand-written CSS design system, `react-icons` (Lucide set). No tracking, no cookies.

## Careers admin (HR login)

HR manages job openings at **/careers/admin** (not linked from the menu, hidden from search engines).
They sign in with a password, then add, edit, hide, reorder or delete jobs, or import/export the list
as an Excel-compatible CSV. Saved changes appear on the Careers page immediately.

One-time setup on Vercel:
1. **Storage** — Vercel → your project → Storage → *Create* → choose **Upstash / Redis (KV)**
   (free tier) → connect it to this project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
2. **Password** — Settings → Environment Variables → add
   - `CAREERS_ADMIN_PASSWORD` = the password for HR (12+ characters)
   - `CAREERS_TOKEN_SECRET` = any long random text (e.g. 40 random characters)
3. **Redeploy** the project.

Change the HR password any time by editing `CAREERS_ADMIN_PASSWORD` and redeploying.
Sessions last 8 hours; after 10 wrong passwords an address is blocked for 15 minutes.

## Job applications (CVs)

The Careers form emails each application, with the CV attached, to **careers@asecautomation.com**
via FormSubmit (formsubmit.co). After the site is live, send one test application: FormSubmit
emails careers@ an **Activate** link — click it once, and all later applications arrive normally.
