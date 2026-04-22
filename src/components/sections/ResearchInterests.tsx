import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { type SiteConfig } from '@/lib/content';
import SectionTitle from '@/components/ui/SectionTitle';

type ResearchInterestsProps = {
  lang: Locale;
  config: SiteConfig;
  dict: { home: { research_interests_title: string } };
};

export default function ResearchInterests({ lang, config, dict }: ResearchInterestsProps) {
  const interests    = config.research_interests[lang];
  const interestsEn  = config.research_interests.en;

  if (!interests || interests.length === 0) return null;

  return (
    <section className="bg-warm-50 border-y border-warm-200" aria-labelledby="interests-heading">
      <div className="container-main section-sm">

        <SectionTitle
          id="interests-heading"
          as="h2"
          align="center"
          accent
        >
          {dict.home.research_interests_title}
        </SectionTitle>

        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {interests.map((interest, i) => (
            <Link
              key={i}
              href={`/${lang}/publications?interest=${encodeURIComponent(interestsEn[i] ?? interest)}`}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                font-body text-sm font-medium border
                bg-warm-50 text-navy-700 border-navy-700
                hover:bg-navy-700 hover:text-white
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
