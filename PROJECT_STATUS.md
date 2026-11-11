# Project Status — ASEC Automation website (free static edition)

_Last updated: 9 November 2026_

## Scope decision
Built as a **free-to-host static website** instead of the full-stack system in the master prompt
(React/Express/PostgreSQL/Prisma + admin CMS). Content is edited in typed files under `src/content/`
rather than through an admin dashboard. Owner decisions applied: **placeholders only** (no facts or photos
reused from the earlier site or company profile), the four storytelling countries start **unpublished**,
and this is a **new separate project** — the existing asec-portfolio site is untouched.

## Brand update (9 Nov 2026)
- Official ASEC logo, tagline and colour palette applied across the site (header, footer, favicon, social image).
- Headings now use Montserrat to match the logo; navy #040F47 replaces the provisional palette; brand red is used for small accents only.
- Text tints of the brand blue (#5AA6E6 on navy, #1766A6 on light) were derived so small text meets WCAG AA contrast.
- Logo files were extracted from the supplied images to transparent PNGs; an SVG master from ASEC would be sharper.

## Done
- 13 public pages + 6 expertise detail pages + Cement page + Privacy, Terms, Cookies, branded 404 (24 prerendered HTML files)
- Cinematic homepage with all 12 sections from the brief
- Design system (official ASEC palette, Montserrat/Inter, dark/light alternating sections)
- Central image registry (48 slots), designed `ImagePlaceholder`, drop-in file replacement, `IMAGE_REQUIREMENTS.md` generator
- Content approval statuses with visible review markers + one-click "Hide markers"
- Interactive cement process diagram (10 areas, keyboard accessible, mobile button list)
- Interactive stylised world map (pan, zoom, keyboard markers, relationship filters, list alternative)
- AI/Innovation page with synthetic demo dashboard (4 charts, hover tooltips, table view, "Illustrative Demo — Not Live Plant Data")
- Contact form: validation, honeypot, consent, honest "not connected" state, real delivery once an endpoint is set
- Search/filter UIs for projects, news, careers (ready for content)
- SEO: prerendered HTML, unique titles/descriptions, canonical, Open Graph, sitemap.xml, robots.txt, Organization JSON-LD
- Accessibility: skip link, landmarks, focus styles, keyboard menus/dialogs, labelled forms, `prefers-reduced-motion`
- Hosting configs for Vercel and Netlify (security + caching headers)

## Verified in this session
- `npm run build` succeeds; 24 pages prerendered without errors
- Playwright run over 18 pages at 1440 px and 390 px: no console errors, no horizontal overflow
- Contact form: required-field errors shown and first field focused; valid submit shows "not sent / not connected" (no fake success)
- Client-side navigation updates URL and page title; cement diagram selection works
- Image drop-in tested: adding `public/images/home/home-hero.jpg` replaced the hero placeholder on rebuild

## Not verified / limitations
- **No TypeScript type-check** was run (React type definitions were unavailable offline in the build environment); esbuild compiles without type-checking. Run `npx tsc --noEmit` after `npm install -D typescript @types/react @types/react-dom` to add it.
- No automated unit/E2E test suite is included (checks above were scripted ad hoc).
- No Lighthouse audit was run.
- Google Fonts load from Google; host fonts locally if required by policy.
- World map is a stylised dot map from simplified outlines — not cartographically precise.

## Not included (needs paid hosting / server — from master prompt)
Admin dashboard & CMS, database, user roles, audit logs, media-library uploads with cropping,
job applications with CV upload, inquiry storage/inbox, scheduled publishing, Arabic/RTL translations.
Arabic: layout uses logical structure but no translation system is wired up.

## Next steps
1. Supply items in `CONTENT_APPROVAL_CHECKLIST.md` (logo, contacts, form endpoint, photos).
2. Push to a new GitHub repo and connect to Vercel or Netlify (free).
3. Set `REVIEW_MODE = false` and `siteUrl`, rebuild, launch.
