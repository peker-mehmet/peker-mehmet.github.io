import Image from 'next/image';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { type SiteConfig } from '@/lib/content';
import Button from '@/components/ui/Button';

// ── Types ─────────────────────────────────────────────────────────────────────

type HeroDict = {
  home: {
    cta_scales: string;
    cta_publications: string;
    cv_download: string;
  };
};

type HeroSectionProps = {
  lang: Locale;
  config: SiteConfig;
  dict: HeroDict;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ── Profile photo ──────────────────────────────────────────────────────────────

function ProfilePhoto({ config, lang }: { config: SiteConfig; lang: Locale }) {
  const isPlaceholder =
    !config.photo.profile || config.photo.profile === '/images/profile.jpg';

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer decoration ring */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, rgba(201,168,76,0.35) 25%, transparent 50%, rgba(30,58,95,0.15) 75%, transparent 100%)',
          animation: 'orb-drift-slow 18s linear infinite',
        }}
      />

      {/* Main circle */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden
                      border-4 border-white shadow-card-lg ring-2 ring-gold-400/30 ring-offset-4 ring-offset-white">
        {!isPlaceholder ? (
          <Image
            src={config.photo.profile}
            alt={config.photo.alt[lang]}
            fill
            sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-100 to-navy-200
                          flex flex-col items-center justify-center gap-2">
            <span className="font-display text-5xl font-semibold text-navy-400 select-none">
              {getInitials(config.owner.name.full)}
            </span>
            <div className="h-px w-12 bg-gold-400/50" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Subtle secondary ring */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-full border border-gold-200/40"
        style={{ animation: 'orb-drift-alt 24s ease-in-out infinite' }}
      />
    </div>
  );
}

// ── GoldAccent ────────────────────────────────────────────────────────────────

function GoldAccent() {
  return (
    <div className="flex items-center gap-2 my-5" aria-hidden="true">
      <div className="h-px w-12 bg-gold-400" />
      <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
      <div className="h-px w-6 bg-gold-300/60" />
    </div>
  );
}

// ── HeroSection ───────────────────────────────────────────────────────────────

export default function HeroSection({ lang, config, dict }: HeroSectionProps) {
  const { owner, institution, bio, links } = config;

  const isDefaultName = owner.name.full === 'Your Full Name';
  const displayName = isDefaultName ? 'Your Name' : owner.name.full;

  const cvLink = lang === 'tr' ? (links.cv_tr || links.cv) : links.cv;

  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-label="Introduction"
    >
      {/* ── Animated background orbs ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-navy-50 opacity-60"
          style={{ filter: 'blur(80px)', animation: 'orb-drift 30s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-16 right-0 w-[420px] h-[420px] rounded-full bg-gold-50 opacity-50"
          style={{ filter: 'blur(80px)', animation: 'orb-drift-alt 26s ease-in-out infinite' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-warm-100 opacity-70"
          style={{ filter: 'blur(64px)', animation: 'orb-drift 38s ease-in-out infinite reverse' }}
        />
        {/* Subtle dot-grid texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.025]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#1e3a5f" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="container-main section relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Text column ──────────────────────────────────────────── */}
          <div
            className="order-2 lg:order-1"
            style={{ animation: 'fade-up 0.6s ease-out both' }}
          >
            {/* Eyebrow: title · department */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-body text-label uppercase tracking-widest text-gold-600 font-semibold">
                {owner.title[lang]}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
              <span className="font-body text-label uppercase tracking-widest text-slate-400">
                {institution.department[lang]}
              </span>
            </div>

            {/* Name */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-navy-700 leading-[1.1] tracking-tight">
              {displayName}
            </h1>

            {/* Institution */}
            <p className="mt-2 font-body text-sm text-slate-400 tracking-wide">
              {institution.name[lang]}
            </p>

            <GoldAccent />

            {/* Bio */}
            <p className="font-body text-body-lg text-slate-600 leading-relaxed max-w-xl">
              {bio.short[lang]}
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`/${lang}/scales`} variant="primary" size="lg">
                {dict.home.cta_scales}
              </Button>
              <Button href={`/${lang}/publications`} variant="outline" size="lg">
                {dict.home.cta_publications}
              </Button>
              {cvLink && (
                <Button href={cvLink} variant="ghost" size="lg" external>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                    className="h-4 w-4" aria-hidden="true">
                    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {dict.home.cv_download}
                </Button>
              )}
            </div>
          </div>

          {/* ── Photo column ──────────────────────────────────────────── */}
          <div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            style={{ animation: 'fade-up 0.6s ease-out 0.15s both' }}
          >
            <ProfilePhoto config={config} lang={lang} />
          </div>

        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(250,248,245,0.4))' }}
        aria-hidden="true"
      />
    </section>
  );
}
