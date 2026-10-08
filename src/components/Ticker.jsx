import React, { memo, useMemo } from 'react';
import { CONFIG } from '../config';
import { useSectionVisibility } from '../hooks/useSectionVisibility';

function Ticker() {
  const [sectionRef] = useSectionVisibility();
  const words = CONFIG.tickerWords;
  const repeatedWords = useMemo(() => [...words, ...words, ...words, ...words], [words]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#121416] py-3.5 border-y border-[#2B2F33] flex items-center select-none"
    >
      {/* Single Slow Continuous Ticker (GPU translate3d loop) */}
      <div className="animate-ticker-smooth flex items-center">
        {repeatedWords.map((word, idx) => (
          <div key={`ticker-${idx}`} className="flex items-center shrink-0 mx-4 sm:mx-6">
            <span className="font-heading text-lg sm:text-2xl tracking-wider text-[#F2F2F0] uppercase font-bold">
              {word}
            </span>
            <span className="text-[#E8590C] text-sm ml-8 sm:ml-12 font-bold">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Ticker);
