# laize.ai

> Find the AI that fits your world.

A clean, production-ready frontend prototype for **laize.ai** — an AI discovery and learning platform. Built with vanilla HTML, CSS, and JavaScript. No dependencies, no build step, opens straight in a browser.

---

## What's inside

```
laize/
├── index.html   — All four screens (Landing, Onboarding, App, Dashboard)
├── styles.css   — Full design system + layout
├── app.js       — Screen routing + onboarding logic
└── README.md
```

---

## The four screens

| Screen | Description |
|--------|-------------|
| **B — Landing** | Public-facing homepage. Full-bleed editorial hero, sector strip, trending tools bar. |
| **OB — Onboarding** | Two-step flow after signup. Role selection → sector selection. Progress trail at top. |
| **A — App shell** | First post-login experience. Persistent sidebar, personalised welcome, curated tools. |
| **C — Dashboard** | Returning user view. Stats, learning path progress, saved tools, sector rankings. |

---

## How to run

**Option 1 — Just open it**
```
open index.html
```

**Option 2 — Local server (recommended)**
```bash
# Python 3
python -m http.server 3000

# Node (if you have http-server installed)
npx http-server .
```
Then visit `http://localhost:3000`.

---

## Design system

All design tokens live in `:root` in `styles.css`.

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#0f0d0a` | Primary text, nav background |
| `--sand` | `#f5f0e8` | Light text on dark, base background |
| `--rust` | `#c85a38` | Primary CTA, accents |
| `--sage2` | `#5a7d6a` | Success states, free badges |
| `--warm2` | `#a8845a` | Muted labels, secondary text |
| `--cream` | `#faf8f4` | Card and surface backgrounds |

Typography: Georgia serif for display headings, system-ui for all UI text.

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Return to landing page |

---

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Visit `https://yourusername.github.io/laize`

---

## Next steps

- [ ] Add tool detail page
- [ ] Add compare page (side-by-side tool table)
- [ ] Add learn / course path page
- [ ] Connect to a real backend or CMS
- [ ] Add auth (Supabase, Firebase, Clerk)
- [ ] Replace placeholder data with a tools API

---

*Built with no frameworks. Pure HTML + CSS + JS.*
