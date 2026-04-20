import { type Locale } from '@/lib/i18n';
import { type SiteConfig } from '@/lib/content';

type SocialBarDict = {
  home: { connect_title: string };
};

type SocialBarProps = {
  lang: Locale;
  config: SiteConfig;
  dict: SocialBarDict;
};

// ── Icon paths (Heroicons 2.0 Outline, 24×24) ─────────────────────────────────

const ICONS = {
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
  ],
  twitter: [
    'M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.615 11.615 0 006.29 1.84',
  ],
} satisfies Record<string, string[]>;

function SocialIcon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
    >
      {ICONS[name].map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

// ── SocialBar ─────────────────────────────────────────────────────────────────

export default function SocialBar({ lang, config, dict }: SocialBarProps) {
  const { links } = config;

  type SocialEntry = {
    key: keyof typeof ICONS;
    label: string;
    href: string;
    external: boolean;
  };

  const entries: SocialEntry[] = [
    { key: 'email',       label: 'Email',          href: links.email          ? `mailto:${links.email}` : '', external: false },
    { key: 'scholar',     label: 'Google Scholar', href: links.google_scholar,  external: true },
    { key: 'orcid',       label: 'ORCID',          href: links.orcid,           external: true },
    { key: 'researchgate',label: 'ResearchGate',   href: links.researchgate,    external: true },
    { key: 'linkedin',    label: 'LinkedIn',        href: links.linkedin,        external: true },
    { key: 'twitter',     label: 'Twitter / X',    href: links.twitter,         external: true },
  ].filter((e): e is SocialEntry => Boolean(e.href));

  if (entries.length === 0) return null;

  return (
    <section
      className="bg-navy-900 border-t border-navy-800"
      aria-label={dict.home.connect_title}
    >
      <div className="container-main py-8">

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          {/* Label */}
          <span className="font-body text-label uppercase tracking-widest text-navy-500 font-semibold flex-shrink-0">
            {dict.home.connect_title}
          </span>

          {/* Divider (desktop only) */}
          <div className="hidden sm:block h-5 w-px bg-navy-700" aria-hidden="true" />

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            {entries.map(({ key, label, href, external }) => (
              <a
                key={key}
                href={href}
                aria-label={label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="
                  group flex items-center gap-2.5 px-4 py-2 rounded-lg
                  text-navy-400 border border-transparent
                  hover:text-white hover:bg-navy-800 hover:border-navy-700
                  transition-all duration-200
                "
              >
                <SocialIcon name={key} />
                <span className="font-body text-sm font-medium whitespace-nowrap">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
