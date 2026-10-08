# IRONFORGE Performance & Smoothness Architecture

This document summarizes the comprehensive performance optimization and 60fps smoothness pass implemented across the IRONFORGE gym website.

---

## 1. Compositor-Friendly Animations (Zero Paint/Reflow Loops)
- **Transform & Opacity Exclusivity**: Every continuous animation strictly animates `transform` (`translate3d`, `scale3d`, `rotate`) and `opacity`. All animations on `box-shadow`, `text-shadow`, `background-position`, `width/height`, `top/left`, and `filter/blur` were eliminated.
- **Button Glow & Pulses**: Button glows were moved to `::before` pseudo-elements with pre-baked radial gradients animated solely via `opacity` (`glowOpacityPulse`).
- **Light Sweeps**: Implemented as oversized pseudo-elements animated via GPU `translate3d` with `skewX`, replacing repainting `background-position` animations.
- **Traveling Border Beams**: Conic gradients are pre-rendered on oversized pseudo-elements and rotated on the GPU compositor using `translate3d(0, 0, 0) rotate(...)`, eliminating per-frame `@property` or conic gradient repaints.
- **Mobile Backdrop Blur Elimination**: Removed `backdrop-filter: blur` on mobile viewports for the Navbar, Sticky Mobile Join bar, and Modal overlays in favor of solid `#0A0A0A` backgrounds (`lg:backdrop-blur-md` active on laptop only).

---

## 2. Off-Thread CSS Loops & LazyMotion Bundle Optimization
- **CSS Keyframes for Continuous Loops**: Ticker marquee, button glows, light sweeps, subtle float, ember glows, background text drift, and Ken Burns zooms are 100% CSS keyframes running off the JavaScript main thread.
- **Off-Screen Pause Coordinator**: A shared `useSectionVisibility` hook attaches `data-visible="true"|"false"` to each section. The global CSS rule:
  ```css
  [data-visible="false"] *,
  [data-visible="false"]::before,
  [data-visible="false"]::after {
    animation-play-state: paused !important;
  }
  ```
  completely halts animations when a section is scrolled out of the viewport.
- **LazyMotion Integration**: Root `<LazyMotion features={domAnimation} strict={false}>` with `m.` lightweight components eliminates the monolithic Framer Motion bundle overhead.
- **will-change Budget**: Constrained to ~8 essential continuous elements across the site (under the 15-layer budget).

---

## 3. Zero-Rerender Interaction Engine
- **Gesture Dragging & Sliders**:
  - **Transformations Before/After Slider**: Direct DOM manipulation (`style.left`, `style.width`) during pointer drag and on-view demo sweep. Zero React `useState` re-renders during dragging.
  - **Final CTA Barbell Slider**: Framer Motion `useMotionValue` directly drives handle position, scale, tilt, and live `textContent` for kilograms lifted. Zero React re-renders.
  - **Scroll Progress & Parallax**: Navbar progress bar and Hero parallax use `useScroll` motion values and direct transform refs without React state churn.
  - **Carousel Progress Ring**: Replaced 25ms `setInterval` React state loop with a GPU-accelerated CSS transition.
  - **Odometer Numbers & Intro Loader**: Numbers and loader progress update via `textContent` refs.
- **Component Memoization**: All section components (`Hero`, `Programs`, `Stats`, `Transformations`, `Trainers`, `Pricing`, `FinalCTA`, `Footer`, `Navbar`, `StickyMobileJoin`, `IntroLoader`) are wrapped in `React.memo`.

---

