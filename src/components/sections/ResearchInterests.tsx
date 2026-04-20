import { type Locale } from '@/lib/i18n';
import { type SiteConfig } from '@/lib/content';
import SectionTitle from '@/components/ui/SectionTitle';

type ResearchInterestsProps = {
  lang: Locale;
  config: SiteConfig;
  dict: { home: { research_interests_title: string } };
};

export default function ResearchInterests({ lang, config, dict }: ResearchInterestsProps) {
  const interests = config.research_interests[lang];

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

        {/* Interest pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {interests.map((interest, i) => (
            <InterestPill key={i} label={interest} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Individual pill ────────────────────────────────────────────────────────────

function InterestPill({ label, index }: { label: string; index: number }) {
  // Alternate between navy and gold accent styling
  const isAccented = index % 4 === 0;

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full
        font-body text-sm font-medium border
        transition-all duration-200 cursor-default
        ${isAccented
          ? 'bg-navy-700 text-white border-navy-700 shadow-sm'
          : 'bg-white text-navy-700 border-warm-200 shadow-card hover:border-gold-400/60 hover:shadow-card-md'
        }
      `}
    >
      {/* Small gold dot */}
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full flex-shrink-0
          ${isAccented ? 'bg-gold-400' : 'bg-gold-400/70'}`}
      />
      {label}
    </span>
  );
}
