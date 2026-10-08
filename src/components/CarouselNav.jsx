import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Premium Thumb-Reachable Carousel Navigation Bar
 * - Bottom-left: Dots indicator (active dot with gradient bar)
 * - Bottom-right: 56px main NEXT button with double chevron, pulse ring & circular timer
 * - Off-thread CSS animated progress ring (Zero React state re-renders!)
 */
function CarouselNav({
  total,
  selectedIndex,
  onPrev,
  onNext,
  onSelect,
  autoPlayDuration = 4500,
  isPaused = false,
  className = '',
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`w-full flex items-center justify-between pt-6 ${className}`}>
      {/* Bottom-Left Dots Indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, idx) => {
          const isActive = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-7 bg-gradient-to-r from-[#E8590C] to-[#FFA066] shadow-[0_0_8px_#E8590C]'
                  : 'w-2 bg-[#2B2F33] hover:bg-[#3D4349]'
              }`}
            />
          );
        })}
      </div>

      {/* Bottom-Right Prev & Highlighted 56px Next Button */}
      <div className="flex items-center gap-3">
        {/* Smaller Outlined Prev Button */}
        <button
          onClick={onPrev}
          aria-label="Previous Slide"
          className="w-10 h-10 rounded-full bg-[#141618] border border-[#2B2F33] hover:border-[#E8590C] text-[#C9CCCF] hover:text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        {/* 56px Main Next Control with Double Chevron & CSS Progress Ring */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* Animated 2s Expanding Pulse Ring */}
          <div className="absolute -inset-1 rounded-full bg-[#E8590C]/30 animate-ping pointer-events-none opacity-40" />

          {/* Circular Progress Ring animated purely via CSS */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r={radius}
              className="stroke-[#2B2F33]/60 fill-transparent stroke-[2]"
            />
            <circle
              key={`${selectedIndex}-${isPaused}`}
              cx="28"
              cy="28"
              r={radius}
              className="stroke-[#FFA066] fill-transparent stroke-[2.5] stroke-linecap-round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: isPaused ? circumference : 0,
                transition: isPaused ? 'none' : `stroke-dashoffset ${autoPlayDuration}ms linear`,
              }}
            />
          </svg>

          {/* Center 56px Button */}
          <button
            onClick={onNext}
            aria-label="Next Slide"
            className="w-12 h-12 rounded-full bg-[#E8590C] hover:bg-[#FF6B1A] text-white flex items-center justify-center shadow-[0_0_20px_rgba(232,89,12,0.6)] active:scale-90 transition-transform cursor-pointer relative z-10 group"
          >
            {/* Double SVG Chevron nudging right in loop */}
            <div className="flex items-center -space-x-2 text-white animate-arrow-nudge">
              <ChevronRight size={18} strokeWidth={3} />
              <ChevronRight size={18} strokeWidth={3} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(CarouselNav);
