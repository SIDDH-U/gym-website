import React, { memo, useRef, useEffect, useState } from 'react';
import { m, useInView } from 'framer-motion';
import { Users, Award, Clock, Trophy } from 'lucide-react';
import { CONFIG } from '../config';
import ParticleCanvas from './ParticleCanvas';
import { EASINGS, DURATIONS, VIEWPORT_ONCE, getStaggerDelay } from '../motion';
import { useSectionVisibility } from '../hooks/useSectionVisibility';
import { getPerformanceTier } from '../utils/perfTier';

const statIcons = {
  Users: Users,
  Award: Award,
  Clock: Clock,
  Trophy: Trophy,
};

/**
 * Slot-machine / Odometer rolling digit column
 */
function OdometerDigit({ digit, delay = 0, start = false }) {
  const target = parseInt(digit, 10);
  const isNumeric = !isNaN(target);

  if (!isNumeric) {
    return <span>{digit}</span>;
  }

  return (
    <span className="inline-block h-[1em] overflow-hidden leading-none relative">
      <m.span
        initial={{ y: '0%' }}
        animate={start ? { y: `-${target * 10}%` } : { y: '0%' }}
        transition={{
          duration: 1.2,
          delay: delay,
          ease: EASINGS.easeOut,
        }}
        className="inline-flex flex-col text-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span key={num} className="h-[1em] block">
            {num}
          </span>
        ))}
      </m.span>
    </span>
  );
}

function RollingNumber({ value, suffix = '', start = false }) {
  const stringVal = value.toString();
  const digits = stringVal.split('');

  return (
    <div className="relative inline-flex items-baseline">
      <div className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-none text-[#E8590C]">
        {digits.map((ch, idx) => (
          <OdometerDigit
            key={idx}
            digit={ch}
            delay={idx * 0.06}
            start={start}
          />
        ))}
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
}

const MemoizedRollingNumber = memo(RollingNumber);

function InteractiveTiltCard({ stat, idx, isInView }) {
  const IconComponent = statIcons[stat.icon] || Trophy;
  const cardRef = useRef(null);

  // Zero-rerender Tilt on pointer move (disabled on low-tier or touch)
  const handlePointerMove = (e) => {
    if (getPerformanceTier() === 'low' || window.innerWidth < 1024) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = (-y * 6).toFixed(2);
    const rotY = (x * 6).toFixed(2);

    cardRef.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  };

  const handlePointerLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const flyFromLeft = idx % 2 === 0;

  return (
    <m.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, x: flyFromLeft ? -35 : 35, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: flyFromLeft ? -35 : 35, y: 20 }}
      transition={{ duration: DURATIONS.entrance, delay: getStaggerDelay(idx, 0.05), ease: EASINGS.easeOut }}
      style={{
        transition: 'transform 0.15s ease-out',
      }}
      className="card-border-glow p-4 sm:p-6 lg:p-8 rounded-xl flex flex-col items-start justify-between relative shadow-2xl bg-[#141618] overflow-hidden select-none h-full"
    >
      {/* Large Rotating Ghost Icon in Background */}
      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none text-white animate-[spin_40s_linear_infinite]">
        <IconComponent size={140} />
      </div>

      {/* Icon with SVG Self-Drawing Animated Ring */}
      <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center mb-3 sm:mb-6 z-10">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" className="stroke-[#2B2F33] fill-transparent stroke-[2.5]" />
          <m.circle
            cx="24"
            cy="24"
            r="20"
            className="stroke-[#E8590C] fill-transparent stroke-[2.5] stroke-linecap-round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.0, delay: 0.15 + idx * 0.1, ease: EASINGS.easeOut }}
          />
        </svg>

        <div className="text-[#E8590C] group-hover:scale-110 transition-transform">
          <IconComponent size={20} className="sm:hidden" />
          <IconComponent size={24} className="hidden sm:block" />
        </div>
      </div>

      {/* Odometer Rolling Number */}
      <div className="mb-1.5 sm:mb-2 z-10">
        <MemoizedRollingNumber
          value={stat.value}
          suffix={stat.suffix}
          start={isInView}
        />
      </div>

      {/* Animated Underline Fill Bar */}
      <div className="w-full h-1 bg-[#2B2F33] rounded-full overflow-hidden mb-2.5 sm:mb-3.5 z-10">
        <m.div
          className="h-full bg-gradient-to-r from-[#E8590C] to-[#FFA066]"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 + idx * 0.08, ease: EASINGS.easeOut }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      {/* Label */}
      <div className="font-heading text-sm sm:text-lg lg:text-xl text-[#F2F2F0] uppercase tracking-wider mb-1 z-10">
        {stat.label}
      </div>

      {/* Description */}
      <p className="text-[10px] sm:text-xs text-[#8E9398] leading-tight sm:leading-relaxed z-10">
        {stat.description}
      </p>
    </m.div>
  );
}

