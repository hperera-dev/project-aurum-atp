# Project AURUM — Marketing Landing Page (Next.js 15)

Official marketing landing page for **Project AURUM** (*Private Fine Jewellery Ownership Vault & Zero-Knowledge Showroom Registry*), engineered by **Group SE-10** at the **Informatics Institute of Technology (IIT Sri Lanka)** in collaboration with the **University of Westminster**.

## Tech Stack
- **Framework:** Next.js 15 (App Router, Static Export `output: 'export'`) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Perceptual OKLCH Design Tokens (Deep Obsidian-Emerald & 22K Sovereign Bullion Gold)
- **3D & Motion:** Three.js (GPU-accelerated PBR 22K gold bangle + off-screen auto-sleep), Framer Motion (`useMotionTemplate` zero-rerender spotlight cards, shared-layout transitions, glassmorphic modals), GSAP (`ScrollTrigger`), Lenis smooth scrolling
- **Icons & Typography:** `@phosphor-icons/react` (`weight="light"`), Fontshare `Zodiak` & `Switzer`, `Azeret Mono` (`tabular-nums`)
- **Forms & Hosting:** Netlify Forms (`public/__forms.html` static build stub + `netlify.toml`) over HTTPS

## Local Development
```bash
npm install
npm run dev
```
Open `http://127.0.0.1:3000`.

## Production Build & Netlify Deployment
```bash
npm run build
```
Generates the static export inside `out/`. In Netlify Site Configuration:
- **Base directory:** `landing-page`
- **Build command:** `npm run build`
- **Publish directory:** `landing-page/out`
- **Forms:** Enable **Form Detection** in Netlify Dashboard → Forms to record live waitlist submissions.

## Contact
- Team & PDPA Data Controller: `aurumteam25@gmail.com`
- Repository: `https://github.com/hperera-dev/project-aurum-atp`
