# BDSMTest.top Launch Checklist

Updated: 2026-07-14

## Completed

- [x] Public GitHub repository with small, reviewable commits
- [x] Static Astro production build on Cloudflare Pages
- [x] 32-question test, local scoring, progress recovery, results, and retake
- [x] Private Boundary Map excluded from scores, links, images, and analytics
- [x] Versioned result fragment, CRC32 validation, receiver view, and viral CTA
- [x] 1080 x 1350 PNG, native sharing, copy fallback, platform intents, and desktop QR
- [x] Homepage plus methodology, consent, privacy, terms, about, role hub, and 10 role guides
- [x] Canonical, sitemap, robots, JSON-LD, OG image, security headers, redirects, and real 404
- [x] Mobile/desktop responsive matrix, axe audit, unit tests, browser tests, and Lighthouse audit
- [x] Pages custom-domain entries created for `bdsmtest.top` and `www.bdsmtest.top`

## DNS Activation

Current Pages project: `bdsm-test`  
Current Pages hostname: `bdsm-test-dy4.pages.dev`  
Current authoritative nameservers: `train.dnspod.net`, `golf.dnspod.net`

1. In the Cloudflare dashboard, add `bdsmtest.top` as a website/zone under account `Th.houtong@gmail.com's Account`.
2. Copy the two Cloudflare nameservers assigned to the new zone.
3. At the domain registrar, replace the current DNSPod nameservers with those two Cloudflare nameservers.
4. Wait until the Cloudflare zone reports `Active`.
5. In Workers & Pages > `bdsm-test` > Custom domains, confirm both domains become `Active`.
6. If Cloudflare does not create them automatically, add proxied CNAME records:
   - `@` -> `bdsm-test-dy4.pages.dev`
   - `www` -> `bdsm-test-dy4.pages.dev`
7. Verify `https://www.bdsmtest.top/*` returns 301 to the equivalent apex URL.
8. Enable DNSSEC in Cloudflare, then add the provided DS record at the registrar if required.

Do not publish or promote result links before the apex domain resolves: generated links intentionally use `https://bdsmtest.top/#r=...` rather than the temporary Pages hostname.

## Search Activation

- [ ] Confirm the apex homepage returns 200 with a valid certificate
- [ ] Confirm `robots.txt` and both sitemap files resolve on the apex
- [ ] Add a Google Search Console Domain property using the provided DNS TXT record
- [ ] Submit `https://bdsmtest.top/sitemap-index.xml`
- [ ] Request indexing for the homepage after custom-domain checks pass
- [ ] Update the GitHub repository homepage from Pages to `https://bdsmtest.top`
- [ ] Redirect or otherwise retire the public `pages.dev` alias after the apex is stable

## Editorial Gate

The current product accurately describes itself as research-informed and unvalidated. Before using `validated`, `scientific`, `clinical`, `diagnostic`, `most accurate`, or equivalent claims:

- [ ] Record review from a psychometric/research reviewer
- [ ] Record review from a kink-aware sex educator or therapist
- [ ] Record review from an experienced community educator
- [ ] Close all P0 content findings from those reviews
- [ ] Run and document cognitive interviews and the independent validation plan in the PRD

The transparent public-beta wording may be used before validation as long as the current limitations remain visible.

## Release Commands

```bash
npm ci
npm test
npm run test:e2e
npm run build
npx wrangler pages deploy dist --project-name bdsm-test --branch main
```

## First 72 Hours

- [ ] Check Cloudflare Pages deployment and certificate status
- [ ] Check Search Console indexing and selected canonical
- [ ] Test one real iPhone share and one real Android share
- [ ] Test WhatsApp and Telegram result links end to end
- [ ] Confirm no answer, score, profile, or boundary data appears in network requests
- [ ] Keep advertising disabled until the first-view and result privacy rules are rechecked with a selected adult-friendly partner
