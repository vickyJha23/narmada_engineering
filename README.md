# Narmada Engineering Works — website

Marketing site for Narmada Engineering Works, Umbergaon (Valsad, Gujarat) — industrial
fabrication and sheet metal solutions.

Built with React 19 + TypeScript + Vite. It is a single long page, **prerendered to static
HTML at build time** so search engines and link previews read the full content without
running JavaScript.

All copy, contact details and the 56 product photos come from the company brochure.

---

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # -> dist/  (typecheck, bundle, prerender, sitemap)
pnpm preview    # serve dist/ at http://localhost:4173
pnpm lint
```

Deploy by uploading the contents of `dist/` to any static host.

---

## Configuration

Copy `.env.example` to `.env` and edit it. Every value is optional.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Live domain. Used for canonical URLs, `sitemap.xml` and schema.org data. |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 — visitor counts. |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity — session replays and heatmaps. |
| `VITE_PLAUSIBLE_DOMAIN` | Plausible — cookie-free visitor counts. |
| `VITE_ANALYTICS_IN_DEV` | `true` to test tracking on localhost. |
| `VITE_ANALYTICS_RESPECT_DNT` | `false` to also count Do-Not-Track visitors. |

These are read **at build time**. After editing `.env`, run `pnpm build` again.

**→ [ANALYTICS.md](ANALYTICS.md) walks through getting a Google Analytics ID step by step.**

---

## Project layout

```
public/
  brand/            logo variants extracted from the brochure (dark, light, mark)
  products/         56 product photos as .webp
  robots.txt        crawler rules + sitemap pointer
  site.webmanifest  PWA/install metadata
  _headers          cache + security headers (Netlify / Cloudflare Pages)
  og-image.jpg      1200×630 social share card
  hero-art.webp     brochure cover artwork used behind the hero

src/
  data/site.ts      ← all copy, contact details, capabilities, industries
  data/products.ts  ← generated product catalogue (slug, title, category, size)
  lib/analytics.ts  GA4 / Clarity / Plausible loader + event tracking
  lib/seo.ts        schema.org graph and the FAQ content
  lib/links.ts      WhatsApp / tel / mailto / Google Maps links
  lib/hooks.ts      scroll reveal, sticky header, active section, modal helpers
  components/       Header, Hero, Sections, Products (gallery + lightbox), Contact, Footer
  index.css         the whole stylesheet, organised in numbered sections

scripts/
  prerender.mjs     renders <App /> into dist/index.html after the client build
  generate-sitemap.mjs  writes dist/sitemap.xml with an image entry per product
```

### Editing content

Almost everything a non-developer would want to change lives in **`src/data/site.ts`**:
phone numbers, email, address, working hours, the about paragraphs, vision, mission,
capabilities, industries served and the "why choose us" list.

FAQ answers live in `src/lib/seo.ts` (they are also emitted as FAQ structured data, so
editing them updates both the page and what Google sees).

### Adding or replacing a product photo

1. Put the image in `public/products/` as `.webp` (roughly 4:3, plain background works best).
2. Add an entry to `src/data/products.ts`:

   ```ts
   {
     slug: 'new-product-name',
     title: 'New Product Name',
     category: 'Ducting & Hoods',   // must be one of productCategories
     src: '/products/new-product-name.webp',
     width: 1000,
     height: 750,
   },
   ```

3. Run `pnpm build`. The gallery, the category counts, the schema.org catalogue and
   `sitemap.xml` all pick it up automatically.

To add a **new category**, add the name to `productCategories` in the same file.

---

## How the SEO is set up

- **Prerendered HTML.** `pnpm build` runs the client build, then an SSR build, then
  `scripts/prerender.mjs` renders the app with `renderToString` and injects the markup
  into `dist/index.html`. The browser hydrates that same markup. Crawlers that do not run
  JavaScript still see roughly 69 kB of real content.
- **Structured data.** `src/lib/seo.ts` builds a schema.org `@graph` with
  `Organization`/`LocalBusiness` (address, geo coordinates, both phone numbers, opening
  info), `WebSite`, `WebPage`, an `OfferCatalog` listing all 56 products by category,
  `Service`, and an `FAQPage`. It renders inside the page, so it is part of the static HTML.
- **Meta tags.** Title, description, keywords, canonical, robots, Open Graph, Twitter
  card and `geo.*` local-business hints are all in `index.html`.
- **Sitemap.** `dist/sitemap.xml` includes an `<image:image>` entry for every product
  photo with a caption, so the catalogue can surface in Google Images.
- **`robots.txt`** points at the sitemap.
- **Accessibility and semantics**, which search engines also weigh: one `<h1>`, ordered
  headings, a skip link, labelled form fields, descriptive `alt` text on every product
  image, `aria-current` on the active nav item, and a `<noscript>` fallback carrying the
  company name, products, address and phone numbers.

### After you go live

1. Point `VITE_SITE_URL` at the real domain and rebuild — the canonical URL, sitemap and
   structured data all follow it.
2. Update the hard-coded domain in `index.html` (canonical + `og:url` + `og:image`) and in
   `public/robots.txt` if the domain differs from the default.
3. Add the site to [Google Search Console](https://search.google.com/search-console),
   verify ownership, and submit `https://yourdomain/sitemap.xml`.
4. Create a **Google Business Profile** for the Umbergaon works. For a local manufacturer
   this usually brings more enquiries than the website ranking alone — and it links back
   to the site, which helps the site too.
5. Check the structured data with the
   [Rich Results Test](https://search.google.com/test/rich-results).

---

## Deployment

The build output is plain static files. Any of these work:

**Netlify / Cloudflare Pages** — connect the repo, build command `pnpm build`, publish
directory `dist`. `public/_headers` is picked up automatically. Set the `VITE_*` variables
in the host's environment settings.

**Vercel** — framework preset *Vite*, build command `pnpm build`, output directory `dist`.

**Shared hosting (cPanel, Hostinger) or any nginx/Apache box** — run `pnpm build` locally
and upload everything inside `dist/` to the web root. Suggested nginx rules:

```nginx
location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
location ~* \.(webp|png|jpg|svg)$ { expires 30d; add_header Cache-Control "public"; }
location = /index.html { add_header Cache-Control "public, max-age=0, must-revalidate"; }
```

There is only one route (`/`), so no SPA rewrite rule is needed.

---

## Notes

- The contact form has no backend. It composes the enquiry and opens WhatsApp or the
  visitor's email client, so nothing is stored and there is no server to maintain. If you
  later want enquiries in an inbox or spreadsheet, swap `submit()` in
  `src/components/Contact.tsx` for a POST to Formspree, Netlify Forms or a Google Form.
- `public/brand/logo-full.png` and `logo-full-light.png` (logo with tagline) are not used
  by the site but are kept as ready-to-use brand assets for letterheads and quotations.
- The website URL is currently a placeholder (`narmadaengineeringworks.com`). Replace it
  everywhere before launch — `.env`, `index.html`, `public/robots.txt`.
- Social profile links were not in the brochure. When the Facebook and Instagram pages are
  ready, add them to `site.ts` and to the `Organization` node's `sameAs` array in
  `src/lib/seo.ts` so Google can connect them to the business.
