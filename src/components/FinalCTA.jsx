import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { m, useTransform, useScroll } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { CONFIG, getWhatsAppLink } from '../config';
import ParticleCanvas from './ParticleCanvas';
import { trackEvent } from '../utils/analytics';
import { EASINGS, DURATIONS } from '../motion';
import { useSectionVisibility } from '../hooks/useSectionVisibility';

function FinalCTA({ onOpenTrial }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const labelRef = useRef(null);
  const handleRef = useRef(null);
  const progressFillRef = useRef(null);

  const [sectionRef] = useSectionVisibility();
  const [maxDrag, setMaxDrag] = useState(260);
  const [claimedData, setClaimedData] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Gesture state refs (zero React re-render during dragging)
  const isDraggingRef = useRef(false);
  const startPointerXRef = useRef(0);
  const currentDragXRef = useRef(0);
  const maxDragRef = useRef(260);
  const animFrameRef = useRef(null);
  const hapticFlags = useRef({ 25: false, 50: false, 75: false });

  // Parallax background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  // Check localStorage for previously claimed pass and listen for real-time events
  useEffect(() => {
    const updateClaimed = () => {
      try {
        const saved = localStorage.getItem(CONFIG.brand.localStorageKey);
        if (saved) {
          setClaimedData(JSON.parse(saved));
        }
      } catch {}
    };

    updateClaimed();
    window.addEventListener('pass_claimed', updateClaimed);
    window.addEventListener('storage', updateClaimed);
    return () => {
      window.removeEventListener('pass_claimed', updateClaimed);
      window.removeEventListener('storage', updateClaimed);
    };
  }, []);

  // Measure track width accurately with ResizeObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateWidth = () => {
      const handleWidth = 56;
      const padding = 12; // 6px on each side
      const w = track.offsetWidth - handleWidth - padding;
      const calculatedMax = Math.max(w, 160);
      setMaxDrag(calculatedMax);
      maxDragRef.current = calculatedMax;
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // Update DOM visual elements directly on GPU compositor
  const setVisualPosition = useCallback((xPos) => {
    const limit = maxDragRef.current;
    const clamped = Math.min(Math.max(xPos, 0), limit);
    currentDragXRef.current = clamped;

    const pct = limit > 0 ? (clamped / limit) * 100 : 0;
    const scale = limit > 0 ? clamped / limit : 0;
    const tilt = (scale * 5).toFixed(1);
    const liftY = (-scale * 3).toFixed(1);

    if (handleRef.current) {
      handleRef.current.style.transform = `translate3d(${clamped.toFixed(1)}px, ${liftY}px, 0) rotate(${tilt}deg)`;
    }

    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${scale.toFixed(3)})`;
    }

    if (labelRef.current) {
      if (pct > 4) {
        labelRef.current.textContent = `LIFTING... ${Math.round(pct)} KG`;
        labelRef.current.style.color = '#FFA066';
      } else {
        labelRef.current.textContent = 'SLIDE BARBELL TO LIFT ›››';
        labelRef.current.style.color = '#C9CCCF';
      }
    }

    // Haptic feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      if (pct >= 25 && !hapticFlags.current[25]) {
        hapticFlags.current[25] = true;
        try { navigator.vibrate(10); } catch {}
      } else if (pct < 25) {
        hapticFlags.current[25] = false;
      }

      if (pct >= 50 && !hapticFlags.current[50]) {
        hapticFlags.current[50] = true;
        try { navigator.vibrate(10); } catch {}
      } else if (pct < 50) {
        hapticFlags.current[50] = false;
      }

      if (pct >= 75 && !hapticFlags.current[75]) {
        hapticFlags.current[75] = true;
        try { navigator.vibrate(15); } catch {}
      } else if (pct < 75) {
        hapticFlags.current[75] = false;
      }
    }
  }, []);

  // Smooth Spring Return to 0 via requestAnimationFrame
  const animateReturnToZero = useCallback((fromX) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    let pos = fromX;
    let vel = 0;
    const stiffness = 180;
    const damping = 24;
    let lastT = performance.now();

    const step = (now) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      const springForce = -stiffness * pos;
      const dampingForce = -damping * vel;
      const acceleration = springForce + dampingForce;

      vel += acceleration * dt;
      pos += vel * dt;

      setVisualPosition(pos);

      if (Math.abs(pos) > 0.5 || Math.abs(vel) > 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setVisualPosition(0);
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [setVisualPosition]);

  // Pointer drag handlers (Touch + Mouse + Stylus with Pointer Capture)
  const handlePointerDown = (e) => {
    if (claimedData?.claimed) return;
    e.preventDefault();
    e.stopPropagation();

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    isDraggingRef.current = true;
    startPointerXRef.current = e.clientX - currentDragXRef.current;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const newX = e.clientX - startPointerXRef.current;
    setVisualPosition(newX);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const limit = maxDragRef.current;
    const ratio = limit > 0 ? currentDragXRef.current / limit : 0;

    if (ratio >= 0.8) {
      // Successful lift! Snap to end
      setVisualPosition(limit);

      // Visual flash & screen shake
      setIsFlashing(true);
      setIsShaking(true);
      setTimeout(() => setIsFlashing(false), 140);
      setTimeout(() => setIsShaking(false), 200);

      // Haptic vibration feedback
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([20, 40, 20]); } catch {}
      }

      // Spark explosion
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.85 },
          colors: ['#E8590C', '#FF8A3D', '#FFA066', '#FFFFFF'],
        });
      } catch {}

      trackEvent('slide_to_lift_complete');

      // Reset slider handle back to start and open modal
      setTimeout(() => {
        animateReturnToZero(limit);
        onOpenTrial();
      }, 320);
    } else {
      // Spring back to start
      animateReturnToZero(currentDragXRef.current);
    }
  };

  // Idle Nudge: after 4s of inactivity, gently nudges handle and springs back
  useEffect(() => {
    if (claimedData?.claimed) return;

    let idleTimer;
    const scheduleNudge = () => {
      idleTimer = setTimeout(() => {
        if (!isDraggingRef.current && currentDragXRef.current === 0) {
          // Nudge forward 16px
          let startTime = performance.now();
          const nudgeDuration = 300;

          const animateNudge = (now) => {
            const elapsed = now - startTime;
            if (elapsed < nudgeDuration) {
              const p = Math.sin((elapsed / nudgeDuration) * Math.PI);
              setVisualPosition(p * 16);
              requestAnimationFrame(animateNudge);
            } else {
              setVisualPosition(0);
            }
          };
          requestAnimationFrame(animateNudge);
        }
        scheduleNudge();
      }, 4000);
    };

    scheduleNudge();
    return () => {
      clearTimeout(idleTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [claimedData, setVisualPosition]);

  const firstName = claimedData?.name ? claimedData.name.trim().split(' ')[0] : 'Champion';

  return (
    <section
      id="contact"
      ref={(el) => {
        containerRef.current = el;
        sectionRef.current = el;
      }}
      className={`relative w-full py-24 sm:py-32 overflow-hidden bg-[#0A0A0A] flex items-center justify-center text-center select-none transition-transform duration-75 content-visibility-auto ${
        isShaking ? 'translate-x-1 -translate-y-0.5' : ''
      }`}
    >
      {/* White-Hot Lift Screen Flash */}
      {isFlashing && (
        <div className="absolute inset-0 z-50 bg-white/40 pointer-events-none transition-opacity duration-150" />
      )}

      {/* Parallax Background */}
      <m.div style={{ y: bgY }} className="absolute -inset-10 z-1 pointer-events-none">
        <img
          src="/images/cta-bg.webp"
          alt="Athlete gripping iron bar"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center filter brightness-[0.24] contrast-125"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]" />
      </m.div>

      {/* Sparks Canvas */}
      <ParticleCanvas mobileCount={30} desktopCount={45} className="z-2" />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616]/95 border border-[#2B2F33] text-xs font-mono text-[#E8590C] tracking-widest uppercase font-bold mb-6 lg:backdrop-blur-md">
          <span>{CONFIG.finalCta.subtitle}</span>
        </div>

        {/* Massive Headline */}
        <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F2F2F0] uppercase tracking-tight leading-[0.95] mb-6">
          {CONFIG.finalCta.title.replace(CONFIG.finalCta.titleHighlight, '')}{' '}
          <span className="text-[#E8590C]">
            {CONFIG.finalCta.titleHighlight}
          </span>
        </h2>

        <p className="text-[#C9CCCF] text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          {CONFIG.finalCta.description}
        </p>

        {/* ------------------------------------------------------------- */}
        {/* IF ALREADY CLAIMED: Show Persistent Verified State             */}
        {/* ------------------------------------------------------------- */}
        {claimedData?.claimed ? (
          <m.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: DURATIONS.entrance, ease: EASINGS.easeOut }}
            className="w-full max-w-md p-7 rounded-xl bg-[#141618] border border-[#E8590C] shadow-[0_0_35px_rgba(232,89,12,0.35)] flex flex-col items-center text-center space-y-3.5"
          >
            {/* Animated Check Drawing inside Pulsing Ring */}
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#E8590C]/25 animate-ping" />
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" className="stroke-[#E8590C]/30 fill-transparent stroke-2" />
                <m.circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-[#E8590C] fill-transparent stroke-[3]"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: EASINGS.easeOut }}
                />
              </svg>
              <svg
                className="absolute w-8 h-8 text-[#E8590C]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <m.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.3, ease: EASINGS.easeOut }}
                />
              </svg>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide">
              FREE PASS CLAIMED ✓
            </h3>

            <p className="text-sm text-[#C9CCCF]">
              You're in, <strong className="text-white">{firstName}</strong>. We'll WhatsApp you shortly.
            </p>

            <a
              href={getWhatsAppLink(`Hi IRONFORGE! I previously claimed a pass for ${claimedData.name}. Checking in regarding my visit.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#E8590C] hover:text-[#FFA066] uppercase underline underline-offset-4 pt-1 cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>Message us on WhatsApp</span>
            </a>
          </m.div>
        ) : (
          /* ----------------------------------------------------------- */
          /* ROBUST 60FPS BARBELL SLIDER (Pointer Events + GPU Compositor)*/
          /* ----------------------------------------------------------- */
          <div className="w-full max-w-md mx-auto mb-5">
            <div
              ref={trackRef}
              className="relative h-16 rounded-full bg-[#16181B] border border-[#2B2F33] p-1.5 flex items-center shadow-2xl overflow-hidden cursor-pointer"
              style={{ touchAction: 'pan-y' }}
              onClick={(e) => {
                // If user clicks on track, update position
                if (!trackRef.current) return;
                const rect = trackRef.current.getBoundingClientRect();
                const clickX = e.clientX - rect.left - 28;
                if (clickX > maxDragRef.current * 0.7) {
                  setVisualPosition(maxDragRef.current);
                  handlePointerUp({ currentTarget: handleRef.current, pointerId: 1 });
                }
              }}
            >
              {/* Progress Fill Bar */}
              <div
                ref={progressFillRef}
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#E8590C]/30 via-[#E8590C]/60 to-[#E8590C]"
                style={{
                  width: '100%',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                }}
              />

              {/* Shimmering Center Live Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span
                  ref={labelRef}
                  className="text-xs sm:text-sm font-mono tracking-widest uppercase font-bold transition-colors animate-pulse text-[#C9CCCF]"
                >
                  SLIDE BARBELL TO LIFT ›››
                </span>
              </div>

              {/* Draggable 56px Barbell Icon Handle */}
              <div
                ref={handleRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  transform: 'translate3d(0px, 0px, 0px)',
                  touchAction: 'none',
                }}
                className="relative z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_22px_rgba(232,89,12,0.7)] cursor-grab active:cursor-grabbing bg-gradient-to-br from-[#E8590C] via-[#FF6B1A] to-[#C2410C] text-white border-2 border-[#16181B] select-none"
                aria-label="Slide barbell across to claim free pass"
              >
                {/* Detailed Barbell Graphic */}
                <div className="flex items-center gap-0.5 pointer-events-none select-none">
                  {/* Left Plate */}
                  <span className="w-1.5 h-7 bg-white/95 rounded-xs shadow-sm" />
                  <span className="w-0.5 h-5 bg-white/60 rounded-xs" />
                  {/* Center Knurled Bar */}
                  <span className="w-5 h-1.5 bg-white rounded-xs" />
                  {/* Right Plate */}
                  <span className="w-0.5 h-5 bg-white/60 rounded-xs" />
                  <span className="w-1.5 h-7 bg-white/95 rounded-xs shadow-sm" />
                </div>
              </div>
            </div>

            <span className="text-[11px] text-[#8E9398] font-mono tracking-wider mt-2.5 block uppercase">
              Drag barbell fully across to unlock 1-day free pass
            </span>
          </div>
        )}

        {/* Fallback Direct Link Button */}
        {!claimedData?.claimed && (
          <div className="pt-2">
            <button
              onClick={() => onOpenTrial()}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#E8590C] hover:text-[#FFA066] uppercase underline underline-offset-4 cursor-pointer"
            >
              <span>Or click here to claim trial pass instantly</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(FinalCTA);
