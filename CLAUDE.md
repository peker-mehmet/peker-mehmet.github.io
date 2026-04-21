# CLAUDE.md — Project Briefing for AI Assistants

This file is a permanent briefing for any AI assistant working on this codebase.
Read it fully before making any changes.

---

## 1. PROJECT OVERVIEW

- **Owner:** Dr. Mehmet Peker, Associate Professor of Psychology
- **Institution:** Ege University, Department of Psychology, İzmir, Turkey
- **Live site:** https://peker-mehmet.github.io
- **CMS (Decap):** https://courageous-clafoutis-36a19d.netlify.app/admin/
- **GitHub repo:** https://github.com/peker-mehmet/peker-mehmet.github.io

This is a personal academic website showcasing research, publications, scales/instruments, teaching, collaborations, and news. It is fully bilingual (Turkish default, English alternate).

---

## 2. TECH STACK

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS with custom design tokens |
| Output | Static export (`output: 'export'`) → GitHub Pages |
| CMS | Decap CMS via Netlify Git Gateway |
| Hosting | GitHub Pages (site) + Netlify (CMS auth only) |

**Routing:** All pages live under `/[lang]/` (e.g. `/tr/about`, `/en/publications`).  
**Default locale:** `tr` (Turkish). The root `/` redirects to `/tr/`.  
**Supported locales:** `en`, `tr` — defined in `src/lib/i18n.ts`.

**Static export notes:**
- No server-side rendering at runtime — everything is pre-rendered at build time.
- `next/image` must use `unoptimized: true`.
- `trailingSlash: true` is required for GitHub Pages directory routing.
- Dynamic routes (`[id]`) need `generateStaticParams()` to enumerate all paths.

---

## 3. PROJECT STRUCTURE

```
/
├── content/                    # All editable content (JSON + Markdown)
│   ├── site-config.json        # Owner info, institution, bio, links, education
│   ├── publications/           # One JSON file per publication
│   ├── scales/                 # One JSON file per scale/instrument
│   ├── projects/               # One JSON file per research project
│   ├── collaborations/         # One JSON file per collaboration
│   ├── news/                   # One Markdown file per news item (frontmatter)
│   └── teaching/
│       └── index.json          # All courses + supervision + office hours
│
├── public/
│   ├── admin/
│   │   ├── index.html          # Decap CMS dashboard
│   │   └── config.yml          # Decap CMS collections config
│   ├── images/                 # Profile photo and uploaded media
│   ├── downloads/              # CV PDFs, scale forms, scoring guides
│   ├── .nojekyll               # Prevents GitHub Pages from running Jekyll
│   └── index.html              # Root redirect with Netlify Identity token handling
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── page.tsx            # Root redirect (/ → /tr/), token detection
│   │   ├── globals.css         # Global Tailwind base styles
│   │   └── [lang]/
│   │       ├── layout.tsx      # Locale layout (Navbar + Footer)
│   │       ├── page.tsx        # Home page
│   │       ├── about/          # About page (bio, education, interests, languages)
│   │       ├── publications/   # Publications list with filters
│   │       ├── scales/
│   │       │   ├── page.tsx    # Scales list grouped by role
│   │       │   └── [id]/       # Individual scale detail page
│   │       ├── research/       # Research projects (active/planned/completed)
│   │       ├── news/           # News feed with category filter
│   │       ├── collaborations/ # Collaboration cards with stats bar
│   │       ├── teaching/       # Courses + supervision + office hours
│   │       └── contact/        # Contact form (Formspree) + info panel
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Responsive navbar with lang switcher
│   │   │   ├── Footer.tsx      # Three-column footer with social links
│   │   │   └── Header.tsx      # (page header wrapper)
│   │   ├── sections/           # Page-specific section components
│   │   │   ├── Hero.tsx / HeroSection.tsx
│   │   │   ├── BiographySection.tsx
│   │   │   ├── ResearchInterests.tsx
│   │   │   ├── Highlights.tsx
│   │   │   ├── NewsSection.tsx / NewsClient.tsx
│   │   │   ├── PublicationsClient.tsx
│   │   │   ├── ResearchClient.tsx
│   │   │   ├── ScalesClient.tsx
│   │   │   ├── SocialBar.tsx
│   │   │   └── ContactForm.tsx
│   │   └── ui/                 # Reusable design system components
│   │       ├── SectionTitle.tsx    # PageTitle + SectionTitle with eyebrow
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Tag.tsx
│   │       ├── CopyCitationButton.tsx
│   │       └── index.ts
│   │
│   ├── dictionaries/
│   │   ├── en.json             # All English UI strings
│   │   └── tr.json             # All Turkish UI strings
│   │
│   └── lib/
│       ├── content.ts          # All content readers + TypeScript types
│       ├── getDictionary.ts    # Loads the right dictionary for a locale
│       └── i18n.ts             # locales, defaultLocale, isValidLocale()
│
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions: build → deploy /out to Pages
├── next.config.js              # output: export, trailingSlash, unoptimized images
├── tailwind.config.ts          # Custom color tokens, fonts, component classes
└── CLAUDE.md                   # This file
```

