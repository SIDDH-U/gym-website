import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { m, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ShieldCheck, ArrowRight, Dumbbell } from 'lucide-react';
import { CONFIG } from '../config';
import { trackEvent } from '../utils/analytics';
import CarouselNav from './CarouselNav';
import { EASINGS, DURATIONS, VIEWPORT_ONCE } from '../motion';
import { useSectionVisibility } from '../hooks/useSectionVisibility';

function Trainers() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  const [sectionRef] = useSectionVisibility();
  const isInView = useInView(sectionRef, VIEWPORT_ONCE);

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
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

  useEffect(() => {
    const autoplay = autoplayPlugin.current;
    if (!autoplay) return;

    if (isInView && !isUserInteracting) {
      autoplay.play();
    } else {
      autoplay.stop();
    }
  }, [isInView, isUserInteracting]);

  return (
    <section
      id="trainers"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 bg-[#101215] border-y border-[#2B2F33] overflow-hidden content-visibility-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono tracking-widest text-[#E8590C] uppercase font-bold">
                {CONFIG.trainersSection.overline}
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
                {CONFIG.trainersSection.title}{' '}
                <span className="text-[#E8590C]">{CONFIG.trainersSection.titleHighlight}</span>
              </m.h2>
            </div>
          </div>

          <p className="text-[#C9CCCF] text-sm max-w-sm">
            {CONFIG.trainersSection.description}
          </p>
        </div>

        {/* Center-Focused Coverflow Embla Carousel */}
        <div
          className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0"
          ref={emblaRef}
          onTouchStart={() => setIsUserInteracting(true)}
          onTouchEnd={() => setTimeout(() => setIsUserInteracting(false), 1500)}
          onMouseEnter={() => setIsUserInteracting(true)}
          onMouseLeave={() => setIsUserInteracting(false)}
        >
          <div className="flex gap-6 py-4 items-center" style={{ touchAction: 'pan-y' }}>
            {CONFIG.trainers.map((trainer, idx) => {
              const isActive = selectedIndex === idx;
              const hasImgError = imgErrors[trainer.id];

              return (
                <div
                  key={trainer.id}
                  className={`shrink-0 w-[84vw] sm:w-[380px] lg:w-[420px] transition-all duration-500 ${
                    isActive ? 'scale-100 opacity-100' : 'scale-[0.86] opacity-40'
                  }`}
                >
                  <div
                    className={`rounded-xl overflow-hidden shadow-2xl h-full flex flex-col justify-between ${
                      isActive ? 'card-border-glow' : 'bg-[#141618] border border-[#2B2F33]'
                    }`}
                  >
                    {/* Portrait Photo with Ken Burns Zoom */}
                    <div className="relative h-[300px] sm:h-[340px] w-full overflow-hidden bg-[#181B1E]">
                      {hasImgError ? (
                        <div className="w-full h-full bg-[#16181B] flex flex-col items-center justify-center text-[#8E9398] p-4">
                          <Dumbbell size={36} className="text-[#E8590C] mb-2" />
                          <span className="text-xs font-mono uppercase tracking-wider">Photo coming soon</span>
                        </div>
                      ) : (
                        <img
                          src={trainer.image}
                          alt={trainer.name}
                          width={420}
                          height={340}
                          onError={() => setImgErrors((prev) => ({ ...prev, [trainer.id]: true }))}
                          className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out ${
                            isActive ? 'scale-105' : 'scale-100'
                          }`}
                          loading="lazy"
                          decoding="async"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#141618] via-[#141618]/50 to-transparent" />

                      {/* Pop-in Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0A0A]/95 lg:backdrop-blur-md border border-[#2B2F33] text-[11px] font-mono text-[#E8590C]">
                        <ShieldCheck size={14} />
                        <span>{trainer.badge}</span>
                      </div>

                      <span className="absolute top-4 right-4 px-2.5 py-1 rounded bg-[#0A0A0A]/95 lg:backdrop-blur-md border border-[#2B2F33] text-[10px] font-mono text-[#C9CCCF] uppercase">
                        {trainer.experience}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 bg-[#141618] flex flex-col justify-between flex-grow">
                      <div>
                        <span className="text-xs font-mono font-bold tracking-widest text-[#E8590C] uppercase mb-1 block">
                          {trainer.role}
                        </span>

                        <h3 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide mb-2">
                          {trainer.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#C9CCCF] leading-relaxed mb-4 line-clamp-2">
                          {trainer.bio}
                        </p>

                        {trainer.stats && (
                          <div className="grid grid-cols-3 gap-2 p-2.5 rounded bg-[#1C2025] border border-[#2B2F33] mb-4 text-center">
                            {Object.entries(trainer.stats).map(([k, v], sIdx) => (
                              <div key={sIdx}>
                                <div className="font-heading text-sm text-[#E8590C]">{v}</div>
                                <div className="text-[9px] font-mono text-[#8E9398] uppercase tracking-wider">{k}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/trainers/${trainer.slug}`}
                        onClick={() => trackEvent('trainer_profile_click', { trainer: trainer.slug })}
                        className="w-full h-11 rounded bg-[#1C2025] hover:bg-[#E8590C] text-[#F2F2F0] hover:text-white font-mono text-xs tracking-wider uppercase flex items-center justify-between px-4 transition-colors border border-[#2B2F33] hover:border-[#E8590C] group cursor-pointer"
                      >
                        <span>VIEW FULL PROFILE</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation */}
        <CarouselNav
          total={CONFIG.trainers.length}
          selectedIndex={selectedIndex}
          onPrev={scrollPrev}
          onNext={scrollNext}
          onSelect={scrollTo}
          autoPlayDuration={3500}
          isPaused={isUserInteracting}
        />
      </div>
    </section>
  );
}

export default memo(Trainers);
