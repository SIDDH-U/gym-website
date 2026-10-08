import { useEffect, useRef } from 'react';
import { getPerformanceTier, subscribePerformanceTier } from '../utils/perfTier';

/**
 * Shared Pre-rendered Sprites (Singleton)
 * Generated once offscreen for guaranteed zero per-frame shadowBlur operations.
 */
let sparkSprite = null;
let chalkSprite = null;

function ensureSprites() {
  if (sparkSprite && chalkSprite) return;
  if (typeof document === 'undefined') return;

  sparkSprite = document.createElement('canvas');
  sparkSprite.width = 32;
  sparkSprite.height = 32;
  const sCtx = sparkSprite.getContext('2d');
  if (sCtx) {
    const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#FFA066');
    grad.addColorStop(0.25, '#E8590C');
    grad.addColorStop(0.65, 'rgba(232, 89, 12, 0.35)');
    grad.addColorStop(1, 'rgba(232, 89, 12, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 32, 32);
  }

  chalkSprite = document.createElement('canvas');
  chalkSprite.width = 24;
  chalkSprite.height = 24;
  const cCtx = chalkSprite.getContext('2d');
  if (cCtx) {
    const cGrad = cCtx.createRadialGradient(12, 12, 0, 12, 12, 12);
    cGrad.addColorStop(0, 'rgba(242, 242, 240, 0.8)');
    cGrad.addColorStop(0.4, 'rgba(201, 204, 207, 0.25)');
    cGrad.addColorStop(1, 'rgba(201, 204, 207, 0)');
    cCtx.fillStyle = cGrad;
    cCtx.fillRect(0, 0, 24, 24);
  }
}

/**
 * Unified Particle Loop Coordinator
 * Draws all visible particle canvases on the page in a single requestAnimationFrame loop.
 * Fully stops when no particle canvases are visible in the viewport.
 */
const activeCanvases = new Set();
let sharedAnimFrameId = null;
let lastTimestamp = performance.now();

function sharedLoop(timestamp) {
  const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
  lastTimestamp = timestamp;

  let hasVisibleCanvas = false;

  activeCanvases.forEach((instance) => {
    if (instance.isVisible) {
      hasVisibleCanvas = true;
      instance.render(dt);
    }
  });

  if (hasVisibleCanvas) {
    sharedAnimFrameId = requestAnimationFrame(sharedLoop);
  } else {
    sharedAnimFrameId = null;
  }
}

function startSharedLoopIfNeeded() {
  if (!sharedAnimFrameId && activeCanvases.size > 0) {
    lastTimestamp = performance.now();
    sharedAnimFrameId = requestAnimationFrame(sharedLoop);
  }
}

function createParticle(w, h, fromBottom = false) {
  const isSpark = Math.random() > 0.35;
  return {
    x: Math.random() * w,
    y: fromBottom ? h + Math.random() * 20 : Math.random() * h,
    size: isSpark ? Math.random() * 8 + 4 : Math.random() * 6 + 3,
    // Speed in pixels per second (Time-based physics for 60/90/120Hz parity)
    speedY: isSpark ? Math.random() * 60 + 35 : Math.random() * 35 + 15,
    speedX: (Math.random() - 0.5) * 25,
    opacity: Math.random() * 0.75 + 0.25,
    fadeSpeed: Math.random() * 0.35 + 0.15,
    isSpark,
  };
}

export default function ParticleCanvas({
  className = '',
  mobileCount = 45,
  desktopCount = 65,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ensureSprites();

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let currentTier = getPerformanceTier();
    const isMobile = window.innerWidth < 768;

    const getCount = (tier) => {
      if (tier === 'low') return 25;
      return isMobile ? mobileCount : desktopCount;
    };

    let count = getCount(currentTier);
    let particles = Array.from({ length: count }, () => createParticle(width, height));

    const instance = {
      canvas,
      isVisible: true,
      render: (dt) => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          // Time-based delta update
          p.y -= p.speedY * dt;
          p.x += p.speedX * dt;
          p.opacity -= p.fadeSpeed * dt;

          if (p.y < -20 || p.opacity <= 0 || p.x < -20 || p.x > width + 20) {
            Object.assign(p, createParticle(width, height, true));
            p.opacity = Math.random() * 0.8 + 0.2;
          }

          ctx.globalAlpha = p.opacity;
          const sprite = p.isSpark ? sparkSprite : chalkSprite;
          if (sprite) {
            ctx.drawImage(sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          }
        }

        ctx.globalAlpha = 1.0;
      },
    };

    activeCanvases.add(instance);
    startSharedLoopIfNeeded();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        instance.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          startSharedLoopIfNeeded();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Adaptive Performance Tier subscription
    const unsubscribeTier = subscribePerformanceTier((newTier) => {
      currentTier = newTier;
      const newCount = getCount(newTier);
      if (newCount !== particles.length) {
        particles = Array.from({ length: newCount }, () => createParticle(width, height));
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      unsubscribeTier();
      activeCanvases.delete(instance);
    };
  }, [mobileCount, desktopCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
