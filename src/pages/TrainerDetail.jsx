import React, { memo, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import { CONFIG, getWhatsAppLink } from '../config';
import { useDocumentTitle } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

function TrainerDetail({ onOpenTrial }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const trainer = CONFIG.trainers.find((t) => t.slug === slug) || CONFIG.trainers[0];
  const coachedPrograms = CONFIG.programs.filter((p) =>
    trainer.coachedProgramSlugs?.includes(p.slug)
  );

  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG.brand.localStorageKey);
      if (saved) setClaimed(true);
    } catch {}
  }, []);

  useDocumentTitle(
    `Coach ${trainer.name} - ${trainer.role} | IRONFORGE Coaches`,
    trainer.bio
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleBookingClick = () => {
    trackEvent('trainer_trial_click', { trainer: trainer.name });
    if (claimed) {
      window.open(
        getWhatsAppLink(`Hi IRONFORGE! I previously claimed a pass and want to schedule a 1-on-1 session with Coach ${trainer.name}.`),
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      onOpenTrial({ trainer: trainer.name });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F2F2F0] pb-24 pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate('/#trainers')}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#8E9398] hover:text-[#E8590C] uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>BACK TO ALL COACHES</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left 5 Cols: Trainer Portrait & Quick Stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-xl overflow-hidden bg-[#141618] border border-[#2B2F33] shadow-2xl">
              <img
                src={trainer.image}
                alt={trainer.name}
                width={500}
                height={520}
                className="w-full h-[460px] sm:h-[520px] object-cover object-top filter brightness-95"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0A0A]/95 lg:backdrop-blur-md border border-[#2B2F33] text-xs font-mono text-[#E8590C]">
                <ShieldCheck size={15} />
                <span>{trainer.badge}</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-mono font-bold tracking-widest text-[#E8590C] uppercase block mb-1">
                  {trainer.role} • {trainer.experience}
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl text-[#F2F2F0] uppercase tracking-wide">
                  {trainer.name}
                </h1>
                <p className="text-xs text-[#C9CCCF] mt-1 font-mono">
                  Specialty: {trainer.specialty}
                </p>
              </div>
            </div>

            {/* Trainer Stats Grid */}
            {trainer.stats && (
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#141618] border border-[#2B2F33] text-center shadow-md">
                {Object.entries(trainer.stats).map(([k, v], idx) => (
                  <div key={idx}>
                    <div className="font-heading text-xl text-[#E8590C]">{v}</div>
                    <div className="text-[10px] font-mono text-[#8E9398] uppercase tracking-wider">{k}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right 7 Cols: Biography, Achievements, Coached Programs, Booking CTA */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bio */}
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="text-[#E8590C]">01.</span>
                <span>COACHING PHILOSOPHY & BACKGROUND</span>
              </h2>
              <p className="text-[#C9CCCF] text-base leading-relaxed p-5 rounded-xl bg-[#141618] border border-[#2B2F33]">
                {trainer.bio}
              </p>
            </div>

            {/* Achievements & Certifications */}
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="text-[#E8590C]">02.</span>
                <span>CREDENTIALS & ACHIEVEMENTS</span>
              </h2>
              <div className="space-y-3">
                {trainer.achievements?.map((ach, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-lg bg-[#141618] border border-[#2B2F33]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#E8590C]/20 text-[#E8590C] flex items-center justify-center shrink-0 mt-0.5">
                      <Award size={15} />
                    </div>
                    <span className="text-sm text-[#F2F2F0] font-medium">{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Programs Coached by this Trainer */}
            {coachedPrograms.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl text-[#F2F2F0] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="text-[#E8590C]">03.</span>
                  <span>PROGRAMS COACHED</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coachedPrograms.map((prog) => (
                    <Link
                      key={prog.id}
                      to={`/programs/${prog.slug}`}
                      className="p-4 rounded-xl bg-[#141618] border border-[#2B2F33] hover:border-[#E8590C] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[#E8590C] uppercase block mb-1">
                          {prog.category}
                        </span>
                        <h4 className="font-heading text-lg text-[#F2F2F0] uppercase group-hover:text-[#E8590C] transition-colors">
                          {prog.title}
                        </h4>
                      </div>
                      <ArrowRight size={18} className="text-[#8E9398] group-hover:text-[#E8590C] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Action Card */}
            <div className="p-6 rounded-xl bg-[#16181B] border border-[#E8590C]/50 shadow-2xl space-y-4">
              <h3 className="font-heading text-2xl text-[#F2F2F0] uppercase tracking-wide">
                BOOK A 1-ON-1 SESSION WITH {trainer.name.toUpperCase()}
              </h3>
              <p className="text-xs sm:text-sm text-[#C9CCCF] leading-relaxed">
                Schedule an introductory assessment and form evaluation with Coach {trainer.name}.
              </p>

              <button
                onClick={handleBookingClick}
                className="w-full h-14 rounded-md bg-[#E8590C] hover:bg-[#FF6B1A] text-white font-heading text-base tracking-wider uppercase flex items-center justify-center gap-2 btn-primary-sweep active:scale-[0.98] transition-transform cursor-pointer"
              >
                <span>{claimed ? 'TRIAL REQUESTED ✓' : `CLAIM 1-ON-1 TRIAL PASS WITH ${trainer.name.toUpperCase()}`}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TrainerDetail);
