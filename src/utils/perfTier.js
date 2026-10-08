/**
 * IRONFORGE Adaptive Performance Tier Manager
 * Detects hardware concurrency, device memory, and runtime frame times.
 * Tiers: 'high' (default) | 'low'
 */

let currentTier = 'high';
const listeners = new Set();

// Initial hardware heuristics
if (typeof navigator !== 'undefined') {
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  if (cores <= 4 || memory <= 4) {
    currentTier = 'low';
  }
}

// Runtime frame-time detection for the first 2 seconds
if (typeof window !== 'undefined') {
  let frameCount = 0;
  let lastTime = performance.now();
  let totalTime = 0;
  const maxSamples = 100;

  const measureFrames = (now) => {
    const delta = now - lastTime;
    lastTime = now;

    if (delta > 0 && delta < 200) {
      frameCount++;
      totalTime += delta;
    }

    if (frameCount < maxSamples) {
      requestAnimationFrame(measureFrames);
    } else {
      const avgFrameTime = totalTime / frameCount;
      if (avgFrameTime > 20) { // Slower than ~50fps -> drop to low tier
        setPerformanceTier('low');
      }
    }
  };

  requestAnimationFrame((now) => {
    lastTime = now;
    requestAnimationFrame(measureFrames);
  });
}

export function getPerformanceTier() {
  return currentTier;
}

export function setPerformanceTier(tier) {
  if (currentTier !== tier) {
    currentTier = tier;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-perf-tier', tier);
    }
    listeners.forEach((cb) => cb(tier));
  }
}

export function subscribePerformanceTier(callback) {
  listeners.add(callback);
  callback(currentTier);
  return () => listeners.delete(callback);
}