---

## 4. CONTENT MANAGEMENT

### Decap CMS
- Dashboard at `/admin/` (served from `public/admin/`)
- Backend: Netlify Git Gateway (Netlify site: `courageous-clafoutis-36a19d.netlify.app`)
- CMS writes directly to the GitHub repo via Netlify Identity; changes trigger GitHub Actions build

### Content files & formats

| Collection | Location | Format | Reader function |
|---|---|---|---|
| Publications | `content/publications/*.json` | JSON | `getPublications()` |
| Scales | `content/scales/*.json` | JSON | `getScales()` |
| Research Projects | `content/projects/*.json` | JSON | `getProjects()` |
| Collaborations | `content/collaborations/*.json` | JSON | `getCollaborations()` |
| News | `content/news/*.md` | Markdown + frontmatter | `getNewsItems()` |
| Teaching | `content/teaching/index.json` | JSON (single file) | `getTeachingData()` |
| Site Config | `content/site-config.json` | JSON (single file) | `getSiteConfig()` |

All readers are in `src/lib/content.ts`. The `readJsonDir<T>()` helper scans a folder and returns all non-`_`-prefixed `.json` files as typed objects.

### Bilingual fields
Every content text field that appears on the site is an object with `en` and `tr` keys:
```json
{ "en": "English text", "tr": "Turkish text" }
```
The page component picks the right value: `field[lang] || field.en`.

### Site config notes
`content/site-config.json` contains `__note` and `__instructions` keys for human guidance. These are stripped at read time by `stripNoteKeys()` in `content.ts` and never reach the frontend.

---

## 5. DESIGN SYSTEM

### Colors (Tailwind custom tokens)

| Token | Hex | Usage |
|---|---|---|
| `navy-700` | `#1e3a5f` | Primary brand, headings, nav background |
| `navy-900` | `#0e1e33` | Footer background |
| `gold-400` | `#c9a84c` | Accent: links, badges, decorative rules |
| `warm-50` | `#faf8f5` | Page background |
| `warm-200` | `#e8e2d9` | Card borders |

Full palettes: `navy`, `gold`, `warm`, `slate` — all defined in `tailwind.config.ts`.

### Typography
- **Headings:** Crimson Pro (`font-display` class) — serif, used for names, titles, section headings
- **Body:** Inter (`font-body` class) — sans-serif, used for all body text, labels, UI

### Layout utilities (defined in globals.css or tailwind config)
- `container-main` — centered content wrapper with responsive horizontal padding
- `shadow-card` / `shadow-card-md` — card elevation system
- `font-display` / `font-body` — typography aliases

### Component conventions
- Cards: `rounded-2xl border border-warm-200 shadow-card` with a `h-[3px]` gold top accent strip
- Badges: `px-2.5 py-[3px] rounded text-[10px] font-semibold uppercase tracking-widest`
- Section headings: `PageTitle` component from `src/components/ui/SectionTitle.tsx` takes `eyebrow`, `children` (title), and `subtitle` props
- Gold accent rule: `h-px w-12 bg-gold-400` + dot + shorter line (decorative divider pattern used throughout)

---

## 6. PAGES

| Route | File | Data sources |
|---|---|---|
| `/` | `src/app/page.tsx` | — (redirects to `/tr/`, handles identity tokens) |
| `/[lang]/` | `src/app/[lang]/page.tsx` | `getSiteConfig()`, `getPublications()`, `getProjects()`, `getScales()`, `getNewsItems()` |
| `/[lang]/about` | `src/app/[lang]/about/page.tsx` | `getSiteConfig()` |
| `/[lang]/publications` | `src/app/[lang]/publications/page.tsx` | `getPublications()` |
| `/[lang]/scales` | `src/app/[lang]/scales/page.tsx` | `getScales()` (grouped by role: developed → adapted → translated) |
| `/[lang]/scales/[id]` | `src/app/[lang]/scales/[id]/page.tsx` | `getScales()` (single scale detail) |
| `/[lang]/research` | `src/app/[lang]/research/page.tsx` | `getProjects()` |
| `/[lang]/news` | `src/app/[lang]/news/page.tsx` | `getNewsItems()` |
| `/[lang]/collaborations` | `src/app/[lang]/collaborations/page.tsx` | `getCollaborations()` |
| `/[lang]/teaching` | `src/app/[lang]/teaching/page.tsx` | `getTeachingData()` |
| `/[lang]/contact` | `src/app/[lang]/contact/page.tsx` | `getSiteConfig()` (Formspree endpoint hardcoded in `ContactForm.tsx`) |

