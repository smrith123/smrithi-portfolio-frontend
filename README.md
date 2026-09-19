# Smrithi Portfolio · Website

The public portfolio. Next.js App Router, Tailwind v4, `motion` for the scroll
work.

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000
```

| Variable | |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | The backend origin, without `/api` (a trailing `/api` or `/` is stripped). Default `http://localhost:5000`. Required on Vercel: the build fails without it or with a `localhost` value |
| `NEXT_PUBLIC_SITE_URL` | The public origin, e.g. `https://smrithi.example`. Used for canonical URLs, `sitemap.xml`, `robots.txt` and social cards. **Set it before launch.** On Vercel it falls back to the project's production URL. |
| `GOOGLE_SITE_VERIFICATION` | Optional. The token from Search Console's "HTML tag" method, for a URL-prefix property. Not needed for a Domain property, which is verified by DNS. |
| `SITE_SOCIAL_PROFILES` | Comma-separated profile URLs confirmed to be Smrithi's own. They become `sameAs` in the Person structured data. Leave empty until confirmed: the Instagram handle on the site came from the design file. |

## Where the content comes from

`src/lib/content.ts` is the only place the UI meets its data. It reads the
backend's public API with a 30-second timeout, long enough for a sleeping
Render free instance to wake. If the API cannot be reached:

- during `next build` and in development, the bundled copies in `src/content/`
  stand in, so a build never fails and the site shows the approved design;
- on the running production server, the last successfully generated page keeps
  being served, so an API blip never replaces the client's edits with the
  bundled seed copy. Next retries on the next request.

Pages are statically rendered and revalidate every 10 seconds, so an edit made in
the admin panel appears within a few seconds without a redeploy.

Components take plain props and never fetch, which is why connecting the backend
did not require touching any of them.

## Images

Uploaded media lives on Cloudinary, so `next.config.ts` allows
`res.cloudinary.com/xpkfxmgn/` (this project's cloud only; change the path if
the media moves to another Cloudinary account) in `images.remotePatterns`, and every photo goes through
`next/image`: resized per device, served as WebP, lazy below the fold. Measured
against Cloudinary's own `f_auto,q_auto` delivery on this account, Next's WebP
output was about a quarter smaller, so there is no custom Cloudinary loader.
The LCP images (hero paper and portrait, both `/content` panels, the work-page
banners) use `loading="eager"` + `fetchPriority="high"` rather than `preload`:
React then emits the head preload *with* `fetchpriority=high`, which `preload`
alone does not.

The files in `public/assets/` are the fallback copies. The live site loads the
same images from the backend's media library.

## SEO

- **Metadata:** `src/lib/site.ts` holds the site URL, the public routes, and
  `pageMetadata()`, which every page uses for its title, description,
  canonical URL, Open Graph and Twitter tags. Titles are absolute per page;
  descriptions restate the page's own copy.
- **Pages:** `/`, `/about`, `/social-media`, `/content`,
  `/content/professional-work`, `/content/self-content`, `/contact`. The About,
  Social media and Contact pages reuse the home page's sections unchanged. Away
  from the home page, menu links to those sections open their pages
  (`src/lib/links.ts`).
- **Crawling:** `robots.ts` allows everything public, including `/_next`
  assets. `sitemap.ts` lists `ROUTES`, and a new public route belongs there.
  The admin and the API send `X-Robots-Tag: noindex, nofollow` from their own
  hosts.
- **Structured data:** `src/lib/structured-data.tsx`. The home page has
  WebSite + Person, `/about` has ProfilePage, and the other pages have
  BreadcrumbList. It only states what the pages show.
- **Navigation for crawlers:** the menu is always in the HTML, `hidden` while
  closed, because search engines never click the menu button.
- **Share images:** each `opengraph-image.jpg` is a 1200×630 capture of that
  page's opening composition with the interface chrome (menu button, header
  bar, CTA buttons) hidden. The About, Social media and Contact pages use the
  home image. Recapture them if a page's opening image changes.

## Deploying to Vercel

Import this folder as its own Vercel project (framework Next.js, defaults
otherwise). Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL` for
Production, then deploy. Both are read at build time, so changing either one
needs a redeploy.

Wake the API (open `/api/health`) before deploying. The build fetches every
page's content, and a sleeping free instance can make the first requests slow;
if they fail, the build falls back to the bundled copy until the next
revalidation.

The site's origin must be in the backend's `CORS_ORIGIN`, or the contact form
fails. Page content is fetched on the server and is not affected.
