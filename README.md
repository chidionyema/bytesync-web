# bytesync-web

The Bytesync Ltd front door (crew#690). One founder, a crew of agents, one hive mind: the
site says so and shows it, with the crew's real public GitHub activity feeding the hero.

- **Stack:** Next.js 16 (App Router, static export), React 19, Tailwind 4, TypeScript.
- **Placement:** Cloudflare Pages free tier (idp ADR 0034, rung 4). Nothing runs on the cluster.
- **Brand is config:** `src/site.config.ts`. The hostname is `NEXT_PUBLIC_SITE_URL`; the real
  domain lands by changing one value (LAW 46). The company name changes there and nowhere else
  (crew#691).
- **Bleeding edge, progressively:** WebGL2 shader hero (`HiveField`), CSS scroll-driven
  animations, cross-document view transitions, Web Speech API with on-device recognition where
  Chrome offers it (`VoiceDock`), `⌘K` typed fallback everywhere. Every one of these degrades to
  a plain, fast page.
- **Content:** `src/content/*.ts`, typed, shaped as collections so a Payload CMS can be attached
  later without changing the pages. Payload itself is not deployed: it would need Postgres and
  a server on the node, and the placement ladder puts a rarely-changing parent site on the
  static rung.

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # -> out/
npm run test:unit    # vitest: intents, feed mapping, brand invariants
npm run test:e2e     # playwright + axe against out/
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit, build, Playwright+axe and Lighthouse
CI with thresholds (median of 3 mobile runs: performance ≥ 0.80, accessibility ≥ 0.95,
best practices and SEO ≥ 0.90; the mobile profile throttles CPU 4x, and the hero is gated off
software renderers and weak devices so that budget holds). Deploy (`deploy.yml`) publishes `out/` with wrangler on push to `main` and
then proves every page answers 200. Secrets are named, never pasted: `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`; variables `SITE_URL`, `CONTACT_EMAIL`, `CF_PAGES_PROJECT`.
