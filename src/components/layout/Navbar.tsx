'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type Locale, locales } from '@/lib/i18n';

// ── Types ─────────────────────────────────────────────────────────────────────

type NavDict = {
  site_name: string;
  home: string;
  about: string;
  research: string;
  publications: string;
  scales: string;
  news: string;
  teaching: string;
  contact: string;
  open_menu: string;
  close_menu: string;
  switch_lang: string;
};

type NavbarProps = {
  lang: Locale;
  dict: NavDict;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLangHref(pathname: string, targetLang: Locale): string {
  const segments = pathname.split('/');
  segments[1] = targetLang;
  return segments.join('/') || `/${targetLang}`;
}

function safeLocalStorage(action: 'get' | 'set', key: string, value?: string) {
  try {
    if (action === 'get') return localStorage.getItem(key);
    if (value !== undefined) localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable (private browsing, SSR, etc.)
  }
  return null;
}

// ── NavLink ───────────────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        relative font-body text-sm tracking-wide transition-colors duration-200
        ${active
          ? 'text-navy-700 font-semibold'
          : 'text-slate-600 hover:text-navy-700'
        }
      `}
    >
      {label}
      {/* Gold underline — always rendered, animated in/out */}
      <span
        className={`
          absolute -bottom-0.5 left-0 h-px bg-gold-400
          transition-all duration-300 ease-out
          ${active ? 'w-full' : 'w-0 group-hover:w-full'}
        `}
      />
    </Link>
  );
}

// ── LangToggle ────────────────────────────────────────────────────────────────

function LangToggle({
  lang,
  targetLang,
  label,
  onSwitch,
}: {
  lang: Locale;
  targetLang: Locale;
  label: string;
  onSwitch: (l: Locale) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center rounded-full border border-warm-200 overflow-hidden bg-warm-50 p-0.5"
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onSwitch(l)}
          aria-pressed={lang === l}
          className={`
            relative px-3 py-1 font-body text-xs font-bold uppercase tracking-widest
            rounded-full transition-all duration-200 focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-1
            ${lang === l
              ? 'bg-navy-700 text-white shadow-sm'
              : 'text-slate-500 hover:text-navy-700'}
          `}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

// ── HamburgerButton ───────────────────────────────────────────────────────────

function HamburgerButton({
  open,
  label,
  onClick,
}: {
  open: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      className="
        relative flex h-9 w-9 flex-col items-center justify-center gap-1.5
        rounded-lg text-slate-600 transition-colors duration-200
        hover:bg-warm-100 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-gold-400
      "
    >
      <span
        className={`
          block h-0.5 w-5 rounded-full bg-current origin-center
          transition-all duration-300
          ${open ? 'translate-y-2 rotate-45' : ''}
        `}
      />
      <span
        className={`
          block h-0.5 w-5 rounded-full bg-current
          transition-all duration-300
          ${open ? 'opacity-0 scale-x-0' : ''}
        `}
      />
      <span
        className={`
          block h-0.5 w-5 rounded-full bg-current origin-center
          transition-all duration-300
          ${open ? '-translate-y-2 -rotate-45' : ''}
        `}
      />
    </button>
  );
}

// ── MobileDrawer ──────────────────────────────────────────────────────────────

function MobileDrawer({
  open,
  lang,
  navLinks,
  pathname,
  dict,
  onClose,
  onLangSwitch,
}: {
  open: boolean;
  lang: Locale;
  navLinks: { href: string; label: string }[];
  pathname: string;
  dict: NavDict;
  onClose: () => void;
  onLangSwitch: (l: Locale) => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus inside drawer when open
  useEffect(() => {
    if (!open) return;
    const el = drawerRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  function isActive(href: string) {
    return href === `/${lang}` ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-navy-900/40 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          fixed top-0 right-0 z-50 h-full w-72 sm:w-80
          flex flex-col bg-white shadow-card-lg
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-warm-200">
          <Link
            href={`/${lang}`}
            onClick={onClose}
            className="font-display text-base font-semibold text-navy-700 hover:text-gold-600 transition-colors"
          >
            {dict.site_name}
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.close_menu}
            className="
              flex h-8 w-8 items-center justify-center rounded-md
              text-slate-400 hover:text-navy-700 hover:bg-warm-100
              transition-colors duration-150 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-gold-400
            "
          >
            {/* X icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Gold rule accent */}
        <div className="h-px bg-gradient-to-r from-gold-400 via-gold-300 to-transparent" />

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm
                      transition-colors duration-150 focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400
                      ${active
                        ? 'bg-navy-50 text-navy-700 font-semibold'
                        : 'text-slate-600 hover:bg-warm-50 hover:text-navy-700'
                      }
                    `}
                  >
                    {/* Active indicator dot */}
                    <span
                      className={`
                        h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors
                        ${active ? 'bg-gold-400' : 'bg-transparent'}
                      `}
                    />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer footer — language toggle */}
        <div className="border-t border-warm-200 px-6 py-5 space-y-4">
          <p className="font-body text-label uppercase tracking-widest text-slate-400">
            Language / Dil
          </p>
          <div className="flex gap-2">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => { onLangSwitch(l); onClose(); }}
                aria-pressed={lang === l}
                className={`
                  flex-1 py-2.5 font-body text-sm font-bold uppercase tracking-widest
                  rounded-lg border transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
                  ${lang === l
                    ? 'bg-navy-700 text-white border-navy-700'
                    : 'bg-white text-slate-500 border-warm-200 hover:border-navy-300 hover:text-navy-700'
                  }
                `}
              >
                {l === 'en' ? 'English' : 'Türkçe'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Navbar (main export) ───────────────────────────────────────────────────────

export default function Navbar({ lang, dict }: NavbarProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  // ── Nav link definitions ─────────────────────────────────────────────────
  const navLinks = [
    { href: `/${lang}`,               label: dict.home },
    { href: `/${lang}/about`,         label: dict.about },
    { href: `/${lang}/research`,      label: dict.research },
    { href: `/${lang}/publications`,  label: dict.publications },
    { href: `/${lang}/scales`,        label: dict.scales },
    { href: `/${lang}/news`,          label: dict.news },
    { href: `/${lang}/contact`,       label: dict.contact },
  ];

  // ── Scroll shadow ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler(); // run once on mount
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── Close drawer on route change ──────────────────────────────────────────
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // ── Lock body scroll when drawer is open ──────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // ── Restore language preference from localStorage on first mount ──────────
  useEffect(() => {
    const stored = safeLocalStorage('get', 'preferred-lang') as Locale | null;
    if (stored && stored !== lang && locales.includes(stored)) {
      router.replace(getLangHref(pathname, stored));
    }
  // Run once only — intentional empty-ish dep array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Language switch ───────────────────────────────────────────────────────
  const handleLangSwitch = useCallback((targetLang: Locale) => {
    if (targetLang === lang) return;
    safeLocalStorage('set', 'preferred-lang', targetLang);
    router.push(getLangHref(pathname, targetLang));
  }, [lang, pathname, router]);

  // ── Active link check ─────────────────────────────────────────────────────
  function isActive(href: string) {
    return href === `/${lang}` ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      <header
        className={`
          sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm
          border-b border-warm-200
          transition-shadow duration-300
          ${scrolled ? 'shadow-card-md' : 'shadow-none'}
        `}
      >
        <div className="container-main">
          <div className="flex h-16 items-center justify-between gap-6">

            {/* ── Logo ─────────────────────────────────────────────────── */}
            <Link
              href={`/${lang}`}
              className="flex-shrink-0 group"
              aria-label={`${dict.site_name} — ${dict.home}`}
            >
              <span className="
                font-display text-lg font-semibold text-navy-700
                group-hover:text-gold-600 transition-colors duration-200
              ">
                {dict.site_name}
              </span>
            </Link>

            {/* ── Desktop nav ───────────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map(({ href, label }) => (
                <div key={href} className="group px-1">
                  <NavLink
                    href={href}
                    label={label}
                    active={isActive(href)}
                  />
                </div>
              ))}
            </nav>

            {/* ── Desktop right controls ────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <div className="w-px h-5 bg-warm-200" aria-hidden="true" />
              <LangToggle
                lang={lang}
                targetLang={lang === 'en' ? 'tr' : 'en'}
                label={dict.switch_lang}
                onSwitch={handleLangSwitch}
              />
            </div>

            {/* ── Mobile hamburger ──────────────────────────────────────── */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Compact lang toggle on mobile */}
              <div
                className="flex items-center rounded-full border border-warm-200 overflow-hidden bg-warm-50 p-0.5"
                role="group"
                aria-label={dict.switch_lang}
              >
                {locales.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleLangSwitch(l)}
                    aria-pressed={lang === l}
                    className={`
                      px-2.5 py-0.5 font-body text-xs font-bold uppercase tracking-widest
                      rounded-full transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
                      ${lang === l
                        ? 'bg-navy-700 text-white'
                        : 'text-slate-500 hover:text-navy-700'}
                    `}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <HamburgerButton
                open={drawerOpen}
                label={drawerOpen ? dict.close_menu : dict.open_menu}
                onClick={() => setDrawerOpen((v) => !v)}
              />
            </div>
          </div>
        </div>

        {/* Gold accent rule below header */}
        <div
          className={`
            h-px transition-opacity duration-300
            bg-gradient-to-r from-transparent via-gold-400/50 to-transparent
            ${scrolled ? 'opacity-100' : 'opacity-0'}
          `}
          aria-hidden="true"
        />
      </header>

      {/* ── Mobile drawer ──────────────────────────────────────────────── */}
      <MobileDrawer
        open={drawerOpen}
        lang={lang}
        navLinks={navLinks}
        pathname={pathname}
        dict={dict}
        onClose={() => setDrawerOpen(false)}
        onLangSwitch={handleLangSwitch}
      />
    </>
  );
}
