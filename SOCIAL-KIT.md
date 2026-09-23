# Facebook & Instagram — starter kit

**I could not create the accounts for you.** Signing up for Facebook or Instagram
needs a phone number to receive an OTP, an email inbox to confirm, and someone to
accept the terms of service — all things only you can do, and both platforms
prohibit anyone else from opening an account in your name. Creating a page under a
business name you own also has to be done by you, or the account risks being
suspended later.

So instead, everything that normally takes the longest is ready below: the images,
the exact text to paste, and the settings to pick. Setting the pages up should take
about fifteen minutes with this open beside you.

---

## Ready-made images

| File | Use it for |
| --- | --- |
| `public/brand/social-profile.png` (1024×1024) | Profile picture on Instagram, Facebook and WhatsApp Business. The monogram is centred so nothing is cut when the platform crops it to a circle. |
| `public/brand/social-cover.png` (1640×856) | Facebook page cover photo. |
| `public/og-image.jpg` (1200×630) | Automatically used when anyone shares the website link. Nothing to do. |
| `public/products/*.webp` (56 files) | Your post images. Every one already carries the Narmada watermark. |

---

## Step 1 — Create a Facebook Page

1. Log in to Facebook with a personal account (a Page must be attached to one).
2. Go to <https://www.facebook.com/pages/create>.
3. **Page name:** `Narmada Engineering Works`
4. **Category:** start typing `Industrial Company` — also add `Metal Fabricator`
   and `Manufacturer` if it lets you pick more than one.
5. **Bio** — paste this:

   > Industrial fabrication & sheet metal solutions. Stenter machine hot panels,
   > nozzle chambers, yarn trolleys, ducting, AHU parts, MS structures & portable
   > cabins. Made to your drawing in Umbergaon, Gujarat.

6. Upload `social-profile.png` as the profile picture and `social-cover.png` as the cover.
7. Fill in **Contact info**:
   - Phone: `+91 76985 55564`
   - Email: `narmada.engworks@yahoo.com`
   - Website: your domain once it is live
   - Address: `Survey No. 918, Bhomti Faliya, Village Solsumba, Umbergaon, Dist. Valsad, Gujarat 396165`
   - Hours: `Mon – Sat, 9:00 AM – 7:00 PM`
8. Turn on the **WhatsApp button** (Page → Edit action button → WhatsApp) and connect
   `+91 76985 55564`. For a fabrication business this is the button people actually press.

## Step 2 — Create the Instagram account

1. Install Instagram, sign up with `narmada.engworks@yahoo.com`.
2. **Username:** try `narmadaengineeringworks` — if taken, use
   `narmada_engworks` or `narmadaeng.works`. Keep it close to the company name.
3. **Name:** `Narmada Engineering Works`
4. Settings → Account type → **switch to a Professional / Business account**, category
   `Industrial Company`. This unlocks the contact buttons and the visitor statistics.
5. **Bio** — Instagram allows 150 characters, so paste this version:

   > Industrial Fabrication & Sheet Metal Solutions
   > Stenter panels • Nozzle chambers • Ducting • Cabins
   > 📍 Umbergaon, Gujarat | 📩 Send your drawing

6. Add the website link and the same phone/email/address as above.
7. Upload `social-profile.png` as the profile picture.

## Step 3 — Link the pages back to the website

This is the part that helps your search ranking: once Google can see that the site,
the Facebook Page and the Instagram account all belong to the same business, it
treats them as one entity.

Open `src/data/site.ts` and fill in the `social` list:

```ts
social: [
  { label: 'Facebook',  url: 'https://www.facebook.com/YourPage',   icon: 'facebook'  },
  { label: 'Instagram', url: 'https://www.instagram.com/YourHandle', icon: 'instagram' },
],
```

Then run `pnpm build` and re-upload. The icons appear in the website footer, and the
links are added to the site's structured data (`sameAs`) automatically. While the
list is empty, nothing is shown — which is why there are no social icons on the site
right now.

---

## First nine posts

Instagram shows your profile as a grid of three, so the first nine posts are what a
new customer actually judges you on. A good opening set, using photos you already have
in `public/products/`:

| # | Image | Caption |
| --- | --- | --- |
| 1 | `stenter-machine-hot-panels.webp` | Stenter machine hot panels, fabricated and finished at our Umbergaon works. Built to hold shape and sealing under continuous heat. |
| 2 | `ss-nozzle-chambers-cylindrical.webp` | Stainless steel nozzle chambers — fabricated to drawing for even air distribution across the width. |
| 3 | `yarn-trolley-with-bobbins.webp` | Yarn trolleys built for daily mill use: square frames, smooth castors, and pegs that hold their alignment. |
| 4 | `axial-fan-impeller-mounting-plate.webp` | Axial fan impeller and mounting plate, machined, assembled and balanced in house. |
| 5 | `bunk-house-container.webp` | Bunk house container ready for dispatch — cladding, door and frame all fabricated here. |
| 6 | `gi-transition-duct-reducer.webp` | GI transition duct. Clean seams, accurate angles, no site rework. |
| 7 | `powder-coating-finishing.webp` | Surface prep, priming and powder coating are done in house, so nothing waits on an outside vendor. |
| 8 | `heavy-ms-base-frame-skid.webp` | Heavy MS base frame and skid structure for a plant installation. |
| 9 | `packed-panels-for-dispatch.webp` | Packed and protected for transport. On-time dispatch is part of the job, not an afterthought. |

Close every caption with the same two lines:

> 📩 Send us your drawing on WhatsApp: +91 76985 55564
> 📍 Umbergaon, Dist. Valsad, Gujarat

## Hashtags

Paste these as the first comment rather than in the caption, so the caption stays clean:

```
#fabrication #sheetmetalfabrication #industrialfabrication #stentermachine
#textilemachinery #textileindustry #hvac #ducting #mssfabrication #steelfabrication
#umbergaon #valsad #vapi #gujaratindustry #makeinindia #engineeringworks
#jobwork #metalworking #manufacturing #customfabrication
```

## What to post afterwards

You do not need a content plan. Two posts a week of work you are already doing is
plenty, and the most effective ones for this trade are:

- A finished job photographed on the shop floor before packing.
- A before/after: raw sheet or drawing next to the finished part.
- A loaded truck on dispatch day.
- A short clip of bending, welding or rolling — process videos travel furthest.

Photograph against a plain wall or the shed floor in daylight, and shoot square or
vertical. If you want the watermark on new photos too, drop them into
`public/products/` and tell me — the same watermarking step can be re-run over them.

---

## One more thing worth doing first

If you only have time for one of these, make it a **Google Business Profile**, not
Instagram: <https://business.google.com>. It puts Narmada Engineering Works on Google
Maps with your phone number and photos, and for a local manufacturer it brings more
enquiries than social media does. It is free, and the description, hours, category and
address above can be pasted straight in.
