import React, { memo, useState, useEffect, useRef } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Star, ChevronDown } from 'lucide-react';
import { CONFIG, getWhatsAppLink } from '../config';
import ParticleCanvas from './ParticleCanvas';
import { trackEvent } from '../utils/analytics';
import { EASINGS, DURATIONS } from '../motion';
import { useSectionVisibility } from '../hooks/useSectionVisibility';
import { getPerformanceTier } from '../utils/perfTier';

function Hero({ onOpenTrial }) {
  const prefersReduced = useReducedMotion();
  const [videoExists, setVideoExists] = useState(false);
  const [claimed, setClaimed] = useState(false);
  
  const [sectionRef] = useSectionVisibility();
  const parallaxRef = useRef(null);
  const ratingTextRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG.brand.localStorageKey);
      if (saved) setClaimed(true);
    } catch {}
  }, []);

  // Parallax scroll for text
  const { scrollY } = useScroll();
  const textScrollY = useTransform(scrollY, [0, 500], [0, 50]);

  // Video fallback check (metadata preload)
  useEffect(() => {
    if (prefersReduced) return;
    const video = document.createElement('video');
    video.src = window.innerWidth < 768 ? CONFIG.hero.videoMobile : CONFIG.hero.videoDesktop;
    video.onloadeddata = () => setVideoExists(true);
    video.onerror = () => setVideoExists(false);
  }, [prefersReduced]);

  // Zero-rerender Parallax (Desktop mouse / Mobile orientation via direct transform ref)
  useEffect(() => {
    if (prefersReduced || getPerformanceTier() === 'low') return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rAFId = null;

    const applyParallax = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rAFId = requestAnimationFrame(applyParallax);
      } else {
        rAFId = null;
      }
    };

    const triggerUpdate = () => {
      if (!rAFId) rAFId = requestAnimationFrame(applyParallax);
    };

    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 16;
      targetY = (e.clientY / window.innerHeight - 0.5) * 16;
      triggerUpdate();
    };

    const handleOrientation = (e) => {
      if (window.innerWidth >= 1024 || !e.gamma || !e.beta) return;
      targetX = Math.min(Math.max((e.gamma / 45) * 10, -10), 10);
      targetY = Math.min(Math.max(((e.beta - 45) / 45) * 10, -10), 10);
      triggerUpdate();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const handleTouch = () => {
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, { passive: true });
            }
          })
          .catch(() => {});
        window.removeEventListener('touchstart', handleTouch);
      };
      window.addEventListener('touchstart', handleTouch, { once: true, passive: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, [prefersReduced]);

  // Zero-rerender Rating count-up via textContent ref
  useEffect(() => {
    let count = 0;
    const target = CONFIG.hero.ratingScore || 4.9;
    const interval = setInterval(() => {
      count += 0.1;
      if (count >= target) {
        if (ratingTextRef.current) {
          ratingTextRef.current.textContent = `${target.toFixed(1)}/5`;
        }
        clearInterval(interval);
      } else {
        if (ratingTextRef.current) {
          ratingTextRef.current.textContent = `${count.toFixed(1)}/5`;
        }
      }
    }, 35);
    return () => clearInterval(interval);
  }, []);

  const scrollToPricing = (e) => {
    e.preventDefault();
    trackEvent('hero_join_click');
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrialClick = () => {
    trackEvent('hero_trial_click');
    if (claimed) {
      window.open(
        getWhatsAppLink('Hi IRONFORGE! I previously claimed a free pass and want to schedule my trial visit.'),
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      onOpenTrial();
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] h-[100svh] overflow-hidden bg-[#0A0A0A] flex flex-col justify-between select-none"
    >
      {/* LAYER 1: Full-Bleed Background Athlete Visual (Edge to Edge, 100svh) */}
      <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
        {/* Athlete Image with GPU Ken Burns & Parallax */}
        <div
          ref={parallaxRef}
          className={`absolute inset-0 w-full h-full ${prefersReduced ? '' : 'animate-ken-burns'}`}
        >
          <img
            src={CONFIG.hero.athleteImage}
            alt="IRONFORGE Athlete"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-top lg:object-[65%_center] filter brightness-[0.88] contrast-[1.08]"
          />
        </div>

        {/* Optional Video Layer */}
        {videoExists && !prefersReduced && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={CONFIG.hero.athleteImage}
            className="absolute inset-0 w-full h-full object-cover object-top lg:object-[65%_center] opacity-35 mix-blend-screen"
          >
            <source
              src={window.innerWidth < 768 ? CONFIG.hero.videoMobile : CONFIG.hero.videoDesktop}
              type="video/mp4"
            />
          </video>
        )}

        {/* Mobile Gradients (Solid Linear Gradients, No heavy blur overlays) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/75 to-transparent lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A] lg:hidden" />

        {/* Desktop Gradients */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent w-[65%]" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />

        {/* Static Film Grain Overlay (Small Tiled Static Image) */}
        <div className="absolute inset-0 film-grain opacity-60" />
      </div>

      {/* LAYER 2: Giant Outlined "IRON FORGE" Drifting in Background (CSS Loop) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-start select-none z-2">
        <div className={`font-heading text-[18vw] lg:text-[14vw] font-black uppercase text-stroke-subtle whitespace-nowrap opacity-20 leading-none tracking-tighter ${prefersReduced ? '' : 'animate-ironforge-drift'}`}>
          IRON FORGE
        </div>
      </div>

      {/* LAYER 3: Pulsing Ember-Orange Radial Glow Behind Text (CSS Loop) */}
      <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-radial from-[#E8590C]/35 via-[#E8590C]/10 to-transparent pointer-events-none z-3 ${prefersReduced ? 'opacity-35' : 'animate-ember-glow'}`} />

      {/* LAYER 5: Canvas Particle System (Singleton Loop) */}
      <ParticleCanvas mobileCount={45} desktopCount={65} className="z-4" />

      {/* Top Spacer for Fixed Nav */}
      <div className="h-16 sm:h-20" />

      {/* MAIN HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <m.div
          style={{ y: textScrollY }}
          className="max-w-2xl flex flex-col items-start text-left"
        >
          {/* Overline Badge */}
          <m.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.entrance, ease: EASINGS.easeOut }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161616]/95 border border-[#2B2F33] mb-3 text-[#E8590C] text-xs font-mono tracking-widest uppercase font-bold lg:backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#E8590C] animate-pulse" />
            <span>{CONFIG.hero.badge}</span>
          </m.div>

          {/* Headline Line 1: Mask Reveal */}
          <div className="overflow-hidden mb-1">
            <m.h1
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: DURATIONS.entranceSlow, ease: EASINGS.easeOut, delay: 0.1 }}
              className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F2F2F0] uppercase tracking-tight leading-[0.95]"
            >
              {CONFIG.hero.headlineLine1}
            </m.h1>
          </div>

          {/* Headline Line 2: "OWN YOUR POWER." with Forge-Heat Flicker Glow (CSS keyframes) */}
          <div className="relative mb-5">
            {/* Duplicated Glow Layer Behind animated purely by opacity */}
            <div
              className={`absolute inset-0 font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.95] text-[#FFA066] pointer-events-none select-none ${prefersReduced ? 'opacity-40' : 'text-glow-flicker'}`}
              style={{ filter: 'drop-shadow(0 0 12px #E8590C)' }}
              aria-hidden="true"
            >
              {CONFIG.hero.headlineLine2}
            </div>

            {/* Front Solid Orange Text */}
            <div className="relative font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.95] text-[#E8590C]">
              {CONFIG.hero.headlineLine2}
            </div>
          </div>

          {/* Subtext */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.entrance, ease: EASINGS.easeOut, delay: 0.25 }}
            className="text-[#C9CCCF] text-sm sm:text-base md:text-lg max-w-xl mb-7 leading-relaxed font-normal"
          >
            {CONFIG.hero.description}
          </m.p>

          {/* Staggered Action Buttons with Continuous GPU Motion */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.entrance, ease: EASINGS.easeOut, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-7"
          >
            {/* Primary Orange Button with Light Sweep & Arrow Nudge */}
            <a
              href="#pricing"
              onClick={scrollToPricing}
              className="h-14 px-8 rounded-sm bg-[#E8590C] hover:bg-[#FF6B1A] text-white font-heading text-lg tracking-wider uppercase flex items-center justify-center gap-3 btn-primary-sweep active:scale-[0.98] transition-transform"
            >
              <span>{CONFIG.hero.primaryCta}</span>
              <span className="text-xl inline-block animate-arrow-nudge">→</span>
            </a>

            {/* Outlined Button with Continuous Travelling Border Glow */}
            <button
              onClick={handleTrialClick}
              className="h-14 px-8 rounded-sm btn-outline-travel text-[#F2F2F0] hover:text-white font-heading text-lg tracking-wider uppercase flex items-center justify-center active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span>{claimed ? 'TRIAL REQUESTED ✓' : CONFIG.hero.secondaryCta}</span>
            </button>
          </m.div>

          {/* Social Proof: Avatars + 5 Stars + Count-up */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATIONS.entrance, delay: 0.45 }}
            className="flex items-center gap-3.5 pt-2 border-t border-[#2B2F33]/40 w-full sm:w-auto"
          >
            <div className="flex -space-x-2.5 overflow-hidden">
              {['avatar-1.webp', 'avatar-2.webp', 'avatar-3.webp', 'avatar-4.webp', 'avatar-5.webp'].map(
                (avatar, i) => (
                  <img
                    key={i}
                    src={`/images/${avatar}`}
                    alt="Member"
                    width={32}
                    height={32}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0A0A0A] object-cover bg-[#222]"
                    loading="eager"
                  />
                )
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[#E8590C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#E8590C" className="text-[#E8590C]" />
                ))}
                <span ref={ratingTextRef} className="font-heading text-xs sm:text-sm text-[#F2F2F0] ml-1">
                  {CONFIG.hero.ratingScore}/5
                </span>
              </div>
              <span className="text-[11px] text-[#C9CCCF] font-medium">
                {CONFIG.hero.ratingCountText}
              </span>
            </div>
          </m.div>
        </m.div>
      </div>

      {/* LAYER 8: Animated Scroll Cue */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: DURATIONS.entrance }}
        className="relative z-10 flex flex-col items-center justify-center gap-1 text-center pb-4"
      >
        <span className="text-[10px] font-mono tracking-widest text-[#C9CCCF]/70 uppercase">
          {CONFIG.hero.scrollCueText}
        </span>
        <div className={`text-[#E8590C] ${prefersReduced ? '' : 'animate-scroll-bounce'}`}>
          <ChevronDown size={16} />
        </div>
      </m.div>
    </section>
  );
}

export default memo(Hero);
