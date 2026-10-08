import React, { memo, useState, useEffect } from 'react';
import { m, AnimatePresence, useScroll } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare, MapPin } from 'lucide-react';
import { CONFIG, getWhatsAppLink } from '../config';
import { trackEvent } from '../utils/analytics';
import { EASINGS, DURATIONS } from '../motion';

function Navbar({ onOpenTrial }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll Progress MotionValue (Zero React state re-renders during scrolling!)
  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      const scrolled = latest > 40;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    });
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG.brand.localStorageKey);
      if (saved) setClaimed(true);
    } catch {}
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e, href) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate(href);
      } else {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setMobileMenuOpen(false);
    }
  };

  const handleJoinClick = (e) => {
    trackEvent('nav_join_click');
    if (location.pathname !== '/') {
      navigate('/#pricing');
    } else {
      e.preventDefault();
      const pricingEl = document.getElementById('pricing');
      if (pricingEl) {
        pricingEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleMobileTrialClick = () => {
    trackEvent('mobile_nav_trial_click');
    setMobileMenuOpen(false);
    if (claimed) {
      window.open(
        getWhatsAppLink('Hi IRONFORGE! I previously claimed a trial pass and would like to schedule my visit.'),
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      onOpenTrial();
    }
  };

  return (
    <>
      {/* Scroll Progress Bar at very top (Driven by Framer Motion scaleX on GPU compositor) */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-transparent pointer-events-none">
        <m.div
          className="h-full bg-gradient-to-r from-[#E8590C] via-[#FF6B1A] to-[#FFA066] shadow-[0_0_10px_#E8590C]"
          style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
        />
      </div>

      {/* Main Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0A]/95 lg:bg-[#0A0A0A]/85 lg:backdrop-blur-md border-b border-[#2B2F33]/60 py-3.5 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo with Barbell Icon */}
          <Link
            to="/#hero"
            onClick={(e) => handleNavClick(e, '/#hero')}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] rounded-sm"
          >
            <div className="w-8 h-8 rounded-md bg-[#161616] border border-[#2B2F33] flex items-center justify-center text-[#E8590C] group-hover:border-[#E8590C] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <rect x="2" y="6" width="3" height="12" rx="1" />
                <rect x="6" y="8" width="2" height="8" rx="0.5" />
                <rect x="8" y="11" width="8" height="2" />
                <rect x="16" y="8" width="2" height="8" rx="0.5" />
                <rect x="19" y="6" width="3" height="12" rx="1" />
              </svg>
            </div>
            <span className="font-heading text-2xl tracking-wider text-[#F2F2F0] uppercase">
              IRON<span className="text-[#E8590C]">FORGE</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            {CONFIG.navigation.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[#C9CCCF] hover:text-[#E8590C] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E8590C] hover:after:w-full after:transition-all uppercase font-medium text-xs tracking-widest"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#pricing"
              onClick={handleJoinClick}
              className="bg-[#E8590C] hover:bg-[#FF6B1A] text-white font-heading px-6 py-2.5 rounded-sm tracking-wider uppercase text-sm flex items-center gap-2 btn-primary-sweep active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>JOIN NOW</span>
              <span className="text-base font-sans inline-block animate-arrow-nudge">→</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-md bg-[#161616]/90 border border-[#2B2F33] text-[#F2F2F0] hover:text-[#E8590C] focus:outline-none focus:ring-2 focus:ring-[#E8590C] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu (Solid Dark Background, No blur on mobile) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: DURATIONS.routeTransition, ease: EASINGS.easeOut }}
            className="fixed inset-0 z-35 bg-[#0A0A0A] flex flex-col justify-between p-6 pt-24 pb-8 overflow-y-auto lg:hidden"
          >
            {/* Menu Links */}
            <div className="flex flex-col gap-5 my-auto">
              <span className="text-xs uppercase tracking-widest font-mono text-[#E8590C]">
                // NAVIGATION
              </span>
              {CONFIG.navigation.map((link, idx) => (
                <m.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: DURATIONS.entranceFast, ease: EASINGS.easeOut }}
                  className="font-heading text-3xl sm:text-4xl text-[#F2F2F0] hover:text-[#E8590C] uppercase tracking-wider flex items-center justify-between py-1 border-b border-[#2B2F33]/40"
                >
                  <span>{link.label}</span>
                  <span className="text-sm font-mono text-[#E8590C]/60">0{idx + 1}</span>
                </m.a>
              ))}
            </div>

            {/* Bottom Contact Quick Info & Mobile CTA */}
            <div className="mt-8 pt-6 border-t border-[#2B2F33] flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-[#C9CCCF]">
                <MapPin size={16} className="text-[#E8590C] shrink-0" />
                <span className="truncate">{CONFIG.contact.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#C9CCCF]">
                <Phone size={16} className="text-[#E8590C] shrink-0" />
                <span>{CONFIG.contact.displayPhone}</span>
              </div>

              <button
                onClick={handleMobileTrialClick}
                className="w-full h-12 bg-[#E8590C] hover:bg-[#FF6B1A] text-white font-heading text-base rounded-sm tracking-wider uppercase flex items-center justify-center gap-2 btn-primary-sweep active:scale-[0.98] transition-transform cursor-pointer"
              >
                <MessageSquare size={18} />
                <span>{claimed ? 'TRIAL REQUESTED ✓' : 'CLAIM FREE 1-DAY PASS'}</span>
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(Navbar);
