import React, { memo, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ArrowRight, Sparkles } from 'lucide-react';
import { CONFIG, getWhatsAppLink } from '../config';
import { useDocumentTitle } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

function ProgramDetail({ onOpenTrial }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const program = CONFIG.programs.find((p) => p.slug === slug) || CONFIG.programs[0];
  const trainer = CONFIG.trainers.find((t) => t.slug === program.assignedTrainerSlug) || CONFIG.trainers[0];

  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG.brand.localStorageKey);
      if (saved) setClaimed(true);
    } catch {}
  }, []);

  useDocumentTitle(
    `${program.title} | IRONFORGE Training Programs`,
    program.description
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleTrialClick = () => {
    trackEvent('program_trial_click', { program: program.title });
    if (claimed) {
      window.open(
        getWhatsAppLink(`Hi IRONFORGE! I previously claimed a pass and want to schedule for ${program.title}.`),
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      onOpenTrial({ program: program.title });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F2F2F0] pb-24 pt-20">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/#programs')}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#8E9398] hover:text-[#E8590C] uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>BACK TO ALL PROGRAMS</span>
        </button>
      </div>

      {/* Program Hero Banner */}
      <section className="relative w-full h-[55vh] min-h-[380px] max-h-[520px] overflow-hidden">
        <img
          src={program.image}
          alt={program.title}
          width={1280}
          height={600}
          className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-110"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/40" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8">
          <span className="px-3 py-1 rounded bg-[#E8590C] text-white font-mono text-xs font-bold uppercase tracking-widest self-start mb-3 shadow-md">
            {program.category}
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#F2F2F0] uppercase tracking-tight leading-none mb-3">
            {program.title}
          </h1>
          <p className="text-[#C9CCCF] text-sm sm:text-base max-w-2xl">
            {program.description}
          </p>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left 8 Cols: Overview, What's Included, Schedule, Who it's for */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Overview */}
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-[#E8590C]">01.</span>
              <span>PROGRAM OVERVIEW</span>
            </h2>
            <p className="text-[#C9CCCF] text-base leading-relaxed">
              {program.overview}
            </p>
          </div>

          {/* What's Included */}
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-[#E8590C]">02.</span>
              <span>WHAT IS INCLUDED</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {program.whatsIncluded.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-lg bg-[#141618] border border-[#2B2F33]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#E8590C]/20 text-[#E8590C] flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-sm text-[#C9CCCF]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Training Split */}
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-[#E8590C]">03.</span>
              <span>SAMPLE WEEKLY SPLIT</span>
            </h2>
            <div className="space-y-2.5">
              {program.weeklySchedule.map((sched, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded bg-[#141618] border border-[#2B2F33] gap-1 sm:gap-4"
                >
                  <span className="font-heading text-sm text-[#E8590C] uppercase tracking-wider w-28 shrink-0">
                    {sched.day}
                  </span>
                  <span className="text-xs sm:text-sm text-[#F2F2F0]">
                    {sched.focus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Who It's For */}
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="text-[#E8590C]">04.</span>
              <span>IDEAL CANDIDATE</span>
            </h2>
            <p className="text-[#C9CCCF] text-sm leading-relaxed p-4 rounded-lg bg-[#141618] border border-[#2B2F33]">
              {program.whoItsFor}
            </p>
          </div>
        </div>

        {/* Right 4 Cols: Assigned Head Coach & Action CTAs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Card */}
          <div className="p-6 rounded-xl bg-[#141618] border border-[#2B2F33] shadow-xl space-y-4">
            <h3 className="font-heading text-xl text-[#F2F2F0] uppercase tracking-wide">
              START THIS PROGRAM
            </h3>
            <p className="text-xs text-[#8E9398] leading-relaxed">
              Experience the training environment with a 1-day free pass, or join a membership plan.
            </p>

            {/* Book Trial Button */}
            <button
              onClick={handleTrialClick}
              className="w-full h-12 rounded bg-[#E8590C] hover:bg-[#FF6B1A] text-white font-heading text-sm uppercase tracking-wider flex items-center justify-center gap-2 btn-primary-sweep active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span>{claimed ? 'TRIAL REQUESTED ✓' : 'CLAIM FREE TRIAL PASS'}</span>
              <ArrowRight size={16} />
            </button>

            {/* View Plans Button */}
            <Link
              to="/#pricing"
              className="w-full h-12 rounded btn-outline-travel text-[#F2F2F0] hover:text-white font-heading text-sm uppercase tracking-wider flex items-center justify-center cursor-pointer"
            >
              <span>VIEW MEMBERSHIP PLANS</span>
            </Link>
          </div>

          {/* Assigned Head Coach Card */}
          <div className="p-6 rounded-xl bg-[#141618] border border-[#2B2F33] shadow-xl">
            <span className="text-[10px] font-mono text-[#E8590C] uppercase tracking-widest font-bold block mb-3">
              HEAD PROGRAM COACH
            </span>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={trainer.image}
                alt={trainer.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#E8590C] shadow-md"
                loading="lazy"
                decoding="async"
              />
              <div>
                <h4 className="font-heading text-lg text-[#F2F2F0] uppercase">
                  {trainer.name}
                </h4>
                <p className="text-xs text-[#8E9398] font-mono">
                  {trainer.role} • {trainer.experience}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#C9CCCF] line-clamp-3 mb-4 leading-relaxed">
              {trainer.bio}
            </p>
            <Link
              to={`/trainers/${trainer.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E8590C] hover:text-[#FFA066] uppercase"
            >
              <span>View Coach Profile</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProgramDetail);
