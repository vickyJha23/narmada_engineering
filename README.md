# Narmada Engineering Works — website

Marketing site for Narmada Engineering Works, Umbergaon (Valsad, Gujarat) — industrial
fabrication and sheet metal solutions.

Built with React 19 + TypeScript + Vite, routed with React Router and animated with GSAP.
Every route is **prerendered to its own static HTML file at build time**, so search engines
and link previews read each page's real content — and its own title, description, canonical
URL and structured data — without running JavaScript.

Copy and contact details come from the company brochure. Product photos come from the
brochure and from workshop photographs with the background removed; all of them carry the
Narmada watermark.

---

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # -> dist/  (typecheck, bundle, prerender every route, sitemap)
pnpm preview    # serve dist/ at http://localhost:4173
pnpm lint
```

Deploy by uploading the contents of `dist/` to any static host.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About us |
| `/capabilities` | Capabilities & services |
| `/products` | Product catalogue, filterable (`?category=…`) |
| `/products/<slug>` | One page per product — 68 of them |
| `/gallery` | Our work — shop-floor photographs |
| `/industries` | Industries served |
| `/contact` | Contact, map and enquiry form |

`src/data/pages.ts` is the single source for the page list: it drives the header and
footer navigation, each page's `<title>` and meta description, the breadcrumbs, the
prerender step and `sitemap.xml`. Add a page there and everything follows.

---

## Configuration

Copy `.env.example` to `.env` and edit it. Every value is optional.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Live domain. Used for canonical URLs, `sitemap.xml` and schema.org data. |
| `VITE_GOOGLE_SITE_VERIFICATION` | Google Search Console ownership code (HTML-tag method). |
| `VITE_BING_SITE_VERIFICATION` | Bing Webmaster Tools ownership code. |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 — visitor counts. |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity — session replays and heatmaps. |
| `VITE_PLAUSIBLE_DOMAIN` | Plausible — cookie-free visitor counts. |
| `VITE_ANALYTICS_IN_DEV` | `true` to test tracking on localhost. |
| `VITE_ANALYTICS_RESPECT_DNT` | `false` to also count Do-Not-Track visitors. |

These are read **at build time**. After editing `.env`, run `pnpm build` again.

**→ [ANALYTICS.md](ANALYTICS.md) walks through getting a Google Analytics ID step by step.**
**→ [SOCIAL-KIT.md](SOCIAL-KIT.md) has the images and copy for the Facebook / Instagram pages.**

---

## Project layout

```
public/
  brand/            logo variants extracted from the brochure (dark, light, mark)
                    plus social-profile.png / social-cover.png for the social pages
  products/         56 watermarked product photos as .webp
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
  data/pages.ts     ← the page table (routes, titles, descriptions, nav labels)
  data/gallery.ts   generated list of shop-floor photographs
  lib/animate.ts    GSAP: scroll reveals, hero timeline, parallax, pinned scroll
  lib/hooks.ts      sticky header, swipe, modal and body-lock helpers
  pages/            one component per route
  components/       Layout, Header, Hero, Sections, ProductGrid, Lightbox,
                    VideoSection, Contact, Footer, Seo
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

### The factory tour video

`VideoSection` shows a poster image with a "coming soon" note until a video exists. To
switch it on:

1. Put the file at `public/media/factory-tour.mp4` (H.264 MP4, 1080p, ideally under 20 MB —
   it is served as a plain static asset, not streamed).
2. Optionally replace `public/media/factory-tour-poster.jpg` with a still from the video.
3. In `src/data/site.ts`, set `video.available` to `true`.
4. `pnpm build` and re-upload.

The player stays behind the poster until someone presses play, so visitors who do not
watch it never download the file.

### Animation

GSAP with ScrollTrigger drives every scroll effect, in `src/lib/animate.ts`: batched scroll
reveals, the hero entrance timeline, scrubbed parallax, the scroll-progress bar and a
Ken-Burns push on the video poster and product photo. The stylesheet only supplies the
*initial* hidden state (`.reveal { opacity: 0 }`) so prerendered HTML never flashes before
GSAP takes over.

Two escape hatches keep content from being trapped behind an animation that never runs:
`<noscript>` in `index.html` forces every `.reveal` visible, and the reduced-motion media
query does the same for visitors who ask for less movement.

### Social links

The footer social icons and the schema.org `sameAs` links are both driven by the
`social` array in `src/data/site.ts`. It is empty, so **nothing social is shown on the
site today**. Paste the URLs in and they appear on the next build:

```ts
social: [
  { label: 'Facebook',  url: 'https://www.facebook.com/…',  icon: 'facebook'  },
  { label: 'Instagram', url: 'https://www.instagram.com/…', icon: 'instagram' },
],
```

### Adding or replacing a product photo

Every product photo carries a Narmada Engineering Works watermark in the bottom-right
corner — navy ink over a soft halo, so it stays readable on white studio backgrounds
and on dark mill-finish steel alike. Watermark any new photo the same way before
adding it.

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

- **Prerendered HTML, one file per route.** `pnpm build` runs the client build, then an SSR
  build, then `scripts/prerender.mjs` renders every route with `renderToString` and writes
  `dist/<route>/index.html` — 75 pages in all — each with its own title, description,
  canonical URL, Open Graph tags and JSON-LD swapped into the template. The browser
  hydrates the same markup, and `components/Seo.tsx` rewrites the head again on client-side
  navigation.
