import React, { memo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Dumbbell, Clock, User, Phone, Sparkles } from 'lucide-react';
import { CONFIG, getWhatsAppLink } from '../config';
import { trackEvent } from '../utils/analytics';
import { SPRINGS } from '../motion';

function FreeTrialModal({ isOpen, onClose, initialData = {}, onClaimSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    goal: initialData.goal || 'Strength & Powerlifting',
    timeSlot: 'Evening (5 PM - 9 PM)',
    trainer: initialData.trainer || '',
    program: initialData.program || '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');

    if (formData.name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setError('');
    setSubmitted(true);

    // Save persistent claimed state in localStorage
    try {
      const claimPayload = {
        claimed: true,
        name: formData.name.trim(),
        phone: cleanPhone,
        goal: formData.goal,
        ts: Date.now(),
      };
      localStorage.setItem(CONFIG.brand.localStorageKey, JSON.stringify(claimPayload));
      window.dispatchEvent(new CustomEvent('pass_claimed', { detail: claimPayload }));
    } catch {}

    trackEvent('trial_form_submit', {
      name: formData.name,
      goal: formData.goal,
      timeSlot: formData.timeSlot,
      trainer: formData.trainer || 'None',
      program: formData.program || 'None',
    });

    const message = [
      `🔥 *IRONFORGE FREE TRIAL PASS CLAIM* 🔥`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `👤 *Name:* ${formData.name}`,
      `📱 *WhatsApp:* ${formData.phone}`,
      `🎯 *Fitness Goal:* ${formData.goal}`,
      `⏰ *Preferred Time:* ${formData.timeSlot}`,
      formData.program ? `🏋️ *Program:* ${formData.program}` : '',
      formData.trainer ? `🥊 *Preferred Coach:* ${formData.trainer}` : '',
      `━━━━━━━━━━━━━━━━━━━━━`,
      `I would like to schedule my free 1-day all-access trial pass!`,
    ]
      .filter(Boolean)
      .join('\n');

    setTimeout(() => {
      const waLink = getWhatsAppLink(message);
      window.open(waLink, '_blank', 'noopener,noreferrer');
      onClaimSuccess?.(formData.name.trim());
      onClose();
      setSubmitted(false);
    }, 450);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop (Solid on mobile, blur on desktop) */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 lg:backdrop-blur-md"
          />

          {/* Modal / Bottom Sheet */}
          <m.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={SPRINGS.ui}
            className="relative z-10 w-full max-w-lg bg-[#121416] border border-[#2B2F33] rounded-t-2xl sm:rounded-xl shadow-2xl p-6 sm:p-8 max-h-[92svh] overflow-y-auto"
          >
            {/* Mobile Drag Indicator */}
            <div className="w-12 h-1.5 bg-[#2B2F33] rounded-full mx-auto mb-4 sm:hidden" />

            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#2B2F33]/60">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#E8590C] uppercase tracking-widest font-bold mb-1">
                  <Sparkles size={14} />
                  <span>1-Day Complimentary All-Access</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide">
                  CLAIM YOUR <span className="text-[#E8590C]">FREE PASS</span>
                </h3>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-[#1C1F22] hover:bg-[#2B2F33] text-[#C9CCCF] hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded bg-red-950/60 border border-red-800 text-xs text-red-200">
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#C9CCCF] uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9398]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 pl-10 pr-4 bg-[#181B1E] border border-[#2B2F33] rounded-md text-sm text-[#F2F2F0] placeholder-[#6E7378] focus:outline-none focus:border-[#E8590C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#C9CCCF] uppercase tracking-wider mb-1.5">
                  WhatsApp Number (10 Digits) *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9398]" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 pl-10 pr-4 bg-[#181B1E] border border-[#2B2F33] rounded-md text-sm text-[#F2F2F0] placeholder-[#6E7378] focus:outline-none focus:border-[#E8590C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#C9CCCF] uppercase tracking-wider mb-1.5">
                  Primary Fitness Goal
                </label>
                <div className="relative">
                  <Dumbbell size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9398]" />
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full h-12 pl-10 pr-4 bg-[#181B1E] border border-[#2B2F33] rounded-md text-sm text-[#F2F2F0] focus:outline-none focus:border-[#E8590C] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Strength & Powerlifting">Strength & Powerlifting (1RM Compound Lifts)</option>
                    <option value="Muscle Building & Hypertrophy">Muscle Building & Aesthetics</option>
                    <option value="Fat Loss & High Conditioning">Fat Loss & High Intensity Conditioning</option>
                    <option value="General Strength & Longevity">General Fitness & Brotherhood</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#C9CCCF] uppercase tracking-wider mb-1.5">
                  Preferred Trial Time
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9398]" />
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full h-12 pl-10 pr-4 bg-[#181B1E] border border-[#2B2F33] rounded-md text-sm text-[#F2F2F0] focus:outline-none focus:border-[#E8590C] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Morning (6:00 AM - 9:00 AM)">Morning (6:00 AM - 9:00 AM)</option>
                    <option value="Mid-Day (12:00 PM - 4:00 PM)">Mid-Day (12:00 PM - 4:00 PM)</option>
                    <option value="Evening (5:00 PM - 9:00 PM)">Evening (5:00 PM - 9:00 PM)</option>
                    <option value="Late Night (9:00 PM - 12:00 AM)">Late Night (9:00 PM - 12:00 AM)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitted}
                className="w-full h-14 rounded-md bg-[#E8590C] hover:bg-[#FF6B1A] text-white font-heading text-lg tracking-wider uppercase flex items-center justify-center gap-2 btn-primary-sweep active:scale-[0.98] transition-transform mt-6 shadow-[0_4px_25px_rgba(232,89,12,0.45)] cursor-pointer"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={20} className="text-white animate-spin" />
                    <span>CLAIMING YOUR PASS...</span>
                  </>
                ) : (
                  <>
                    <span>CONFIRM & OPEN WHATSAPP PASS</span>
                    <span className="text-xl">→</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#8E9398] text-center font-mono mt-2">
                🔒 100% Free. No commitment required. Instant confirmation.
              </p>
            </form>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(FreeTrialModal);
