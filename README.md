# BDSMTest.top

A private, research-informed BDSM preference test built as a static Astro site for Cloudflare Pages.

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