**Client vs server components:**
- Most pages are server components (no `'use client'`).
- Interactive pages use a client component for their dynamic parts: `PublicationsClient.tsx`, `ResearchClient.tsx`, `ScalesClient.tsx`, `NewsClient.tsx`, `ContactForm.tsx`.
- The server page passes pre-fetched data + dictionary as props to the client component.

---

## 7. DEPLOYMENT

### GitHub Pages (primary hosting)
- Trigger: push to `main` branch
- Workflow: `.github/workflows/deploy.yml`
- Steps: `npm ci` → `npm run build` → upload `./out` → deploy to Pages
- Live URL: https://peker-mehmet.github.io

### Netlify (CMS auth only)
- Netlify site: `courageous-clafoutis-36a19d.netlify.app`
- Purpose: hosts Netlify Identity for CMS login + provides Git Gateway to write to the repo
- Netlify does NOT serve the public website — GitHub Pages does
- CMS URL: https://courageous-clafoutis-36a19d.netlify.app/admin/

### Build command
```bash
npm run build
```
Output goes to `/out/`. Always run this locally before pushing to catch errors early.

---

## 8. IMPORTANT RULES

1. **Always run `npm run build` before committing** to catch TypeScript errors and broken static params.

2. **Never hardcode UI text in components.** All strings must come from `src/dictionaries/en.json` and `src/dictionaries/tr.json`. When you add a new key to one dictionary, add the Turkish equivalent to the other immediately.

3. **All bilingual content fields need both `.en` and `.tr` properties.** A missing `tr` field causes the page to silently fall back to English, which is acceptable, but a missing `en` field can cause crashes since `field.en` is the fallback.

4. **Keep `__note` keys out of production data.** The `_template.json` files contain `__note` guidance keys — do not copy them into real content files. `stripNoteKeys()` in `content.ts` strips `__`-prefixed keys at read time, but keeping the data clean is better practice.

5. **Profile photo:** place in `public/images/` and reference as `/images/filename.jpg` in `site-config.json`.

6. **Downloadable files (CV, scale forms, scoring guides):** place in `public/downloads/` and reference as `/downloads/filename.pdf`.

7. **Adding a new page:** you must also add its nav link to both `Navbar.tsx` and `Footer.tsx`, and add the route label string to both dictionaries under `nav.*`.

8. **Dynamic routes (`[id]`) need `generateStaticParams()`** to pre-render all pages at build time. Without this the static export will skip that page.

9. **Do not add npm packages** without a strong reason. The project intentionally has minimal dependencies. Markdown is parsed with a custom `mdToHtml()` function rather than a library.

10. **Formspree endpoint** is hardcoded at the top of `src/components/sections/ContactForm.tsx`. Update `FORMSPREE_ENDPOINT` there if the form ID changes.

---

## 9. KNOWN ISSUES & HISTORY

### Fixed: `TypeError: Cannot read properties of undefined (reading 'split')` on News page
- **Cause:** `content/news/README.md` was being picked up by `getNewsItems()` because it passed the `.endsWith('.md') && !f.startsWith('_')` filter. It had no `date` frontmatter, so `item.date` was `undefined`.
- **Fix:** Added `&& f.toLowerCase() !== 'readme.md'` to the file filter in `getNewsItems()`, plus a `.filter((item) => !!item.date)` guard after mapping. Also added a `if (!dateStr) return ''` guard in `NewsClient.tsx`'s `formatDate()`.

### Fixed: `Property 'collaborations' does not exist` TypeScript error in Footer.tsx
- **Cause:** `FooterDict` type in `Footer.tsx` did not include `collaborations` in its `nav` object type after the nav link was added.
- **Fix:** Added `collaborations: string` to the `FooterDict.nav` type definition.

### Scales section order
- The spec requires: **Adapted → Translated → Developed** (not alphabetical, not the order they were first implemented).
- `ScalesClient.tsx` renders sections in this order. Do not reorder them.

### Root redirect and Netlify Identity tokens
- Netlify Identity email links (password reset, invitations) land on the root `/` with a hash like `#recovery_token=xxx`.
- The root `app/page.tsx` is a client component that detects these tokens and redirects to `/admin/` + hash before doing the normal `/tr/` redirect.
- `public/admin/index.html` also logs token detection so the Netlify Identity widget can handle it.

### `public/index.html` vs Next.js generated root
- A `public/index.html` exists as a fallback redirect handler.
- During `npm run build`, Next.js generates `out/index.html` from `app/page.tsx` and overwrites the public file. The effective token-handling logic therefore lives in `app/page.tsx`.
