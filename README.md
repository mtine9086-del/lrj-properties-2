# LRJ Properties

Clean, static-first property website for Laksar / Haridwar.

## Financial-risk design

- No database
- No `/api` routes
- No AI, payment, email, maps, analytics or cloud-media SDK
- No API keys required
- No external font or image dependency in the application
- Contact is direct phone / WhatsApp
- Static export enabled in `next.config.ts`
- GitHub Pages deployment is configured through GitHub Actions

## Run locally

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

The production static output is generated in `out/`.

## Before handover

1. Replace the placeholder phone/WhatsApp number in `app/page.tsx` with the client's verified number.
2. Replace example property data with client-approved listings.
3. Verify all business claims before publishing.
4. Add only client-owned/licensed local images if required.
5. Never add an API key, billing-enabled service, or paid dependency without written client approval.

## Repository rule

This repository is source-controlled only. Do not commit `.env` files, credentials, private keys, ZIP backups, or production secrets.
