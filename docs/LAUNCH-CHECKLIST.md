# BDSMTest.top Launch Checklist

Updated: 2026-07-15

## Completed

- [x] Public GitHub repository with small, reviewable commits
- [x] Static Astro production build on Cloudflare Workers Static Assets
- [x] 32-question test, local scoring, progress recovery, results, and retake
- [x] Private Boundary Map excluded from scores, links, images, and analytics
- [x] Versioned result fragment, CRC32 validation, receiver view, and viral CTA
- [x] 1080 x 1350 PNG, native sharing, copy fallback, platform intents, and desktop QR
- [x] Homepage plus methodology, consent, privacy, terms, about, role hub, and 10 role guides
- [x] Canonical, sitemap, robots, JSON-LD, OG image, security headers, redirects, and real 404
- [x] Mobile/desktop responsive matrix, axe audit, unit tests, browser tests, and Lighthouse audit
- [x] Worker custom domains active for `bdsmtest.top` and `www.bdsmtest.top`

## Public Deployment

Current Worker: `bdsm-test`

Current Workers hostname: `bdsm-test.th-houtong.workers.dev`

Current authoritative nameservers: `jakub.ns.cloudflare.com`, `dell.ns.cloudflare.com`

- [x] Cloudflare zone active
- [x] Apex HTTPS returns the production site
- [x] Worker deployment and certificate active
- [ ] Redirect `https://www.bdsmtest.top/*` to the equivalent apex URL
- [ ] Enable DNSSEC and add the DS record at the registrar if required

## Search Activation

- [x] Confirm the apex homepage returns 200 with a valid certificate
- [x] Confirm `robots.txt` and both sitemap files resolve on the apex
- [ ] Add a Google Search Console Domain property using the provided DNS TXT record
- [ ] Submit `https://bdsmtest.top/sitemap-index.xml`
- [ ] Request indexing for the homepage after custom-domain checks pass
- [ ] Update the GitHub repository homepage from Pages to `https://bdsmtest.top`
- [ ] Disable or retain `noindex` on the public `workers.dev` fallback

## Editorial Gate

The current product accurately describes itself as research-informed and unvalidated. Before using `validated`, `scientific`, `clinical`, `diagnostic`, `most accurate`, or equivalent claims:

- [ ] Record review from a psychometric/research reviewer
- [ ] Record review from a kink-aware sex educator or therapist
- [ ] Record review from an experienced community educator
- [ ] Close all P0 content findings from those reviews
- [ ] Run and document cognitive interviews and the independent validation plan in the PRD

The transparent public-beta wording may be used before validation as long as the current limitations remain visible.

## Release Commands

For Cloudflare Git builds, use `npm run build` as the build command and
`npx wrangler deploy` as the deploy command. The `dist` asset directory is
declared in `wrangler.jsonc`, so no dashboard output-directory field is needed.

```bash
npm ci
npm test
npm run test:e2e
npm run build
npm run deploy:assets
```

## First 72 Hours

- [ ] Check Cloudflare Worker deployment and certificate status
- [ ] Check Search Console indexing and selected canonical
- [ ] Test one real iPhone share and one real Android share
- [ ] Test WhatsApp and Telegram result links end to end
- [ ] Confirm no answer, score, profile, or boundary data appears in network requests
- [ ] Keep advertising disabled until the first-view and result privacy rules are rechecked with a selected adult-friendly partner
