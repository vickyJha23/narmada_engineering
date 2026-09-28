# Knowing how many people visit the website

This site can report visitor numbers through three services. You do **not** have to use
all three — Google Analytics alone answers "how many people visited". Nothing is loaded
and no cookies are set until you fill in an ID, so the site stays fast and private by
default.

| Service | What it tells you | Cost |
| --- | --- | --- |
| **Google Analytics 4** | Visitors per day/month, which city and country they are in, mobile vs desktop, which sections they scrolled to, how many tapped Call or WhatsApp | Free |
| **Microsoft Clarity** | Video replays of real visits and heatmaps of where people tap | Free |
| **Plausible** | The same visitor counts as GA4, but cookie-free and much simpler | Paid |

---

## Step 1 — Get a Google Analytics Measurement ID

1. Go to <https://analytics.google.com> and sign in with the Google account you want to
   own the data.
2. **Admin** (bottom left) → **Create** → **Property**.
3. Property name: `Narmada Engineering Works`. Time zone: `India`. Currency: `Indian Rupee`.
4. Answer the business questions (Industry: *Manufacturing*, Size: whatever fits).
5. On the **Data collection** screen choose **Web**.
6. Website URL: your domain, e.g. `www.narmadaengineeringworks.com`. Stream name: `Website`.
7. Google shows a **Measurement ID** that looks like `G-XXXXXXXXXX`. Copy it.
8. On the same Web stream screen, open **Enhanced measurement → ⚙ → Page views → Show
   advanced settings** and **untick "Page changes based on browser history events"**.
   The site already reports every page change itself (with the correct page title);
   leaving this on counts each page twice.

## Step 2 — Put the ID into the site

In the project folder, copy `.env.example` to `.env` and fill in the ID:

```bash
cp .env.example .env
```

```ini
VITE_SITE_URL=https://www.narmadaengineeringworks.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Step 3 — Rebuild and upload

```bash
pnpm build
```

Upload the contents of `dist/` to your host (see the deployment section of `README.md`).

> The ID is read **at build time**, not at run time. Every time you change `.env` you must
> run `pnpm build` again and re-upload.

## Step 4 — Check that it works

1. Open your live site in a browser.
2. In Google Analytics go to **Reports → Realtime**.
3. You should appear as an active user within about 30 seconds.

If you see nothing, check:

- You rebuilt and re-uploaded after editing `.env`.
- Your browser is not blocking trackers (ad blockers hide you from Analytics).
- Your browser is not sending "Do Not Track" — the site honours it by default. To count
  those visitors too, set `VITE_ANALYTICS_RESPECT_DNT=false`.
- Tracking is deliberately switched off while running `pnpm dev`. To test locally, set
  `VITE_ANALYTICS_IN_DEV=true`.

---

## What gets reported

Alongside the standard page views, the site sends these events so you can see what
visitors actually do. They show up in GA4 under **Reports → Engagement → Events**.

| Event | Fires when someone… |
| --- | --- |
| `cta_click` | taps "Get a Quote", "Request a Quote", "View Our Products" or "Contact Us" |
| `whatsapp_click` | opens WhatsApp from the header, hero, product popup, floating button or CTA band |
| `call_click` | taps a phone number to call |
| `email_click` | taps the email address |
| `map_click` | opens the works address in Google Maps |
| `enquiry_submit` | sends the contact form (the `channel` tells you WhatsApp or email) |
| `product_filter` | filters the gallery by a category |
| `product_view` | opens a product photo in the popup |
| `gallery_load_more` | taps "Show more products" |
| `faq_open` | expands a question |
| `scroll_depth` | reaches 25%, 50%, 75% or 100% of the page |

The most useful report for a fabrication business is **Events → `whatsapp_click` and
`call_click`**: that is your enquiry count, not just your traffic.

---

## Link Analytics to Search Console

Once the site is verified in Google Search Console (see *Getting found on Google* in
`README.md`), link the two so Analytics shows **which Google searches brought each
visitor**:

1. Analytics → **Admin → Product links → Search Console links → Link**.
2. Choose the Search Console property, then the `Website` web stream → **Submit**.
3. After a day or two, **Reports → Acquisition → Search Console → Queries** lists the
   search terms people used (e.g. *stenter hot panel manufacturer*) and your position
   for each.

---

## Optional — Microsoft Clarity (watch real visits)

Clarity records anonymous replays and heatmaps, which is the fastest way to see whether
people find the Products section or drop off at the form.

1. Go to <https://clarity.microsoft.com> and sign in.
2. **Add new project** → name it `Narmada Engineering Works`, enter your site URL.
3. **Settings → Overview** shows the **Project ID** (a short code like `abcdefghij`).
4. Add it to `.env`:

   ```ini
   VITE_CLARITY_PROJECT_ID=abcdefghij
   ```

5. Rebuild and re-upload.

## Optional — Plausible (cookie-free)

If you would rather not use Google, Plausible gives you the same visitor counts without
cookies or a consent banner.

1. Sign up at <https://plausible.io>, add your domain.
2. Put the domain (no `https://`) in `.env`:

   ```ini
   VITE_PLAUSIBLE_DOMAIN=narmadaengineeringworks.com
   ```

3. Rebuild and re-upload.

## Optional — Cloudflare Web Analytics

If you host on Cloudflare Pages, you can switch on **Web Analytics** in the Cloudflare
dashboard with no code change at all. It gives visitor counts only — no events — so it
pairs well with, rather than replaces, the options above.

---

## A note on privacy

- No enquiry data is stored on this website. The contact form opens WhatsApp or your
  email app on the visitor's own device; the message never passes through a server.
- Analytics is disabled entirely until you add an ID.
- Google Analytics 4 never stores full IP addresses, and visitors sending a Do-Not-Track
  signal are skipped unless you turn that off.
- If you add analytics and your visitors include people in the EU or UK, you are expected
  to show a cookie notice for Google Analytics. Plausible and Cloudflare Web Analytics
  avoid that requirement because they set no cookies.