- **Structured data, per page.** `src/lib/seo.ts` builds a schema.org `@graph` for each
  route: `Organization`/`LocalBusiness` and `WebSite` everywhere, plus `BreadcrumbList` on
  inner pages, an `OfferCatalog` of the whole catalogue on `/products`, `Service` on
  `/capabilities`, `FAQPage` on `/contact`, and a `Service` node on every product page (made-to-drawing items have no list price, which Google requires for `Product`).
- **Meta tags.** Title, description, keywords, canonical, robots, Open Graph, Twitter
  card and `geo.*` local-business hints are all in `index.html`.
- **Sitemap.** `dist/sitemap.xml` lists all 75 URLs and includes an `<image:image>` entry
  with a caption for every product photo, so the catalogue can surface in Google Images.
- **`robots.txt`** points at the sitemap.
- **Motion** is decorative only. Every animation is CSS-driven and collapses under
  `prefers-reduced-motion: reduce`, so nothing is hidden from a visitor who turns
  animation off — the reveal classes fall back to fully visible.
- **Accessibility and semantics**, which search engines also weigh: one `<h1>`, ordered
  headings, a skip link, labelled form fields, descriptive `alt` text on every product
  image, `aria-current` on the active nav item, and a `<noscript>` fallback carrying the
  company name, products, address and phone numbers.

### Getting found on Google

The code side of SEO is done. Ranking now depends on Google knowing the site exists and
on other sites pointing to it — work that happens outside this repo. In order of impact:

1. **Set the domain.** Point `VITE_SITE_URL` at the real domain and rebuild — canonical
   URLs, sitemap and structured data all follow it. If the domain differs from the default,
   also update it in `index.html` (canonical, `og:url`, `og:image`) and `public/robots.txt`.
2. **Google Search Console** — <https://search.google.com/search-console>
   1. **Add property → URL prefix** → enter the live URL.
   2. Choose **HTML tag**, copy only the `content="…"` value into
      `VITE_GOOGLE_SITE_VERIFICATION` in `.env`, rebuild, upload, then press **Verify**.
      (If you manage DNS, the **Domain** property with a TXT record works too and needs no
      rebuild.)
   3. **Sitemaps** → submit `sitemap.xml`.
   4. **URL inspection** → paste the home page URL → **Request indexing**. Repeat for
      `/products` and `/contact`.
   5. Link it to Google Analytics — see [ANALYTICS.md](ANALYTICS.md).
3. **Google Business Profile** — <https://business.google.com>. For "fabrication near
   Umbergaon / Vapi" searches the map pack appears *above* normal results, so this is the
   fastest way to the top. Use exactly the same name, address and phone numbers as the
   website, pick *Metal fabricator* as the primary category, add the website link, upload
   the photos from `public/products/`, and ask existing customers for reviews.
4. **Bing Webmaster Tools** — <https://www.bing.com/webmasters>. Choose *Import from
   Google Search Console* (no code needed), or put the meta code in
   `VITE_BING_SITE_VERIFICATION`. Bing also feeds DuckDuckGo and Yahoo.
5. **Listings and backlinks.** Register the business, with the website link and identical
   address/phone, on IndiaMART, TradeIndia, Justdial, and any local industry association
   (e.g. UIA Umbergaon, VIA Vapi). Ask customers and suppliers to link to the site.
6. **Check structured data** with the
   [Rich Results Test](https://search.google.com/test/rich-results).

Expect new pages to be indexed within days, and ranking for competitive terms to build
over 2–6 months. The company name itself usually ranks first within a couple of weeks of
verification. Track progress in Search Console → **Performance**.

---

## Deployment

The build output is plain static files. Any of these work:

**Netlify / Cloudflare Pages** — connect the repo, build command `pnpm build`, publish
directory `dist`. `public/_headers` is picked up automatically. Set the `VITE_*` variables
in the host's environment settings.

**Vercel** — framework preset *Vite*, build command `pnpm build`, output directory `dist`.

**Shared hosting (cPanel, Hostinger) or any nginx/Apache box** — run `pnpm build` locally
and upload everything inside `dist/` to the web root.

Each route is a real directory with its own `index.html` (`dist/about/index.html`,
`dist/products/yarn-trolley/index.html`, …), so **no SPA rewrite rule is needed** and deep
links work even with JavaScript disabled. The server only has to serve directory indexes:

```nginx
try_files $uri $uri/ $uri/index.html =404;
error_page 404 /404.html;

location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
location ~* \.(webp|png|jpg|svg|mp4)$ { expires 30d; add_header Cache-Control "public"; }
location ~* \.html$ { add_header Cache-Control "public, max-age=0, must-revalidate"; }
```

On Apache, directory indexes are on by default; add `ErrorDocument 404 /404.html`.

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
- Social profile links were not in the brochure, so the footer shows none. Add them to
  `social` in `site.ts` (see above) and both the footer icons and the `sameAs`
  structured data follow automatically — no change needed in `src/lib/seo.ts`.
- The brochure described the company as a boiler manpower supplier. That line has been
  removed throughout at the owner's instruction; the capability card in its place is
  "Custom Fabrication to Drawing".
