import React, { memo, useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { EASINGS, DURATIONS } from '../motion';

/**
 * Premium Gym Intro Loader
 * - Center barbell with weight plates sliding onto both ends
 * - 0-100% orange progress line
 * - Split-curtain horizontal reveal
 * - Skips automatically on repeat visits via sessionStorage
 */
function IntroLoader({ onComplete }) {
  const [isDone, setIsDone] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('ironforge_intro_seen') === 'true';
    } catch {
      return false;
    }
  });

  const progressTextRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (isDone) {
      onComplete?.();
      return;
    }

    const startTime = performance.now();
    const duration = 800; // 800ms fill
    let rAFId = null;

    const animateProgress = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);

      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${pct}%`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${pct / 100})`;
      }

      if (pct < 100) {
        rAFId = requestAnimationFrame(animateProgress);
      } else {
        setTimeout(() => {
          setIsDone(true);
          try {
            sessionStorage.setItem('ironforge_intro_seen', 'true');
          } catch {}
          onComplete?.();
        }, 100);
      }
    };

    rAFId = requestAnimationFrame(animateProgress);

    return () => {
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, [isDone, onComplete]);

  const handleSkip = () => {
    try {
      sessionStorage.setItem('ironforge_intro_seen', 'true');
    } catch {}
    setIsDone(true);
    onComplete?.();
  };

  if (isDone) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {!isDone && (
        <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center overflow-hidden">
          {/* Top Half Split Curtain */}
          <m.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.4, ease: EASINGS.easeInOut }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#0A0A0A] border-b border-[#2B2F33]/40 z-20"
          />

          {/* Bottom Half Split Curtain */}
          <m.div
            initial={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: EASINGS.easeInOut }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0A0A0A] border-t border-[#2B2F33]/40 z-20"
          />

          {/* Loader Content in Center */}
          <m.div
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: EASINGS.easeOut }}
            className="relative z-30 flex flex-col items-center justify-center w-full max-w-sm px-6"
          >
            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="absolute -top-24 right-4 text-xs font-mono tracking-widest text-[#C9CCCF] hover:text-[#E8590C] uppercase transition-colors px-3 py-1.5 rounded border border-[#2B2F33] cursor-pointer"
            >
              SKIP
            </button>

            {/* Brand Logo */}
            <div className="flex items-center gap-2 mb-6">
              <span className="font-heading text-3xl tracking-wider text-[#F2F2F0]">
                IRON<span className="text-[#E8590C]">FORGE</span>
              </span>
            </div>

            {/* Barbell Assembly Animation */}
            <div className="relative w-72 h-16 flex items-center justify-center mb-6">
              {/* Center Bar */}
              <div className="w-56 h-2.5 bg-gradient-to-r from-[#2B2F33] via-[#8E9398] to-[#2B2F33] rounded-full shadow-inner relative z-10 flex items-center justify-between px-10">
                {/* Knurling Texture Marks */}
                <div className="w-10 h-1.5 bg-[#161616]/40 rounded-xs" />
                <div className="w-10 h-1.5 bg-[#161616]/40 rounded-xs" />
              </div>

              {/* Left Plates Sliding In */}
              <m.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: DURATIONS.entranceFast, ease: EASINGS.easeOut }}
                className="absolute left-6 z-20 flex items-center gap-0.5"
              >
                {/* 25kg Plate Outer */}
                <div className="w-3.5 h-14 bg-gradient-to-r from-[#1A1A1A] via-[#2B2F33] to-[#0A0A0A] rounded-sm border-y border-l border-[#40454A] shadow-lg flex items-center justify-center">
                  <div className="w-0.5 h-6 bg-[#E8590C]/60 rounded-full" />
                </div>
                {/* 20kg Plate Inner */}
                <div className="w-3 h-12 bg-gradient-to-r from-[#1A1A1A] to-[#222] rounded-sm border-y border-[#3A3F44]" />
                {/* Barbell Collar Clip */}
                <div className="w-2 h-5 bg-[#C9CCCF] rounded-xs shadow" />
              </m.div>

              {/* Right Plates Sliding In */}
              <m.div
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: DURATIONS.entranceFast, ease: EASINGS.easeOut }}
                className="absolute right-6 z-20 flex items-center gap-0.5"
              >
                {/* Barbell Collar Clip */}
                <div className="w-2 h-5 bg-[#C9CCCF] rounded-xs shadow" />
                {/* 20kg Plate Inner */}
                <div className="w-3 h-12 bg-gradient-to-l from-[#1A1A1A] to-[#222] rounded-sm border-y border-[#3A3F44]" />
                {/* 25kg Plate Outer */}
                <div className="w-3.5 h-14 bg-gradient-to-l from-[#1A1A1A] via-[#2B2F33] to-[#0A0A0A] rounded-sm border-y border-r border-[#40454A] shadow-lg flex items-center justify-center">
                  <div className="w-0.5 h-6 bg-[#E8590C]/60 rounded-full" />
                </div>
              </m.div>
            </div>

            {/* Progress Bar & Numeric Indicator (Zero React re-render DOM update) */}
            <div className="w-full">
              <div className="flex justify-between items-center text-xs font-mono text-[#C9CCCF] mb-1.5 uppercase tracking-wider">
                <span>Forging Strength</span>
                <span ref={progressTextRef} className="text-[#E8590C] font-bold">0%</span>
              </div>
              <div className="w-full h-1 bg-[#1A1D20] rounded-full overflow-hidden border border-[#2B2F33]/50">
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-[#E8590C] to-[#FFA066] shadow-[0_0_8px_#E8590C]"
                  style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
                />
              </div>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(IntroLoader);
