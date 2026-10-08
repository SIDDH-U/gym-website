# IRONFORGE — Premium Men's Gym Website

A production-ready, mobile-first website for **IRONFORGE** gym built with React 19, Vite, Tailwind CSS, Framer Motion, and HTML5 Canvas sprite particles.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production (Vercel / Netlify / Cloudflare)
```bash
npm run build
```
Production output will be generated in `dist/`.

---

## ⚙️ Content & Customization Guide (`src/config.js`)

All website content, WhatsApp numbers, coaches, transformation stories, programs, schedules, pricing tiers, and contact information are managed through a single master configuration file:

📁 **[`src/config.js`](file:///c:/Users/siddc/OneDrive/Desktop/Selling%20Websites/gym-website/src/config.js)**

### 1. Contact & WhatsApp Integration
```javascript
contact: {
  whatsappNumber: "919876543210", // WhatsApp number with country code (digits only)
  displayPhone: "+91 98765 43210",
  email: "info@ironforgegym.in",
  address: "123 Fitness Street, Nanded, Maharashtra 431601",
  hours: "Open 24/7 (All 365 Days)",
  googleMapsUrl: "https://maps.google.com/?q=IRONFORGE+Gym+Nanded"
}
```

### 2. Dedicated Programs & Weekly Splits
Edit or add signature programs in `CONFIG.programs`:
- Each program includes `slug`, `title`, `overview`, `whatsIncluded`, `weeklySchedule`, `whoItsFor`, and `assignedTrainerSlug`.
- Links to `/programs/:slug` (e.g. `/programs/strength-powerlifting`, `/programs/muscle-building`, `/programs/fat-loss-conditioning`).

### 3. Trainers & Credentials
Edit coaches in `CONFIG.trainers`:
- Each coach includes `slug`, `name`, `role`, `experience`, `specialty`, `stats`, `achievements`, and `coachedProgramSlugs`.
- Links to `/trainers/:slug` (e.g. `/trainers/marcus-vance`, `/trainers/david-chen`, `/trainers/alexander-cole`).

### 4. Membership Plans & Billing
Edit pricing in `CONFIG.pricingPlans`:
- Includes `headlineChips` for collapsed mobile view and `features` for full expanded list.
- Fixed benefits per plan with dynamic pricing for Monthly, Quarterly (10% off), and Yearly (25% off).

---

## 🖼️ Image Assets (`public/images/`)

Drop real images into `public/images/` using these exact filenames:

| File Path | Description | Recommended Dimensions |
| :--- | :--- | :--- |
| `public/images/hero-athlete.png` | Full-bleed hero athlete cutout / portrait | ~1000 × 1400 px |
| `public/images/program-strength.webp` | Strength & Powerlifting program image | ~800 × 600 px (4:3) |
| `public/images/program-muscle.webp` | Muscle Building program image | ~800 × 600 px (4:3) |
| `public/images/program-fatloss.webp` | Fat Loss & Conditioning image | ~800 × 600 px (4:3) |
| `public/images/trainer-1.webp` | Trainer 1 portrait (Marcus Vance) | ~600 × 800 px (3:4) |
| `public/images/trainer-2.webp` | Trainer 2 portrait (David Chen) | ~600 × 800 px (3:4) |
| `public/images/trainer-3.webp` | Trainer 3 portrait (Alexander Cole) | ~600 × 800 px (3:4) |
| `public/images/transform-1-before.webp` | Transformation 1 Before photo | ~600 × 750 px |
| `public/images/transform-1-after.webp` | Transformation 1 After photo | ~600 × 750 px |
| `public/images/cta-bg.webp` | Final CTA background banner | ~1600 × 900 px |

---

## 🌟 Key Features & Motion Specifications

1. **Embla Carousel Engine (Migration):**
   - **Programs:** Continuous smooth left-to-right drift using `embla-carousel-auto-scroll` (speed 0.7, `direction: 'backward'`), drag-free loop, Ken Burns zoom, and travelling border glow.
   - **Transformations:** Step autoplay every 4.5s (`embla-carousel-autoplay`), `watchDrag` filter ignoring pointer events on `[data-compare="true"]` so before/after image dragging never triggers slide changes.
   - **Trainers:** Step autoplay every 3.5s with centered active card and scaled-down dimmed neighbors (`scale-[0.86] opacity-40`).
   - Autoplay pauses on touch/mouse enter and resumes 1.5s after release. Auto-pauses when offscreen via `IntersectionObserver`.

2. **56px Thumb-Reachable "NEXT" Button & Circular Progress Ring:**
   - 56px orange circular button with double chevron (`››`) nudging right in loop.
   - Animated 2s expanding pulse ring.
   - SVG circular progress countdown timer filling over exact autoplay duration and restarting on slide change (pauses during user touch).
   - Bottom-right thumb-reachable position with bottom-left progress bar dots.

3. **Redesigned "Our Impact" Section:**
   - Animated orange ECG / heartbeat background line travelling continuously across the section.
   - Barbell assembly animation in header: center bar draws itself and weight plates slide in on both ends.
   - Big numbers (`clamp(56px, 14vw, 88px)`) with slot-machine / odometer digit roll, flashing white-hot for 150ms on landing with spark bursts.
   - Rotating ghost icons, self-drawing SVG rings, alternating fly-in entrance, diagonal light sweep, and pointer tilt physics (max 6°).

4. **Rebuilt 60fps Final CTA Drag Slider ("SLIDE BARBELL TO LIFT"):**
   - Framer Motion `motion.div` with `useMotionValue(x)`, `drag="x"`, `dragElastic={0}`, `dragMomentum={false}`, and `ResizeObserver` constraints.
   - ZERO React state re-renders during drag: updates live KG counter (`0 KG` to `100 KG`) and progress scaleX directly via refs and motion values at 60fps.
   - Idle state: shimmering label, flowing chevrons, and 3s idle nudge (16px forward and spring back).
   - Release <85%: spring smoothly back to start.
   - Release >=85%: spring to end, screen shake, white-hot flash, spark burst confetti, `navigator.vibrate([20,40,20])`, then opens the **Free Pass Bottom Sheet**.
   - If sheet is closed without submitting: handle smoothly resets to start so it can be slid again.
   - Persistent Claimed State: upon valid form submission (Name + 10-digit phone), saves `{ claimed: true, name, ts }` in `localStorage`. Replaces the slider with an animated checkmark inside a pulsing ring, "You're in, [first name]. We'll WhatsApp you shortly.", and a direct WhatsApp link. Relabels all "BOOK A FREE TRIAL" buttons to "TRIAL REQUESTED ✓".

5. **Compact Modern Footer:**
   - Centered flex-wrap chip grid showing all links without horizontal scrolling.
   - MapPin SVG icon and full copyright notice (`© 2026 IRONFORGE. All rights reserved.`).
   - Barbell "Back to Top" animated button and 3 quick action buttons (Directions, Call, Email).

6. **SEO, Open Graph & Analytics:**
   - Dynamic per-route page titles and meta descriptions (`/`, `/programs/:slug`, `/trainers/:slug`).
   - 1200×630 Open Graph & Twitter Card tags with dumbbell favicon (`/favicon.svg`).
   - Safe analytics helper tracking all lead-generation clicks (JOIN NOW, Free Trial claims, Pricing plan joins, Directions, Calls, and Barbell lifts).
