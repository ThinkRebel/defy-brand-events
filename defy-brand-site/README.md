# Defy & Brand Events — website

**We turn ideas into experiences.** Motion-first site (Next.js 15 · React 19 · GSAP + ScrollTrigger · Framer Motion), trilingual (NL / FR / EN), no CSS framework — plain CSS modules with the design tokens from the Figma file.

## Run

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /nl
npm run build && npm start
```

## Structure

```
app/
  layout.tsx                 fonts (Gilda Display + Figtree via next/font), global CSS
  [lang]/layout.tsx          nav, language switch, cursor, grain, footer, Organization/WebSite JSON-LD
  [lang]/page.tsx            home: Hero → Statement → Manifesto → Ring → Chain → About → Closer
  [lang]/[section]/          services overview · about · contact (segment names are localised)
  [lang]/[section]/[slug]/   nine service pages (Service + FAQ + Breadcrumb JSON-LD)
  api/contact/route.ts       form endpoint (set CONTACT_WEBHOOK_URL, else falls back to mailto:)
  sitemap.ts · robots.ts     hreflang-aware sitemap
components/                  Hero, Manifesto, Ring, Sections (Statement/Chain/AboutTeaser/Closer/Reveal),
                             Page (PageHero/ServiceBody/Steps/ContactForm), Nav, Cursor, JsonLd
content/                     nl.ts · fr.ts · en.ts — ALL copy lives here, typed by types.ts
lib/gsap.ts · lib/seo.ts     GSAP registration · metadata/hreflang/JSON-LD builders
public/assets/               chrome object, background, marks (from Figma)
```

## Routes

| | NL | FR | EN |
|---|---|---|---|
| Home | `/nl` | `/fr` | `/en` |
| Services | `/nl/diensten` | `/fr/services` | `/en/services` |
| Service | `/nl/diensten/geo` | `/fr/services/geo` | `/en/services/geo` |
| About | `/nl/over` | `/fr/a-propos` | `/en/about` |
| Contact | `/nl/contact` | `/fr/contact` | `/en/contact` |

Service slugs: `strategy` `brand-creative` `copywriting` `website-design` `marketing` `seo` `geo` `agent-ready` `agentic-workflow`.

## Editing copy

Everything a visitor reads is in `content/<lang>.ts`. English brand statements (WE TURN IDEAS INTO EXPERIENCES, DON'T BUILD A WEBSITE…, IF AI DOESN'T UNDERSTAND YOU…, TRIGGER/THINK/DECIDE/ACT/MEASURE/IMPROVE) are kept in English in every language on purpose. FR and EN are independent versions, not translations.

## Motion

- Hero: masked line reveal, chrome object with pointer parallax + float, fluo glow, words drift apart on scroll-out.
- Manifesto (pinned 260%): the object fills the screen out of focus, sharpens, spins and steps aside; the words arrive as blurred fluo shapes and only then become legible.
- Ring (pinned 300%): nine glass cards in a 3D circle — scroll rotates 1.5 turns, time keeps it drifting, pointer tilts it.
- `prefers-reduced-motion` disables every animation and the custom cursor.

## Before go-live

- [ ] Replace `marketing@defyandbrandevents.be` in `content/index.ts` if different.
- [ ] Add `public/og.jpg` (1200×630).
- [ ] Set `CONTACT_WEBHOOK_URL` (or swap the API route for your mail provider).
- [ ] Confirm the "within two working days" promise in `contact.confirm`.
