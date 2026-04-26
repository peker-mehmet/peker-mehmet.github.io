import Image from 'next/image';
import { type Locale } from '@/lib/i18n';
import { type SiteConfig, type Publication, type Scale, type Project, type Collaboration } from '@/lib/content';
import Button from '@/components/ui/Button';
import CVGenerator from '@/components/CVGenerator';
import HeroScrollHint from '@/components/sections/HeroScrollHint';

// ── Types ─────────────────────────────────────────────────────────────────────

type HeroDict = {
  home: {
    cv_download: string;
    work_phone: string;
    university_profile: string;
  };
  about: {
    google_scholar: string;
    orcid: string;
    researchgate: string;
    generate_cv: string;
    cv_modal_title: string;
    copy: string;
    copied: string;
    download_txt: string;
    download_docx: string;
    close: string;
  };
};

type HeroSectionProps = {
  lang: Locale;
  config: SiteConfig;
  dict: HeroDict;
  publications: Publication[];
  scales: Scale[];
  projects: Project[];
  collaborations: Collaboration[];
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

// ── Contact icons ─────────────────────────────────────────────────────────────

function EmailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      className="h-4 w-4 flex-shrink-0 text-gold-500" aria-hidden="true">
      <rect x="2" y="4" width="16" height="12" rx="2" />
      <path d="M2 7l8 5 8-5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round"
      className="h-4 w-4 flex-shrink-0 text-gold-500" aria-hidden="true">
      <path d="M3 5a2 2 0 012-2h1.5a1 1 0 01.95.68l.8 2.4a1 1 0 01-.23 1.02L6.9 8.22A11.05 11.05 0 0011.78 13.1l1.12-1.12a1 1 0 011.02-.23l2.4.8A1 1 0 0117 13.5V15a2 2 0 01-2 2h-.5C7.82 17 3 12.18 3 6.5V5z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      className="h-4 w-4" aria-hidden="true">
      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

// ── Platform logos (inline SVG) ───────────────────────────────────────────────

function LogoScholar() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" fill="currentColor">
      <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
    </svg>
  );
}

function LogoOrcid() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" fill="currentColor">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.872-2.203 3.872-3.722 0-2.016-1.131-3.722-3.878-3.722h-2.291z" />
    </svg>
  );
}

function LogoResearchGate() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" fill="currentColor">
      <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a12.193 12.193 0 0 0-.32 2.199 10.851 10.851 0 0 1-.524 3.043 9.316 9.316 0 0 1-1.253 2.461c-.572.808-1.347 1.554-2.317 2.238-.97.683-2.187 1.25-3.65 1.7a17.84 17.84 0 0 1-5.238.672H0V24h4.709v-9.198c.43.023.89.034 1.377.034 1.907 0 3.591-.407 5.051-1.221 1.46-.815 2.614-1.959 3.462-3.43.849-1.47 1.273-3.151 1.273-5.042 0-1.11-.189-2.135-.566-3.072H24V0h-4.414zm-7.742 13.052c-.624.648-1.447 1.14-2.468 1.476-1.022.336-2.205.503-3.546.503-.576 0-1.072-.014-1.487-.041v6.805H2.27V5.038h2.073V13.3c.558.034 1.137.05 1.737.05 1.274 0 2.416-.162 3.424-.488 1.01-.325 1.815-.82 2.416-1.486.6-.666.9-1.47.9-2.413 0-.886-.268-1.617-.806-2.19-.537-.575-1.302-.86-2.294-.86-.847 0-1.556.217-2.128.65-.572.432-.858 1.018-.858 1.757 0 .695.231 1.243.694 1.644.462.4 1.048.6 1.757.6.57 0 1.042-.117 1.42-.35.378-.235.638-.553.78-.955H9.39c-.21.597-.618 1.075-1.224 1.433-.606.358-1.319.537-2.137.537-1.047 0-1.88-.29-2.5-.87-.62-.58-.93-1.346-.93-2.298 0-1.01.367-1.836 1.1-2.476.733-.64 1.672-.96 2.817-.96 1.314 0 2.35.37 3.107 1.111.757.741 1.135 1.72 1.135 2.937 0 1.006-.307 1.876-.92 2.607z" />
    </svg>
  );
}

function LogoLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LogoInstitution() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round"
      className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true">
      <path d="M3 21h18M3 10h18M12 3L3 10h18L12 3zM9 21v-5a3 3 0 0 1 6 0v5" />
    </svg>
  );
}

// ── Profile photo ──────────────────────────────────────────────────────────────