## 4. Single Particle Loop Coordinator & Adaptive Quality Tiers
- **Singleton Canvas Loop**: All particle canvases (`Hero`, `Stats`, `CTA`, `Footer`) share a single module-level `requestAnimationFrame` loop and pre-rendered offscreen sprite textures (`sparkSprite`, `chalkSprite`), eliminating `shadowBlur` and per-frame canvas allocations.
- **Time-Based Delta Physics**: All particle speeds and transitions are calculated in pixels per second (`dt = (now - lastTime) / 1000`), ensuring identical physical speed on 60Hz, 90Hz, 120Hz, and 144Hz displays.
- **Adaptive Performance Tiering (`src/utils/perfTier.js`)**:
  - Automatically detects hardware (`cores <= 4` or `memory <= 4`) and samples the first 100 frame durations.
  - If average frame times exceed 20ms (<50fps), the runtime switches to `'low'` tier:
    - Particle counts clamped to ~25.
    - Card 3D tilt disabled.
    - ECG heartbeat line hidden.
    - Border rotation and pulse loops slowed down.

---

## 5. Unified Motion Design System (`src/motion.js`)
All entrance and gesture animations use shared tokens:
- **Easings**:
  - `easeOut`: `[0.22, 1, 0.36, 1]` for entrances
  - `easeInOut`: `[0.65, 0, 0.35, 1]` for loops
  - `linear`: `[0, 0, 1, 1]` for ticker
- **Durations**: `0.5s` standard, `0.35s` fast, `0.65s` slow, `0.25s` route transition.
- **Springs**:
  - UI: `{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }`
  - Slider Return: `{ type: 'spring', stiffness: 180, damping: 26 }`
  - Pill Tab: `{ type: 'spring', stiffness: 400, damping: 30 }`
- **Stagger**: `60ms` per child, capped at 6 children max.
- **Viewport**: Triggered once per element with `margin: '-10% 0px'`.

---

## 6. Touch, Scroll & Asset Optimization
- **Native Scrolling**: Smooth native scrolling with `scroll-padding-top: 5rem` for sticky nav offset.
- **Touch Responsiveness**: `touch-action: manipulation` on buttons/links, `overscroll-behavior-y: none` on `body`, `touch-action: pan-y` on carousels/slider track with `touch-action: none` on drag handles.
- **Content Visibility**: `content-visibility: auto; contain-intrinsic-size: 1px 800px;` on all below-the-fold sections to skip layout/paint for off-screen sections.
- **Asset Preloading & Dimensions**:
  - Preloaded hero athlete image (`fetchpriority="high"`).
  - Explicit `width` and `height` with `loading="lazy"` and `decoding="async"` across all media.
  - Preconnected Google Fonts with `font-display: swap`.

---

## 7. Developer Performance Overlay
- Enabled by navigating to any page with `?fps=1` (e.g. `http://127.0.0.1:5173/?fps=1`).
- Displays live FPS, frame duration in ms, active performance tier, active section, and dropped frame counter.
- Automatically logs any frame spike >32ms with the corresponding section to the browser console.

---

## 8. Heaviest Sections & Solutions Applied
| Section | Original Bottlenecks | Solution Applied |
| :--- | :--- | :--- |
| **Hero** | `mousemove`/`orientation` setting state 60fps; `box-shadow` button breathe; `flickerOpacity` JS loop | Direct DOM transform ref; `opacity` pseudo-element glow; pure CSS `.text-glow-flicker` keyframe. |
| **Transformations** | `setSliderPos` inside `rAF` sweep and touch move; heavy backdrop blur | Direct DOM handle `left` / wrapper `width` updates; removed mobile blur. |
| **Final CTA** | `trailingSparks` state updates inside `x.on('change')` | Removed state loop from drag path; MotionValue updates text via `textContent` ref; soft return spring. |
| **Stats** | 3D card tilt setting state on pointermove; 4 odometer state timers | Direct DOM transform on tilt; offscreen ECG pause; memoized digit columns. |
| **Pricing** | `background-position` animated border beam; accordion re-renders | Pre-rendered rotated GPU conic pseudo-element; `m.div` spring pill. |
| **Carousels** | 25ms `setInterval` state update for progress ring | Off-thread GPU CSS progress ring transition. |
