import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { m, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Dumbbell, Flame, ArrowRight, Activity, Sparkles } from 'lucide-react';
import { CONFIG } from '../config';
import { trackEvent } from '../utils/analytics';
import { EASINGS, DURATIONS, VIEWPORT_ONCE, getStaggerDelay } from '../motion';
import { useSectionVisibility } from '../hooks/useSectionVisibility';

const iconMap = {
  Dumbbell: Dumbbell,
  BicepsFlexed: Activity,
  Flame: Flame,
};

function Programs() {
  const [sectionRef] = useSectionVisibility();
  const isInView = useInView(sectionRef, VIEWPORT_ONCE);

  const [selectedSnap, setSelectedSnap] = useState(0);

  // Embla Carousel with AutoScroll Plugin (smooth continuous drift)
  const autoScrollPlugin = useRef(
    AutoScroll({
      speed: 0.7,
      direction: 'backward',
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: 'center',
      containScroll: false,
    },
    [autoScrollPlugin.current]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedSnap(emblaApi.selectedScrollSnap());
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

  // Pause when section is offscreen to save battery/CPU
  useEffect(() => {
    const autoScroll = autoScrollPlugin.current;
    if (!autoScroll) return;

    if (isInView) {
      autoScroll.play();
    } else {
      autoScroll.stop();
    }
  }, [isInView]);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 bg-[#0A0A0A] overflow-hidden content-visibility-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            {/* Overline with Orange Line Accent */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#E8590C] uppercase font-bold">
                {CONFIG.programsSection.overline}
              </span>
              <m.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: DURATIONS.entrance, ease: EASINGS.easeOut }}
                className="h-[2px] w-12 bg-[#E8590C] origin-left"
              />
            </div>

            {/* Main Section Title Mask Reveal */}
            <div className="overflow-hidden">
              <m.h2
                initial={{ y: 35, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 35, opacity: 0 }}
                transition={{ duration: DURATIONS.entranceSlow, ease: EASINGS.easeOut }}
                className="font-heading text-3xl sm:text-5xl lg:text-6xl text-[#F2F2F0] uppercase tracking-tight"
              >
                {CONFIG.programsSection.title}{' '}
                <span className="text-[#E8590C]">{CONFIG.programsSection.titleHighlight}</span>
              </m.h2>
            </div>
          </div>

          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: DURATIONS.entrance, delay: 0.15, ease: EASINGS.easeOut }}
            className="text-[#C9CCCF] text-sm sm:text-base max-w-md lg:text-right"
          >
            {CONFIG.programsSection.description}
          </m.p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MOBILE VIEW: Embla AutoScroll Continuous Drift Carousel       */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:hidden -mx-4 px-4 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5 py-4" style={{ touchAction: 'pan-y' }}>
            {CONFIG.programs.map((program, idx) => {
              const IconComponent = iconMap[program.icon] || Dumbbell;
              const isSelected = selectedSnap === idx;

              return (
                <div
                  key={`mobile-${program.id}`}
                  className={`shrink-0 w-[84vw] sm:w-[350px] transition-all duration-300 ${
                    isSelected ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-90'
                  }`}
                >
                  <div className="card-border-glow flex flex-col justify-between rounded-lg shadow-xl overflow-hidden h-full bg-[#141618]">
                    {/* Photo with Ken Burns Zoom */}
                    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#1A1D20]">
                      <img
                        src={program.image}
                        alt={program.title}
                        width={350}
                        height={240}
                        className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141618] via-[#141618]/30 to-transparent" />
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-[#0A0A0A]/95 lg:backdrop-blur-md border border-[#2B2F33] text-[10px] font-mono tracking-widest text-[#E8590C] uppercase font-bold">
                        {program.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-md bg-[#1C1F22] border border-[#2B2F33] text-[#E8590C] flex items-center justify-center">
                            <IconComponent size={20} />
                          </div>
                          <h3 className="font-heading text-xl sm:text-2xl text-[#F2F2F0] uppercase tracking-wide">
                            {program.title}
                          </h3>
                        </div>

                        <p className="text-[#C9CCCF] text-xs leading-relaxed mb-5">
                          {program.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {program.chips.map((chip, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2 py-0.5 rounded bg-[#1C2025] text-[10px] font-mono text-[#8E9398] border border-[#2B2F33]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        to={`/programs/${program.slug}`}
                        onClick={() => trackEvent('program_explore_click', { program: program.slug })}
                        className="inline-flex items-center justify-between text-xs font-mono font-bold tracking-widest text-[#E8590C] hover:text-[#FFA066] uppercase pt-4 border-t border-[#2B2F33]/50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles size={13} />
                          <span>EXPLORE PROGRAM</span>
                        </span>
                        <ArrowRight size={16} className="animate-arrow-nudge" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DESKTOP VIEW: 3-Column Grid                                   */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 items-stretch">
          {CONFIG.programs.map((program, idx) => {
            const IconComponent = iconMap[program.icon] || Dumbbell;

            return (
              <m.div
                key={program.id}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                transition={{ duration: DURATIONS.entrance, delay: getStaggerDelay(idx, 0.08), ease: EASINGS.easeOut }}
                className="group card-border-glow flex flex-col justify-between rounded-lg shadow-xl overflow-hidden bg-[#141618] hover:shadow-[0_10px_35px_rgba(232,89,12,0.2)]"
              >
                {/* Photo Container with Ken Burns Slow Zoom */}
                <div className="relative h-64 w-full overflow-hidden bg-[#1A1D20]">
                  <img
                    src={program.image}
                    alt={program.title}
                    width={400}
                    height={256}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141618] via-[#141618]/30 to-transparent" />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-[#0A0A0A]/95 lg:backdrop-blur-md border border-[#2B2F33] text-[10px] font-mono tracking-widest text-[#E8590C] uppercase font-bold">
                    {program.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-md bg-[#1C1F22] border border-[#2B2F33] text-[#E8590C] flex items-center justify-center group-hover:bg-[#E8590C] group-hover:text-white transition-colors">
                        <IconComponent size={20} />
                      </div>
                      <h3 className="font-heading text-2xl text-[#F2F2F0] uppercase tracking-wide group-hover:text-[#E8590C] transition-colors">
                        {program.title}
                      </h3>
                    </div>

                    <p className="text-[#C9CCCF] text-sm leading-relaxed mb-6">
                      {program.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {program.chips.map((chip, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded bg-[#1C2025] text-[11px] font-mono text-[#8E9398] border border-[#2B2F33]"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/programs/${program.slug}`}
                    onClick={() => trackEvent('program_explore_click', { program: program.slug })}
                    className="inline-flex items-center justify-between text-xs font-mono font-bold tracking-widest text-[#E8590C] hover:text-[#FFA066] uppercase pt-4 border-t border-[#2B2F33]/50 transition-colors group-hover:translate-x-0.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} />
                      <span>EXPLORE PROGRAM</span>
                    </span>
                    <ArrowRight size={16} className="animate-arrow-nudge" />
                  </Link>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(Programs);