function ProfilePhoto({ config, lang }: { config: SiteConfig; lang: Locale }) {
  const isPlaceholder =
    !config.photo.profile || config.photo.profile === '/images/profile.jpg';

  return (
    <div className="relative flex items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, rgba(201,168,76,0.35) 25%, transparent 50%, rgba(30,58,95,0.15) 75%, transparent 100%)',
          animation: 'orb-drift-slow 18s linear infinite',
        }}
      />
      <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden
                      border-4 border-white shadow-card-lg ring-2 ring-gold-400/30 ring-offset-4 ring-offset-white">
        {!isPlaceholder ? (
          <Image
            src={config.photo.profile}
            alt={config.photo.alt[lang]}
            fill
            sizes="(max-width: 640px) 240px, (max-width: 1024px) 288px, 320px"
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

export default function HeroSection({ lang, config, dict, publications, scales, projects, collaborations }: HeroSectionProps) {
  const { owner, institution, bio, links } = config;

  const isDefaultName = owner.name.full === 'Your Full Name';
  const displayName = isDefaultName ? 'Your Name' : owner.name.full;

  const cvLink = lang === 'tr' ? (links.cv_tr || links.cv) : links.cv;

  const profileLinks = [
    {
      key: 'scholar',
      label: dict.about.google_scholar,
      href: links.google_scholar,
      logo: <LogoScholar />,
      hoverBg: '#1e3a5f',
      hoverText: '#ffffff',
    },
    {
      key: 'orcid',
      label: dict.about.orcid,
      href: links.orcid,
      logo: <LogoOrcid />,
      hoverBg: '#A6CE39',
      hoverText: '#ffffff',
    },
    {
      key: 'rg',
      label: dict.about.researchgate,
      href: links.researchgate,
      logo: <LogoResearchGate />,
      hoverBg: '#00CCBB',
      hoverText: '#ffffff',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: (links as Record<string, string>).linkedin,
      logo: <LogoLinkedIn />,
      hoverBg: '#0077B5',
      hoverText: '#ffffff',
    },
    {
      key: 'unisis',
      label: 'ÜNİSİS',
      href: links.unisis,
      logo: <LogoInstitution />,
      hoverBg: '#1e3a5f',
      hoverText: '#ffffff',
    },
    {
      key: 'yoksis',
      label: 'YÖKSİS',
      href: links.yoksis,
      logo: <LogoInstitution />,
      hoverBg: '#1e3a5f',
      hoverText: '#ffffff',
    },
  ].filter((p) => Boolean(p.href));

  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-label="Introduction"
    >
      {/* ── Animated background mesh ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Navy orb — top-left */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(30,58,95,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'orb-drift 34s ease-in-out infinite',
          }}
        />
        {/* Gold orb — bottom-right */}
        <div
          className="absolute -bottom-24 -right-16 w-[440px] h-[440px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'orb-drift-gold 38s ease-in-out infinite',
          }}
        />
        {/* Warm center orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(250,248,245,0.8) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'orb-drift-alt 42s ease-in-out infinite reverse',
          }}
        />
        {/* Navy orb — mid-right */}
        <div
          className="absolute top-1/4 right-1/4 w-[280px] h-[280px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(30,58,95,0.05) 0%, transparent 70%)',
            filter: 'blur(35px)',
            animation: 'orb-drift-slow 30s ease-in-out infinite',
          }}
        />
        {/* Dot grid texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.022]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#1e3a5f" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="container-main section !pt-10 lg:!pt-14 relative z-10">
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

            {/* ── Contact info ─────────────────────────────────────────── */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
              {links.email && (
                <a
                  href={`mailto:${links.email}`}
                  className="flex items-center gap-2 font-body text-sm text-slate-600 hover:text-navy-700 transition-colors duration-150"
                >
                  <EmailIcon />
                  {links.email}
                </a>
              )}
              {links.phone && (
                <a
                  href={`tel:${links.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 font-body text-sm text-slate-600 hover:text-navy-700 transition-colors duration-150"
                  aria-label={`${dict.home.work_phone}: ${links.phone}`}
                >
                  <PhoneIcon />
                  {links.phone}
                </a>
              )}
            </div>

            {/* ── CV actions ───────────────────────────────────────────── */}
            <div className="mt-5 flex flex-wrap gap-3">
              {cvLink && (
                <Button href={cvLink} variant="gold" size="lg" external>
                  <DownloadIcon />
                  {dict.home.cv_download}
                </Button>
              )}
              <CVGenerator
                lang={lang}
                config={config}
                publications={publications}
                scales={scales}
                projects={projects}
                collaborations={collaborations}
                dict={dict.about}
              />
            </div>

            {/* ── Academic profile pills ───────────────────────────────── */}
            {profileLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2" aria-label={dict.home.university_profile}>
                {profileLinks.map(({ key, label, href, logo, hoverBg, hoverText }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      border font-body text-xs font-semibold tracking-wide
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                    style={
                      { '--pill-hover-bg': hoverBg, '--pill-hover-text': hoverText } as React.CSSProperties
                    }
                  >
                    {logo}
                    {label}
                  </a>
                ))}
              </div>
            )}
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

      {/* Scroll hint */}
      <div className="relative z-10">
        <HeroScrollHint />
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
