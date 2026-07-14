# BDSMTest.top

A private, research-informed BDSM preference test built as a static Astro site for Cloudflare Pages.

- Production deployment: <https://bdsm-test-dy4.pages.dev>
- Canonical domain: <https://bdsmtest.top> (DNS activation pending)
- Repository: <https://github.com/Copoder/bdsm-test>

## Development

```bash
npm install
npm run dev
```

## Quality gates

```bash
npm run check
npm test
npm run build
npm run test:e2e
```

## Deployment

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output: `dist`
- Node.js: `22`
- Production branch: `main`

The only canonical origin is `https://bdsmtest.top`.

Direct production deployment:

```bash
npm run deploy
```

Cloudflare Pages project: `bdsm-test`. The apex and `www` custom domains are registered on the project. Activating them requires adding `bdsmtest.top` as a Cloudflare zone and changing the registrar nameservers from DNSPod to the two nameservers assigned by Cloudflare.

Preview builds use the apex canonical, append `X-Robots-Tag: noindex`, and omit the sitemap when `CF_PAGES_BRANCH` is set to a branch other than `main`. The `pages.dev` runtime also receives a client-side noindex meta tag as defense in depth until it can redirect to the active custom domain.
