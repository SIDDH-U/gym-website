import React, { memo, useState } from 'react';
import { m } from 'framer-motion';
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon, TwitterIcon, TikTokIcon } from './SocialIcons';
import { CONFIG } from '../config';
import ParticleCanvas from './ParticleCanvas';
import { trackEvent } from '../utils/analytics';
import { EASINGS } from '../motion';

function Footer() {
  const [isBarbellLifting, setIsBarbellLifting] = useState(false);

  const scrollToTop = () => {
    setIsBarbellLifting(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsBarbellLifting(false), 900);
  };

  const navLinks = [
    { label: 'Home', href: '/#hero' },
    { label: 'Programs', href: '/#programs' },
    { label: 'Trainers', href: '/#trainers' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <footer className="relative w-full bg-[#08090A] border-t border-[#2B2F33] pt-10 pb-28 lg:pb-12 text-[#C9CCCF] overflow-hidden select-none">
      {/* Faint Embers Rising from Bottom */}
      <ParticleCanvas mobileCount={15} desktopCount={25} className="z-1 opacity-35" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* ROW 1: Logo & Gently Floating Social Icons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#2B2F33]/50">
          {/* Brand Logo */}
          <a href="/#hero" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#161616] border border-[#2B2F33] flex items-center justify-center text-[#E8590C]">
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
          </a>

          {/* Social Icons Floating with CSS Keyframes off main thread */}
          <div className="flex items-center gap-2.5">
            {[
              { icon: InstagramIcon, href: CONFIG.socialLinks.instagram, label: 'Instagram' },
              { icon: YoutubeIcon, href: CONFIG.socialLinks.youtube, label: 'YouTube' },
              { icon: FacebookIcon, href: CONFIG.socialLinks.facebook, label: 'Facebook' },
              { icon: TikTokIcon, href: CONFIG.socialLinks.tiktok, label: 'TikTok' },
              { icon: TwitterIcon, href: CONFIG.socialLinks.twitter, label: 'Twitter' },
            ].map((social, sIdx) => {
              const Icon = social.icon;
              return (
                <a
                  key={sIdx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{ animationDelay: `${sIdx * 0.3}s` }}
                  className="w-9 h-9 rounded-md bg-[#141618] border border-[#2B2F33] text-[#C9CCCF] hover:text-[#E8590C] hover:border-[#E8590C] flex items-center justify-center transition-colors animate-subtle-float"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Centered Flex-Wrap Chip Grid */}
        <div className="w-full flex flex-wrap items-center justify-center py-6 gap-2">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="px-4 py-1.5 rounded-full bg-[#141618] border border-[#2B2F33] hover:border-[#E8590C] text-xs font-mono uppercase tracking-wider text-[#C9CCCF] hover:text-[#E8590C] transition-colors shrink-0"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ROW 3: Three Quick Action Buttons (Directions, Call, Email) */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-4">
          <a
            href={CONFIG.contact.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('directions_click')}
            className="h-11 rounded-md bg-[#16181B] border border-[#2B2F33] hover:border-[#E8590C] text-[#F2F2F0] text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <Navigation size={14} className="text-[#E8590C]" />
            <span>DIRECTIONS</span>
          </a>

          <a
            href={`tel:${CONFIG.contact.whatsappNumber}`}
            onClick={() => trackEvent('call_click')}
            className="h-11 rounded-md bg-[#16181B] border border-[#2B2F33] hover:border-[#E8590C] text-[#F2F2F0] text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <Phone size={14} className="text-[#E8590C]" />
            <span>CALL US</span>
          </a>

          <a
            href={`mailto:${CONFIG.contact.email}`}
            onClick={() => trackEvent('email_click')}
            className="h-11 rounded-md bg-[#16181B] border border-[#2B2F33] hover:border-[#E8590C] text-[#F2F2F0] text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <Mail size={14} className="text-[#E8590C]" />
            <span>EMAIL</span>
          </a>
        </div>

        {/* Small Address Line with SVG MapPin */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#8E9398] font-mono mb-6">
          <MapPin size={13} className="text-[#E8590C] shrink-0" />
          <span>{CONFIG.contact.address} • {CONFIG.contact.hours}</span>
        </div>

        {/* Bottom Bar: Copyright with © symbol & Barbell Back to Top Button */}
        <div className="w-full pt-6 border-t border-[#2B2F33]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E9398]">
          <p>© {CONFIG.brand.copyrightYear} {CONFIG.brand.name}. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141618] border border-[#2B2F33] hover:border-[#E8590C] text-xs font-mono text-[#C9CCCF] hover:text-[#E8590C] transition-colors cursor-pointer group"
          >
            <span>BACK TO TOP</span>
            <m.div
              animate={isBarbellLifting ? { y: -8, scale: 1.15 } : { y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: EASINGS.easeOut }}
              className="flex items-center gap-0.5 text-[#E8590C]"
            >
              <span className="w-0.5 h-3 bg-current rounded-xs" />
              <span className="w-2.5 h-0.5 bg-current rounded-xs" />
              <span className="w-0.5 h-3 bg-current rounded-xs" />
            </m.div>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
