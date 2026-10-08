import React, { memo, useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { EASINGS, DURATIONS } from '../motion';

function StickyMobileJoin() {
  const [isHeroPassed, setIsHeroPassed] = useState(false);
  const [isPricingOrCtaVisible, setIsPricingOrCtaVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const passed = window.scrollY > 400;
          setIsHeroPassed((prev) => (prev !== passed ? passed : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        setIsPricingOrCtaVisible(isVisible);
      },
      { threshold: 0.1 }
    );

    const pricingEl = document.getElementById('pricing');
    const ctaEl = document.getElementById('contact');

    if (pricingEl) observer.observe(pricingEl);
    if (ctaEl) observer.observe(ctaEl);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const shouldShow = isHeroPassed && !isPricingOrCtaVisible;

  const scrollToPricing = () => {
    trackEvent('sticky_join_click');
    const pricingEl = document.getElementById('pricing');
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <m.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: DURATIONS.routeTransition, ease: EASINGS.easeOut }}
          className="fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#0A0A0A] border-t border-[#2B2F33] flex items-center px-4 safe-bottom lg:hidden pointer-events-auto shadow-2xl"
        >
          <button
            onClick={scrollToPricing}
            className="w-full h-10 rounded-sm bg-[#E8590C] hover:bg-[#FF6B1A] text-white font-heading text-base tracking-wider uppercase flex items-center justify-center gap-2 animate-heartbeat active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span>JOIN NOW</span>
            <ArrowRight size={18} className="animate-arrow-nudge" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}

export default memo(StickyMobileJoin);
