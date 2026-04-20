'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { type Locale, locales } from '@/lib/i18n';

type Dict = {
  nav: {
    home: string;
    about: string;
    research: string;
    publications: string;
    teaching: string;
    contact: string;
  };
};

export default function Header({ lang, dict }: { lang: Locale; dict: Dict }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}`,              label: dict.nav.home },
    { href: `/${lang}/about`,        label: dict.nav.about },
    { href: `/${lang}/research`,     label: dict.nav.research },
    { href: `/${lang}/publications`, label: dict.nav.publications },
    { href: `/${lang}/teaching`,     label: dict.nav.teaching },
    { href: `/${lang}/contact`,      label: dict.nav.contact },
  ];

  function switchLangHref(targetLang: Locale) {
    const segments = pathname.split('/');
    segments[1] = targetLang;
    return segments.join('/') || `/${targetLang}`;
  }

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warm-200 shadow-card">
      <div className="container-main flex items-center justify-between h-16">

        {/* Logo / site name */}
        <Link
          href={`/${lang}`}
          className="font-display text-lg font-semibold text-navy-700 hover:text-gold-600 transition-colors duration-200"
        >
          Academic Website
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`
                relative px-3.5 py-2 font-body text-sm rounded-md transition-colors duration-200
                ${isActive(href)
                  ? 'text-navy-700 font-semibold'
                  : 'text-slate-600 hover:text-navy-700 hover:bg-warm-100'}
              `}
            >
              {label}
              {isActive(href) && (
                <span className="absolute bottom-1 left-3.5 right-3.5 h-px bg-gold-400 rounded-full" />
              )}
            </Link>
          ))}

          {/* Language switcher */}
          <div className="ml-5 flex items-center gap-1 border-l border-warm-200 pl-5">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLangHref(l)}
                className={`
                  px-2.5 py-1 font-body text-xs font-semibold rounded uppercase tracking-widest
                  transition-all duration-200
                  ${l === lang
                    ? 'bg-navy-700 text-white'
                    : 'text-slate-500 hover:text-navy-700 hover:bg-warm-100'}
                `}
              >
                {l}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-md text-slate-600 hover:bg-warm-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-warm-200 bg-white px-4 py-3 space-y-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`
                block px-4 py-2.5 rounded-lg font-body text-sm transition-colors duration-150
                ${isActive(href)
                  ? 'bg-warm-100 text-navy-700 font-semibold'
                  : 'text-slate-600 hover:bg-warm-50 hover:text-navy-700'}
              `}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-2 px-4 pt-3 pb-1 border-t border-warm-100 mt-2">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLangHref(l)}
                className={`
                  px-3 py-1 font-body text-xs font-semibold rounded uppercase tracking-widest transition-colors
                  ${l === lang ? 'bg-navy-700 text-white' : 'text-slate-500 hover:bg-warm-100 hover:text-navy-700'}
                `}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
