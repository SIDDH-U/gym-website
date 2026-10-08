/**
 * IRONFORGE Unified Motion Design Tokens
 * Ensures a consistent, premium, frame-rate independent feel across the entire site.
 */

// Core Easings
export const EASINGS = {
  // Cubic-bezier for on-scroll & component entrances
  easeOut: [0.22, 1, 0.36, 1],
  // Cubic-bezier for looping/oscillating motions
  easeInOut: [0.65, 0, 0.35, 1],
  // Pure linear for marquee and slow background drift
  linear: [0, 0, 1, 1],
};

// Durations
export const DURATIONS = {
  entrance: 0.5,
  entranceFast: 0.35,
  entranceSlow: 0.65,
  routeTransition: 0.25,
};

// Springs
export const SPRINGS = {
  // Snappy UI spring
  ui: {
    type: 'spring',
    stiffness: 260,
    damping: 30,
    mass: 0.9,
  },
  // Softer return spring for slider and drag handles
  sliderReturn: {
    type: 'spring',
    stiffness: 180,
    damping: 26,
  },
  // Pill tab layout switch
  pill: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
};

// Stagger helper capped at 6 children max (remaining appear together)
export const getStaggerDelay = (index, baseDelay = 0, step = 0.06, maxChildren = 6) => {
  const cappedIndex = Math.min(index, maxChildren - 1);
  return baseDelay + cappedIndex * step;
};

// Global Viewport Intersection standard (play once per element, trigger slightly inside viewport)
export const VIEWPORT_ONCE = {
  once: true,
  margin: '-10% 0px',
  amount: 0.2,
};

// Route Transition variant: 12px translateY + opacity only, 0.25s
export const ROUTE_VARIANTS = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.routeTransition, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: DURATIONS.routeTransition, ease: EASINGS.easeInOut },
  },
};
