import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { getSiteConfig } from '@/lib/content';

// ── Types ─────────────────────────────────────────────────────────────────────

type FooterDict = {
  nav: {
    site_name: string;
    home: string;
    about: string;
    publications: string;
    scales: string;
    news: string;
    teaching: string;
    contact: string;
    collaborations: string;
  };
  footer: {
    rights: string;
    quick_links: string;
    connect: string;
    last_updated: string;
    back_to_top: string;
  };
};

// ── SVG icon paths (Heroicons 2.0 Outline, 24×24) ────────────────────────────

const ICON_PATHS = {
  email: [
    'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75',
    'M3.75 6.75A2.25 2.25 0 016 4.5h12a2.25 2.25 0 012.25 2.25',
    'M3.75 6.75l8.25 5.25 8.25-5.25',
  ],
  scholar: [
    'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
  ],
  orcid: [
    'M9 12.75L11.25 15 15 9.75',
    'M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
  ],
  researchgate: [
    'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z',
    'M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z',
    'M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  ],
  linkedin: [
    'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25',
  ],
} satisfies Record<string, string[]>;

// ── Icon component ────────────────────────────────────────────────────────────

function Icon({ name, className = '' }: { name: keyof typeof ICON_PATHS; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {ICON_PATHS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

// ── GoldRule — decorative divider ─────────────────────────────────────────────

function GoldRule() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <div className="h-px flex-1 bg-navy-800" />
      <div className="flex items-center gap-1">
        <div className="h-px w-8 bg-gradient-to-r from-navy-800 to-gold-500/60" />
        <div className="h-1.5 w-1.5 rounded-full bg-gold-500/70" />
        <div className="h-px w-4 bg-gradient-to-l from-navy-800 to-gold-500/60" />
      </div>
      <div className="h-px flex-1 bg-navy-800" />
    </div>
  );
}

// ── BackToTop — client-free, uses CSS anchor ──────────────────────────────────

function BackToTop({ label }: { label: string }) {
  return (
    <a
      href="#top"
      className="
        group inline-flex items-center gap-1.5
        font-body text-xs text-navy-500 hover:text-gold-400
        transition-colors duration-200
      "
      aria-label={label}
    >
      <svg
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <path d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
      {label}
    </a>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────

export default function Footer({ lang, dict }: { lang: Locale; dict: FooterDict }) {
  const config = getSiteConfig();
  const { owner, institution, bio, links } = config;

  // Nav links — same order as Navbar
  const navLinks = [
    { href: `/${lang}`,               label: dict.nav.home },
    { href: `/${lang}/about`,         label: dict.nav.about },
    { href: `/${lang}/publications`,  label: dict.nav.publications },
    { href: `/${lang}/scales`,        label: dict.nav.scales },
    { href: `/${lang}/news`,            label: dict.nav.news },
    { href: `/${lang}/collaborations`, label: dict.nav.collaborations },
    { href: `/${lang}/teaching`,       label: dict.nav.teaching },
    { href: `/${lang}/contact`,        label: dict.nav.contact },
  ];

  // Social / academic links — only render entries that have a URL
  const socialLinks = [
    { key: 'email',       label: 'Email',          href: links.email ? `mailto:${links.email}` : '', external: false },
    { key: 'scholar',     label: 'Google Scholar', href: links.google_scholar, external: true },
    { key: 'orcid',       label: 'ORCID',          href: links.orcid,          external: true },
    { key: 'researchgate',label: 'ResearchGate',   href: links.researchgate,   external: true },
    { key: 'linkedin',    label: 'LinkedIn',        href: links.linkedin,       external: true },
  ].filter((l) => Boolean(l.href)) as { key: keyof typeof ICON_PATHS; label: string; href: string; external: boolean }[];

  // Build date — renders at static-build time, giving a true "last updated" stamp
  const lastUpdated = new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date());

  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-navy-900 text-white mt-auto" aria-label="Site footer">

      {/* ── Upper section: three columns ─────────────────────────────────── */}
      <div className="container-main py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">

          {/* ── Column 1: Identity ─────────────────────────────────────── */}
          <div className="lg:pr-8">
            {/* Site / name */}
            <Link
              href={`/${lang}`}
              className="group inline-block mb-1"
              aria-label={`${dict.nav.site_name} — ${dict.nav.home}`}
            >
              <span className="font-display text-2xl font-semibold text-white group-hover:text-gold-400 transition-colors duration-200">
                {owner.name.full !== 'Your Full Name' ? owner.name.full : dict.nav.site_name}
              </span>
            </Link>

            {/* Title · Department */}
            <p className="font-body text-sm text-navy-300 mb-1">
              {owner.title[lang]}
            </p>
            <p className="font-body text-xs text-navy-400 mb-5">
              {institution.department[lang]}
              {institution.name[lang] && institution.name[lang] !== 'Your University Name' && (
                <>
                  <span className="mx-1.5 text-navy-600" aria-hidden="true">·</span>
                  {institution.name[lang]}
                </>
              )}
            </p>

            {/* Decorative rule */}
            <div className="flex items-center gap-1.5 mb-5" aria-hidden="true">
              <div className="h-px w-8 bg-gold-500/60" />
              <div className="h-1 w-1 rounded-full bg-gold-500/60" />
              <div className="h-px w-4 bg-gold-400/30" />
            </div>

            {/* Short bio */}
            <p className="font-body text-sm leading-relaxed text-navy-400 max-w-xs">
              {bio.short[lang]}
            </p>
          </div>

          {/* ── Column 2: Quick Links ──────────────────────────────────── */}
          <div>
            <h2 className="font-body text-label uppercase tracking-widest text-navy-500 font-semibold mb-5">
              {dict.footer.quick_links}
            </h2>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2.5">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="
                        group inline-flex items-center gap-2
                        font-body text-sm text-navy-300
                        hover:text-gold-400 transition-colors duration-200
                      "
                    >
                      {/* Tiny arrow that slides on hover */}
                      <span
                        aria-hidden="true"
                        className="
                          inline-block h-px w-3 bg-navy-600
                          group-hover:w-4 group-hover:bg-gold-500
                          transition-all duration-200
                        "
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Column 3: Social / Academic Links ─────────────────────── */}
          <div>
            <h2 className="font-body text-label uppercase tracking-widest text-navy-500 font-semibold mb-5">
              {dict.footer.connect}
            </h2>

            {socialLinks.length > 0 ? (
              <ul className="space-y-3">
                {socialLinks.map(({ key, label, href, external }) => (
                  <li key={key}>
                    <a
                      href={href}
                      {...(external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="
                        group inline-flex items-center gap-3
                        font-body text-sm text-navy-300
                        hover:text-gold-400 transition-colors duration-200
                      "
                    >
                      <span className="
                        flex h-8 w-8 items-center justify-center rounded-md
                        bg-navy-800 border border-navy-700
                        group-hover:border-gold-500/40 group-hover:bg-navy-750
                        transition-colors duration-200
                      ">
                        <Icon name={key} className="h-4 w-4" />
                      </span>
                      <span>{label}</span>
                      {external && (
                        <svg
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                          aria-hidden="true" className="h-3 w-3 opacity-40 group-hover:opacity-70 transition-opacity"
                        >
                          <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-sm text-navy-600 italic">
                {/* Shown only when no social links are configured yet */}
                Add your links in content/site-config.json
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Decorative divider ────────────────────────────────────────────── */}
      <div className="container-main">
        <GoldRule />
      </div>

      {/* ── Bottom bar: copyright + last updated ──────────────────────────── */}
      <div className="container-main py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="font-body text-xs text-navy-500 text-center sm:text-left">
            &copy; {year}{' '}
            <span className="text-navy-400">
              {owner.name.full !== 'Your Full Name' ? owner.name.full : dict.nav.site_name}
            </span>
            {'. '}
            {dict.footer.rights}
          </p>

          {/* Last updated + back to top */}
          <div className="flex items-center gap-5">
            <p className="font-body text-xs text-navy-600">
              <span className="text-navy-500">{dict.footer.last_updated}:</span>{' '}
              <time dateTime={new Date().toISOString().split('T')[0]}>
                {lastUpdated}
              </time>
            </p>
            <BackToTop label={dict.footer.back_to_top} />
          </div>

        </div>
      </div>

    </footer>
  );
}
