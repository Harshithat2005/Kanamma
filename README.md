# Kannamma — Website

A premium maternal healthcare platform featuring a smart ring ecosystem. The project includes a **static landing page** and a **Next.js web application** with role-based dashboards.

---

## Project Structure

```
kannamma-website/
├── index.html              — Static landing page (standalone)
├── mother-symbol.png       — Kannamma mother symbol/logo
├── ring3d.jpeg             — 3D heart-shaped smart ring image
├── ringcuff.jpeg           — Rose gold engraved ring (close-up)
├── assets/
│   └── videos/
│       └── ring-showcase.mp4   — Ring product showcase video
└── nextjs-app/             — Next.js web application
    ├── src/
    │   ├── app/
    │   │   ├── (main)/     — Main marketing pages
    │   │   ├── anc/        — ANC (Antenatal Care) dashboard
    │   │   ├── asha/       — ASHA worker dashboard
    │   │   ├── doctor/     — Doctor dashboard
    │   │   ├── mother/     — Mother dashboard
    │   │   ├── login/      — Login page
    │   │   ├── layout.tsx  — Root layout
    │   │   ├── page.tsx    — Home page
    │   │   └── globals.css — Global styles
    │   └── components/
    │       ├── AISection.tsx
    │       ├── CTASection.tsx
    │       ├── EcosystemSection.tsx
    │       ├── Footer.tsx
    │       ├── HeroSection.tsx
    │       ├── Navbar.tsx
    │       ├── ProblemSection.tsx
    │       └── RingRevealSection.tsx
    └── public/
        ├── mother-symbol.png
        ├── ringcuff.jpeg
        └── assets/
```

---

## How to Run

### Static Landing Page

No server needed — just open `index.html` in your browser.

```bash
# Option 1: Double-click index.html

# Option 2: Use a local server
python3 -m http.server 8080
# → open http://localhost:8080
```

### Next.js App

```bash
cd nextjs-app
npm install
npm run dev
# → open http://localhost:3000
```

---

## Tech Stack

### Static Page
- HTML, CSS, JavaScript
- Google Fonts — Cormorant Garamond + DM Sans

### Next.js App
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

---

## Features

### Landing Page
✅ Animated hero with floating ring  
✅ Mouse parallax on ring  
✅ Floating particles  
✅ Scroll reveal animations  
✅ Animated stat counters  
✅ ANC timeline animation  
✅ Heartbeat SVG animation  
✅ Ecosystem flow with travelling dots  
✅ Custom cursor  
✅ Fully responsive  

### Next.js App
✅ Role-based dashboards (Mother, Doctor, ASHA, ANC)  
✅ Login system  
✅ Reusable component library (Hero, Navbar, AI, CTA, Ecosystem, etc.)  
✅ Framer Motion animations  
✅ Recharts data visualizations  
✅ Responsive design with Tailwind CSS
