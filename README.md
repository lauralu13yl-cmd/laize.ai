# laize.ai

> Find the AI that fits your world.

Single-file frontend prototype for **laize.ai** — an AI discovery and learning platform. One `index.html` file, no dependencies, no build step. Open in any browser.

---

## Screens

| Screen | How to reach it |
|--------|----------------|
| **Landing** | Default on load |
| **Onboarding** | Click "Create account" or "Get started" |
| **App shell** | Complete onboarding (or skip) |
| **Dashboard** | Click "My dashboard →" in the app shell |

Press `Esc` at any time to return to the landing page.

---

## Run locally

```bash
# Just open it
open index.html

# Or serve it
python -m http.server 3000
# then visit http://localhost:3000
```

---

## Deploy to GitHub Pages

```bash
git init
git add index.html README.md
git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/laize
git push -u origin main
```

Then: **Settings → Pages → main / root → Save**

Live at: `https://YOUR_USERNAME.github.io/laize`

---

## Design tokens

All colours are CSS variables at the top of `index.html`:

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#0f0d0a` | Nav bg, headings |
| `--sand` | `#f5f0e8` | Light text on dark |
| `--rust` | `#c85a38` | Primary CTA |
| `--sage2` | `#5a7d6a` | Free badge, done states |
| `--warm2` | `#a8845a` | Muted labels |
| `--cream` | `#faf8f4` | Card surfaces |

---

*Pure HTML + CSS + JS. No frameworks.*
