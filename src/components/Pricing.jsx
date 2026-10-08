import React, { memo, useState, useRef } from 'react';
import { m, AnimatePresence, useInView } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Zap, Crown, ArrowRight } from 'lucide-react';
import { CONFIG, getWhatsAppLink } from '../config';
import { trackEvent } from '../utils/analytics';
import { EASINGS, DURATIONS, SPRINGS, VIEWPORT_ONCE, getStaggerDelay } from '../motion';
import { useSectionVisibility } from '../hooks/useSectionVisibility';

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [expandedMobilePlan, setExpandedMobilePlan] = useState(null);

  const [sectionRef] = useSectionVisibility();
  const isInView = useInView(sectionRef, VIEWPORT_ONCE);

  const activeToggle = CONFIG.pricingSection.billingToggles.find((t) => t.id === billingCycle) || CONFIG.pricingSection.billingToggles[0];

  const toggleMobileAccordion = (planId) => {
    setExpandedMobilePlan((prev) => (prev === planId ? null : planId));
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 bg-[#0A0A0A] overflow-hidden content-visibility-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-xs font-mono tracking-widest text-[#E8590C] uppercase font-bold">
              {CONFIG.pricingSection.overline}
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-[#F2F2F0] uppercase tracking-tight mb-3">
            {CONFIG.pricingSection.title}{' '}
            <span className="text-[#E8590C]">{CONFIG.pricingSection.titleHighlight}</span>
          </h2>

          <p className="text-[#C9CCCF] text-xs sm:text-sm max-w-lg mx-auto">
            {CONFIG.pricingSection.subtitle}
          </p>

          {/* Spring Billing Toggle */}
          <div className="inline-flex p-1 rounded-full bg-[#16191C] border border-[#2B2F33] mt-7 shadow-lg">
            {CONFIG.pricingSection.billingToggles.map((tab) => {
              const isActive = billingCycle === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setBillingCycle(tab.id)}
                  className={`relative px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-mono tracking-wider uppercase transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive ? 'text-white font-bold' : 'text-[#8E9398] hover:text-[#C9CCCF]'
                  }`}
                >
                  {isActive && (
                    <m.div
                      layoutId="activePricingTabPill"
                      className="absolute inset-0 bg-[#E8590C] rounded-full shadow-md"
                      transition={SPRINGS.pill}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                  {tab.discount && (
                    <span
                      className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse ${
                        isActive
                          ? 'bg-black/30 text-white'
                          : 'bg-[#E8590C]/20 text-[#E8590C]'
                      }`}
                    >
                      {tab.discount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MOBILE VIEW: Compact Staggered Stack (150-170px tall collapsed) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:hidden flex flex-col gap-4">
          {CONFIG.pricingPlans.map((plan, idx) => {
            const isPopular = plan.popular;
            const isExpanded = expandedMobilePlan === plan.id;
            const price = plan.prices[billingCycle];

            return (
              <m.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: DURATIONS.entranceFast, delay: getStaggerDelay(idx, 0.05), ease: EASINGS.easeOut }}
                className={`rounded-xl transition-all duration-300 ${
                  isPopular
                    ? 'p-[1.5px] bg-gradient-to-r from-[#E8590C] via-[#FFA066] to-[#E8590C] shadow-[0_0_25px_rgba(232,89,12,0.25)]'
                    : 'bg-[#141618] border border-[#2B2F33]'
                }`}
              >
                <div className="bg-[#121416] p-4 sm:p-5 rounded-[10px] flex flex-col">
                  {/* Card Header: Plan Name, Badge & Rolling Price */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-xl sm:text-2xl text-[#F2F2F0] uppercase tracking-wide">
                        {plan.name}
                      </h3>
                      {isPopular && (
                        <span className="px-2 py-0.5 rounded bg-[#E8590C] text-white text-[9px] font-mono font-bold uppercase">
                          POPULAR
                        </span>
                      )}
                    </div>

                    {/* Price with Unit */}
                    <div className="flex items-baseline gap-1">
                      <AnimatePresence mode="wait">
                        <m.span
                          key={billingCycle}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: DURATIONS.routeTransition, ease: EASINGS.easeOut }}
                          className="font-heading text-2xl text-[#F2F2F0]"
                        >
                          {price}
                        </m.span>
                      </AnimatePresence>
                      <span className="text-[10px] font-mono text-[#8E9398]">
                        {activeToggle.unit}
                      </span>
                    </div>
                  </div>

                  {/* 3 Headline Benefits Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {plan.headlineChips.map((chip, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded bg-[#1C2025] text-[10px] font-mono text-[#C9CCCF] border border-[#2B2F33]"
                      >
                        ✓ {chip}
                      </span>
                    ))}
                  </div>

                  {/* Action Row: JOIN button + "See all benefits" toggle */}
                  <div className="flex items-center gap-3">
                    <a
                      href={getWhatsAppLink(`Hi! I would like to join the ${plan.name} (${activeToggle.label}) plan at IRONFORGE.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('plan_join_click', { plan: plan.name, cycle: billingCycle })}
                      className={`flex-1 h-11 rounded font-heading text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
                        isPopular
                          ? 'bg-[#E8590C] hover:bg-[#FF6B1A] text-white shadow-md'
                          : 'bg-[#1C2025] hover:bg-[#2B2F33] text-[#F2F2F0] border border-[#2B2F33]'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight size={14} />
                    </a>

                    <button
                      onClick={() => toggleMobileAccordion(plan.id)}
                      className="px-3 h-11 rounded bg-[#16181B] border border-[#2B2F33] text-[#8E9398] hover:text-[#F2F2F0] text-xs font-mono flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Less' : 'Benefits'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Accordion Expanded Benefits */}
                  <AnimatePresence>
                    {isExpanded && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: EASINGS.easeOut }}
                        className="overflow-hidden pt-4 mt-3 border-t border-[#2B2F33]/50 space-y-2"
                      >
                        {plan.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-[#C9CCCF]">
                            <Check size={13} className="text-[#E8590C] shrink-0 mt-0.5" strokeWidth={3} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </m.div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DESKTOP VIEW: 3-Column Side-by-Side Grid with Full Rich Lists  */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-stretch">
          {CONFIG.pricingPlans.map((plan, idx) => {
            const isPopular = plan.popular;
            const price = plan.prices[billingCycle];

            return (
              <m.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                transition={{ duration: DURATIONS.entrance, delay: getStaggerDelay(idx, 0.08), ease: EASINGS.easeOut }}
                className={`relative rounded-xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'p-[2px] border-beam-orange shadow-[0_0_40px_rgba(232,89,12,0.25)] -translate-y-3'
                    : 'bg-[#141618] border border-[#2B2F33] hover:border-[#E8590C]/50 shadow-lg'
                }`}
              >
                <div className="bg-[#121416] p-8 rounded-[10px] flex flex-col justify-between h-full">
                  <div>
                    {/* Badge */}
                    {isPopular && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C] text-white text-[11px] font-mono tracking-widest font-bold uppercase mb-4 shadow-sm">
                        <Zap size={13} fill="currentColor" />
                        <span>{plan.badge}</span>
                      </div>
                    )}

                    {!isPopular && plan.badge && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C2025] text-[#C9CCCF] text-[11px] font-mono tracking-widest font-bold uppercase mb-4 border border-[#2B2F33]">
                        <Crown size={13} className="text-[#E8590C]" />
                        <span>{plan.badge}</span>
                      </div>
                    )}

                    <h3 className="font-heading text-3xl text-[#F2F2F0] uppercase tracking-wide">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#8E9398] mt-1 mb-6">
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[#2B2F33]">
                      <AnimatePresence mode="wait">
                        <m.span
                          key={billingCycle}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: DURATIONS.routeTransition, ease: EASINGS.easeOut }}
                          className="font-heading text-5xl text-[#F2F2F0] tracking-tight"
                        >
                          {price}
                        </m.span>
                      </AnimatePresence>
                      <span className="text-xs text-[#8E9398] font-mono">
                        {activeToggle.unit}
                      </span>
                    </div>

                    {/* Full Features List */}
                    <div className="space-y-3 mb-8">
                      <span className="text-xs font-mono text-[#E8590C] uppercase tracking-wider block font-bold">
                        Included Privileges:
                      </span>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3 text-sm text-[#C9CCCF]">
                          <div className="w-5 h-5 rounded-full bg-[#E8590C]/15 text-[#E8590C] flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={13} strokeWidth={3} />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plan CTA Button */}
                  <a
                    href={getWhatsAppLink(`Hi! I would like to join the ${plan.name} (${activeToggle.label}) membership at IRONFORGE.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('plan_join_click', { plan: plan.name, cycle: billingCycle })}
                    className={`w-full h-13 rounded-sm font-heading text-base tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      isPopular
                        ? 'bg-[#E8590C] hover:bg-[#FF6B1A] text-white shadow-[0_4px_25px_rgba(232,89,12,0.45)]'
                        : 'bg-[#1C2024] hover:bg-[#252A2F] text-[#F2F2F0] border border-[#2B2F33] hover:border-[#E8590C]/50'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(Pricing);
