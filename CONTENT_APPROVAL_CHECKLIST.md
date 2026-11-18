# Content Approval Checklist

Nothing below is published as fact until ASEC approves it. Tick each item, update the content file,
and change its `status` to `'confirmed'` (or set `published: true` for countries).

## 1. Confirmed (from the brief)
- [x] Company name: **ASEC Automation**
- [x] Industry focus: industrial automation, engineering, cement plant solutions, control systems,
      process optimisation, digital transformation
- [x] Cement industry as the priority sector
- [x] **Official logo** (light/dark wordmarks, full logo with tagline, globe symbol) — in `public/images/brand/`
- [x] **Official tagline:** “Innovating Industries, Powering Progress”
- [x] **Brand colours:** navy #040F47, blue #1C75BC, red #C11718, light grey #BCBEC0, dark grey #6D6E71
- [x] Countries to feature in storytelling: Egypt, Saudi Arabia, Philippines, Mexico (relationship **not** confirmed)

## 2. Proposed copy — needs approval (`src/content/…`)
- [ ] Hero headline "Engineering Intelligence. Automating Industry." and supporting line
- [ ] Alternative tagline "Driving Industrial Excellence Through Intelligent Automation."
- [ ] Short company description (footer, About)
- [ ] "Who we are" homepage narrative
- [ ] Vision and mission statements (About)
- [ ] Core values (6) — `catalogue.ts → values`
- [ ] Six expertise categories and all detail-page text — `expertise.ts`
- [ ] Ten solution categories (enable/disable/rename) — `catalogue.ts → solutions`
- [ ] Additional industries: Manufacturing, Energy, Industrial Infrastructure, Process Industries
- [ ] Sustainability themes; solar shown as **concept** until capability confirmed
- [ ] Innovation page: approval to publish the AI kiln-intelligence concept at all (currently labelled R&D concept, synthetic demo only)
- [ ] Careers culture text
- [ ] Privacy Policy, Terms of Use, Cookie text — **legal review required**

## 3. Missing information — please supply
- [ ] Vector (SVG) versions of the logo, if available — the current files were cut from the supplied images
- [ ] Contact email, phone number(s), office address(es)
- [ ] Social media URLs
- [ ] Form endpoint for the contact form (free Formspree/Basin/Getform account)
- [ ] Relationship category + description for each country (Office / Active project / Completed project / Client location / Target market)
- [ ] Leadership names, titles, bios, portraits (with consent)
- [ ] Approved projects (with client-name permission where shown)
- [ ] Approved partners/vendors/clients with category and written permission for logos
- [ ] Benefits, open positions and how to apply
- [ ] Any facts to add to About: founding year, headcount, certifications, track record
- [ ] Final domain name (`siteUrl`)
- [ ] All photographs — see `IMAGE_REQUIREMENTS.md`

## 4. Before launch
- [ ] Set `REVIEW_MODE = false` in `src/content/company.ts`
- [ ] Rebuild, click through every page on desktop and phone
- [ ] Confirm no "Draft", "Info needed" or "ADD IMAGE HERE" markers remain where content should be
