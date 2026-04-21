'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n';

type Props = {
  bioEn: string[];
  bioTr: string[];
  initialLang: Locale;
  dict: { toggle_en: string; toggle_tr: string };
};

export default function BiographySection({ bioEn, bioTr, initialLang, dict }: Props) {
  const [activeLang, setActiveLang] = useState<Locale>(initialLang);
  const paragraphs = activeLang === 'en' ? bioEn : bioTr;

  return (
    <div>
      {/* Language toggle */}
      <div
        className="flex items-center gap-0.5 mb-8 p-1 bg-warm-200/60 rounded-lg w-fit border border-warm-300/50"
        role="group"
        aria-label="Select biography language"
      >
        {(['en', 'tr'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setActiveLang(l)}
            aria-pressed={activeLang === l}
            className={`px-4 py-1.5 rounded-md text-sm font-medium font-body transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
              ${
                activeLang === l
                  ? 'bg-white text-navy-700 shadow-card font-semibold'
                  : 'text-slate-500 hover:text-navy-600 hover:bg-white/60'
              }`}
          >
            {l === 'en' ? dict.toggle_en : dict.toggle_tr}
          </button>
        ))}
      </div>

      {/* Bio paragraphs — key includes lang so React re-renders on switch */}
      <div className="space-y-5">
        {paragraphs.map((para, i) => (
          <p
            key={`${activeLang}-${i}`}
            className="prose-scholar font-body text-body-lg text-slate-700 leading-relaxed"
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
