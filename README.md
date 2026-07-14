# BDSMTest.top

A private, research-informed BDSM preference test built as a static Astro site for Cloudflare Workers Static Assets.

- Production deployment: <https://bdsmtest.top>
- Workers fallback: <https://bdsm-test.th-houtong.workers.dev>
- Canonical domain: <https://bdsmtest.top>
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

Cloudflare Workers Builds settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Node.js: `22`
- Production branch: `main`

The asset directory is declared in `wrangler.jsonc`; the Cloudflare dashboard
does not need a separate build-output-directory setting.

The only canonical origin is `https://bdsmtest.top`.

Direct production deployment:

```bash
npm run deploy
```

Cloudflare Worker: `bdsm-test`. The apex and `www` custom domains are active on the Cloudflare zone.

The `workers.dev` fallback uses the apex canonical and receives a client-side
`noindex` meta tag so search engines prefer the production domain.