const MemoizedTiltCard = memo(InteractiveTiltCard);

function Stats() {
  const [sectionRef] = useSectionVisibility();
  const isInView = useInView(sectionRef, VIEWPORT_ONCE);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 lg:py-28 bg-[#121417] border-y border-[#2B2F33] overflow-hidden select-none content-visibility-auto"
    >
      {/* Background Embers */}
      <ParticleCanvas mobileCount={20} desktopCount={35} className="z-1 opacity-35" />

      {/* Faint Animated ECG Line Background (Hidden on low tier) */}
      <div className="ecg-line absolute inset-0 z-1 pointer-events-none opacity-20 flex items-center overflow-hidden">
        <svg className="w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,60 L250,60 L270,30 L290,95 L310,15 L330,85 L350,60 L600,60 L850,60 L870,30 L890,95 L910,15 L930,85 L950,60 L1200,60"
            fill="none"
            stroke="#E8590C"
            strokeWidth="2"
            strokeDasharray="200, 1000"
            className="animate-[ecgFlow_8s_linear_infinite]"
          />
        </svg>
      </div>

      {/* Continuous Diagonal Light Sweep (CSS keyframes using translate3d) */}
      <div className="absolute inset-0 z-2 pointer-events-none overflow-hidden">
        <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-[#E8590C]/5 to-transparent animate-section-sweep" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Barbell Line Drawing & Plates Slide In */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 flex flex-col items-center">
          
          {/* Barbell Assembly Animation in Header */}
          <div className="relative w-48 h-6 flex items-center justify-center mb-3">
            {/* Center Bar Drawing */}
            <m.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: DURATIONS.entranceSlow, ease: EASINGS.easeOut }}
              className="w-36 h-1 bg-[#8E9398] rounded-full shadow origin-center"
            />
            {/* Left Plates Slide In */}
            <m.div
              initial={{ x: -25, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -25, opacity: 0 }}
              transition={{ duration: DURATIONS.entranceFast, delay: 0.25, ease: EASINGS.easeOut }}
              className="absolute left-3 flex items-center gap-0.5"
            >
              <div className="w-1.5 h-5 bg-[#E8590C] rounded-xs" />
              <div className="w-1 h-4 bg-[#C9CCCF] rounded-xs" />
            </m.div>
            {/* Right Plates Slide In */}
            <m.div
              initial={{ x: 25, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 25, opacity: 0 }}
              transition={{ duration: DURATIONS.entranceFast, delay: 0.25, ease: EASINGS.easeOut }}
              className="absolute right-3 flex items-center gap-0.5"
            >
              <div className="w-1 h-4 bg-[#C9CCCF] rounded-xs" />
              <div className="w-1.5 h-5 bg-[#E8590C] rounded-xs" />
            </m.div>
          </div>

          <span className="text-xs font-mono tracking-widest text-[#E8590C] uppercase font-bold">
            {CONFIG.statsSection.overline}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-[#F2F2F0] uppercase tracking-tight mt-1">
            {CONFIG.statsSection.title}{' '}
            <span className="text-[#E8590C]">{CONFIG.statsSection.titleHighlight}</span>
          </h2>
        </div>

        {/* 4 Stat Cards in 2 Rows x 2 Columns on Phone, 4 Columns on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {CONFIG.stats.map((stat, idx) => (
            <MemoizedTiltCard
              key={stat.id}
              stat={stat}
              idx={idx}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Stats);
