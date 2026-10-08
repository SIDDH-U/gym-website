import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { m, useInView } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Sparkles, Dumbbell } from 'lucide-react';
import { CONFIG } from '../config';
import CarouselNav from './CarouselNav';
import { EASINGS, DURATIONS, VIEWPORT_ONCE } from '../motion';
import { useSectionVisibility } from '../hooks/useSectionVisibility';

function BeforeAfterCard({ item, onDraggingChange }) {
  const [imgErrorBefore, setImgErrorBefore] = useState(false);
  const [imgErrorAfter, setImgErrorAfter] = useState(false);
  const [containerWidth, setContainerWidth] = useState(360);

  const containerRef = useRef(null);
  const handleRef = useRef(null);
  const beforeWrapperRef = useRef(null);
  const isTouchedRef = useRef(false);

  const isInView = useInView(containerRef, VIEWPORT_ONCE);

  // Measure container width for clean image scaling without layout shift
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Zero-rerender DOM Position updater
  const setPositionDOM = useCallback((percentage) => {
    const clamped = Math.min(Math.max(percentage, 5), 95);
    if (handleRef.current) {
      handleRef.current.style.left = `${clamped}%`;
    }
    if (beforeWrapperRef.current) {
      beforeWrapperRef.current.style.width = `${clamped}%`;
    }
  }, []);

  // On-View Demo Sweep Animation (Direct DOM update, Zero React state re-renders)
  useEffect(() => {
    if (!isInView || isTouchedRef.current) return;

    let frameId;
    let startTime = null;

    const animateSweep = (timestamp) => {
      if (isTouchedRef.current) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < 600) {
        const p = elapsed / 600;
        const pos = 50 - 25 * Math.sin(p * Math.PI * 0.5);
        setPositionDOM(pos);
      } else if (elapsed < 1400) {
        const p = (elapsed - 600) / 800;
        const pos = 25 + 50 * (0.5 - 0.5 * Math.cos(p * Math.PI));
        setPositionDOM(pos);
      } else if (elapsed < 2000) {
        const p = (elapsed - 1400) / 600;
        const pos = 75 - 25 * Math.sin(p * Math.PI * 0.5);
        setPositionDOM(pos);
      } else {
        setPositionDOM(50);
        return;
      }

      frameId = requestAnimationFrame(animateSweep);
    };

    const timer = setTimeout(() => {
      frameId = requestAnimationFrame(animateSweep);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isInView, setPositionDOM]);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setPositionDOM(percentage);
  }, [setPositionDOM]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    isTouchedRef.current = true;
    onDraggingChange?.(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    onDraggingChange?.(false);
  };

  const handleContainerClick = (e) => {
    isTouchedRef.current = true;
    updatePosition(e.clientX);
  };

  return (
    <div
      className="flex flex-col rounded-lg bg-[#141618] border border-[#2B2F33] overflow-hidden shadow-xl transition-all duration-300 hover:border-[#E8590C]/50 h-full"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Interactive Visual Area (data-compare marks area to exempt from Embla swipe) */}
      <div
        ref={containerRef}
        data-compare="true"
        onClick={handleContainerClick}
        className="relative w-full h-72 sm:h-80 select-none overflow-hidden bg-[#1A1D20] cursor-ew-resize"
      >
        {/* AFTER IMAGE / PLACEHOLDER */}
        {imgErrorAfter ? (
          <div className="absolute inset-0 bg-[#16181B] flex flex-col items-center justify-center text-[#8E9398] p-4">
            <Dumbbell size={32} className="text-[#E8590C] mb-2" />
            <span className="text-xs font-mono uppercase tracking-wider">Photo coming soon</span>
          </div>
        ) : (
          <img
            src={item.afterImage}
            alt={`${item.name} After Transformation`}
            width={380}
            height={320}
            onError={() => setImgErrorAfter(true)}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            loading="lazy"
            decoding="async"
          />
        )}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#0A0A0A]/95 lg:backdrop-blur-md border border-[#2B2F33] text-[11px] font-mono tracking-wider text-[#E8590C] uppercase font-bold z-10 pointer-events-none">
          AFTER
        </span>

        {/* BEFORE IMAGE / PLACEHOLDER */}
        <div
          ref={beforeWrapperRef}
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: '50%' }}
        >
          {imgErrorBefore ? (
            <div
              className="absolute inset-0 bg-[#1A1C1F] flex flex-col items-center justify-center text-[#8E9398] p-4"
              style={{ width: `${containerWidth}px`, maxWidth: 'none' }}
            >
              <Dumbbell size={32} className="text-[#8E9398] mb-2" />
              <span className="text-xs font-mono uppercase tracking-wider">Photo coming soon</span>
            </div>
          ) : (
            <img
              src={item.beforeImage}
              alt={`${item.name} Before Transformation`}
              width={380}
              height={320}
              onError={() => setImgErrorBefore(true)}
              className="absolute inset-0 h-full object-cover object-center"
              style={{ width: `${containerWidth}px`, maxWidth: 'none' }}
              loading="lazy"
              decoding="async"
            />
          )}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0A0A0A]/95 lg:backdrop-blur-md border border-[#2B2F33] text-[11px] font-mono tracking-wider text-[#C9CCCF] uppercase font-bold z-10">
            BEFORE
          </span>
        </div>

        {/* 48px Touch-Friendly Divider Handle */}
        <div
          ref={handleRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            left: '50%',
            touchAction: 'none',
          }}
          className="absolute top-0 bottom-0 w-12 -ml-6 z-30 flex items-center justify-center cursor-ew-resize group"
          aria-label="Drag to compare before and after photos"
        >
          <div className="w-[3px] h-full bg-[#E8590C] shadow-[0_0_10px_#E8590C] pointer-events-none" />

          {/* Center Handle with White SVG Chevrons */}
          <div className="absolute w-9 h-9 rounded-full bg-[#E8590C] border-2 border-white shadow-2xl flex items-center justify-center group-active:scale-110 transition-transform pointer-events-none">
            <div className="flex items-center -space-x-1 text-white">
              <ChevronLeft size={16} strokeWidth={3} />
              <ChevronRight size={16} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Quote & Member Info */}
      <div className="p-6 flex flex-col justify-between flex-grow" style={{ touchAction: 'pan-y' }}>
        <blockquote className="text-[#C9CCCF] text-xs sm:text-sm italic leading-relaxed mb-6">
          &ldquo;{item.quote}&rdquo;
        </blockquote>

        <div className="pt-4 border-t border-[#2B2F33]/60 flex items-center justify-between">
          <div>
            <h4 className="font-heading text-lg text-[#F2F2F0] uppercase tracking-wide">
              {item.name}
            </h4>
            <p className="text-xs text-[#E8590C] font-mono tracking-wider">
              {item.duration}
            </p>
          </div>

          {item.stats && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1C2024] border border-[#2B2F33] text-[11px] font-mono text-[#F2F2F0]">
              <Sparkles size={12} className="text-[#E8590C]" />
              <span>{Object.values(item.stats)[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MemoizedBeforeAfterCard = memo(BeforeAfterCard);

function Transformations() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const [sectionRef] = useSectionVisibility();
  const isInView = useInView(sectionRef, VIEWPORT_ONCE);

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      watchDrag: (emblaApi, event) => {
        return !event.target.closest('[data-compare="true"]');
      },
    },
    [autoplayPlugin.current]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Pause autoplay when offscreen
  useEffect(() => {
    const autoplay = autoplayPlugin.current;
    if (!autoplay) return;

    if (isInView && !isUserInteracting) {
      autoplay.play();
    } else {
      autoplay.stop();
    }
  }, [isInView, isUserInteracting]);

  const handleDraggingChange = useCallback((dragging) => {
    setIsUserInteracting(dragging);
    const autoplay = autoplayPlugin.current;
    if (dragging) autoplay?.stop();
    else autoplay?.play();
  }, []);

  return (
    <section
      id="transformations"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 bg-[#0A0A0A] overflow-hidden content-visibility-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#E8590C] uppercase font-bold">
                {CONFIG.transformationsSection.overline}
              </span>
              <m.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: DURATIONS.entrance, ease: EASINGS.easeOut }}
                className="h-[2px] w-12 bg-[#E8590C] origin-left"
              />
            </div>

            <div className="overflow-hidden">
              <m.h2
                initial={{ y: 35, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 35, opacity: 0 }}
                transition={{ duration: DURATIONS.entranceSlow, ease: EASINGS.easeOut }}
                className="font-heading text-3xl sm:text-5xl lg:text-6xl text-[#F2F2F0] uppercase tracking-tight"
              >
                {CONFIG.transformationsSection.title}{' '}
                <span className="text-[#E8590C]">{CONFIG.transformationsSection.titleHighlight}</span>
              </m.h2>
            </div>
          </div>

          <p className="text-[#C9CCCF] text-sm max-w-sm">
            {CONFIG.transformationsSection.subtitle}
          </p>
        </div>

        {/* Embla Carousel Container */}
        <div
          className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0"
          ref={emblaRef}
          onTouchStart={() => setIsUserInteracting(true)}
          onTouchEnd={() => setTimeout(() => setIsUserInteracting(false), 1500)}
          onMouseEnter={() => setIsUserInteracting(true)}
          onMouseLeave={() => setIsUserInteracting(false)}
        >
          <div className="flex gap-6 py-2" style={{ touchAction: 'pan-y' }}>
            {CONFIG.transformations.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-[85vw] sm:w-[350px] md:w-[360px] lg:w-[360px] xl:w-[380px]"
              >
                <MemoizedBeforeAfterCard
                  item={item}
                  onDraggingChange={handleDraggingChange}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Thumb-Reachable Carousel Navigation Bar */}
        <CarouselNav
          total={CONFIG.transformations.length}
          selectedIndex={selectedIndex}
          onPrev={scrollPrev}
          onNext={scrollNext}
          onSelect={scrollTo}
          autoPlayDuration={4500}
          isPaused={isUserInteracting}
        />
      </div>
    </section>
  );
}

export default memo(Transformations);
