'use client';

import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { type SiteConfig } from '@/lib/content';
import { trackInterestClick } from '@/lib/analytics';

type ResearchInterestsProps = {
  lang: Locale;
  config: SiteConfig;
  dict: { home: { research_interests_title: string } };
};

export default function ResearchInterests({ lang, config, dict }: ResearchInterestsProps) {
  const interests   = config.research_interests[lang];
  const interestsEn = config.research_interests.en;

  if (!interests || interests.length === 0) return null;

  return (
    <section className="bg-navy-700" aria-labelledby="interests-heading">
      <div className="container-main section-sm">

        {/* Section title — white on navy */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3" aria-hidden="true">
            <div className="h-px w-10 bg-gold-400/60" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            <div className="h-px w-10 bg-gold-400/60" />
          </div>
          <h2
            id="interests-heading"
            className="font-display text-2xl sm:text-3xl font-semibold text-white"
          >
            {dict.home.research_interests_title}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {interests.map((interest, i) => (
            <Link
              key={i}
              href={`/${lang}/publications?interest=${encodeURIComponent(interestsEn[i] ?? interest)}`}
              onClick={() => trackInterestClick(interestsEn[i] ?? interest)}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                font-body text-sm font-medium border
                bg-transparent text-white border-white/40
                hover:bg-white hover:text-navy-700 hover:border-white
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
              "
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
              {interest}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
