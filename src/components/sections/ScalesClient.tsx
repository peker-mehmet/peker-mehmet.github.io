'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { type Scale } from '@/lib/content';

// ── Dict type ─────────────────────────────────────────────────────────────────

export type ScalesDict = {
  title: string;
  intro: string;
  search_placeholder: string;
  filter_language: string;
  filter_population: string;
  all_languages: string;
  all_populations: string;
  clear_filters: string;
  no_results: string;
  view_details: string;
  items: string;
  factors: string;
  role_developed: string;
  role_translated: string;
  role_adapted: string;
  lang_en: string;
  lang_tr: string;
  lang_de: string;
  lang_fr: string;
  lang_es: string;
  lang_ar: string;
  lang_zh: string;
  [key: string]: string;
};

type Props = {
  scales: Scale[];
  lang: Locale;
  dict: ScalesDict;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const ROLE_STYLE: Record<string, string> = {
  developed:  'bg-navy-700 text-white',
  translated: 'bg-gold-100 text-gold-700 border border-gold-200',
  adapted:    'bg-slate-100 text-slate-600 border border-slate-200',
};

function roleBadgeStyle(role: string) {
  return ROLE_STYLE[role] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
}

function roleLabel(role: string, dict: ScalesDict) {
  if (role === 'developed')  return dict.role_developed;
  if (role === 'translated') return dict.role_translated;
  if (role === 'adapted')    return dict.role_adapted;
  return role;
}

function langCode(code: string) {
  return code.toUpperCase();
}

// ── Scale card ────────────────────────────────────────────────────────────────

function ScaleCard({ scale, lang, dict }: { scale: Scale; lang: Locale; dict: ScalesDict }) {
  const name       = scale.name[lang] || scale.name.en;
  const construct  = scale.construct?.[lang] || scale.construct?.en || '';
  const desc       = scale.description[lang] || scale.description.en;
  const factorCount = scale.subscales?.length ?? 0;

  return (
    <article className="group relative flex flex-col bg-white rounded-xl border border-warm-200 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Top gold accent strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-400 to-gold-200" />

      <div className="pt-6 px-5 pb-5 flex flex-col flex-1">
        {/* Role + abbreviation row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {scale.role && (
            <span className={`inline-block px-2 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-wider ${roleBadgeStyle(scale.role)}`}>
              {roleLabel(scale.role, dict)}
            </span>
          )}
          {scale.abbreviation && (
            <span className="ml-auto flex-shrink-0 inline-block px-2.5 py-1 bg-gold-50 text-gold-700 border border-gold-200 rounded-md text-xs font-bold font-mono tracking-wider">
              {scale.abbreviation}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display text-[1.1rem] font-semibold text-navy-800 leading-snug mb-1">
          {name}
        </h3>

        {/* Construct label */}
        {construct && (
          <p className="font-body text-xs text-gold-700 font-semibold uppercase tracking-wider mb-3">
            {construct}
          </p>
        )}

        {/* Language + stats row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {scale.languages_available.map((lc) => (
            <span key={lc} className="inline-block px-2 py-0.5 bg-navy-50 text-navy-600 border border-navy-100 rounded text-[10px] font-bold font-body tracking-wider">
              {langCode(lc)}
            </span>
          ))}
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="font-body text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{scale.item_count}</span> {dict.items}
          </span>
          {factorCount > 0 && (
            <>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="font-body text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{factorCount}</span> {dict.factors}
              </span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="font-body text-[0.8125rem] text-slate-600 leading-relaxed flex-1 line-clamp-3 mb-5">
          {desc}
        </p>

        {/* View details link */}
        <Link
          href={`/${lang}/scales/${scale.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium font-body text-navy-700
                     hover:text-gold-700 transition-colors group-hover:gap-2.5 self-start"
        >
          {dict.view_details}
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

export default function ScalesClient({ scales, lang, dict }: Props) {
  const [search,     setSearch]     = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [popFilter,  setPopFilter]  = useState('');

  // Collect unique filter options
  const allLangs = useMemo(() => {
    const s = new Set<string>();
    for (const sc of scales) sc.languages_available.forEach(l => s.add(l));
    return Array.from(s).sort();
  }, [scales]);

  const allPops = useMemo(() => {
    const s = new Set<string>();
    for (const sc of scales) if (sc.target_population) s.add(sc.target_population);
    return Array.from(s).sort();
  }, [scales]);

  // Filtered scales
  const filtered = useMemo(() => {
    let res = scales;
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(s =>
        (s.name[lang] || s.name.en).toLowerCase().includes(q) ||
        (s.construct?.[lang] || s.construct?.en || '').toLowerCase().includes(q) ||
        (s.description[lang] || s.description.en).toLowerCase().includes(q)
      );
    }
    if (langFilter) res = res.filter(s => s.languages_available.includes(langFilter));
    if (popFilter)  res = res.filter(s => s.target_population === popFilter);
    return res;
  }, [scales, search, langFilter, popFilter, lang]);

  const hasFilters = Boolean(search.trim() || langFilter || popFilter);

  return (
    <>
      {/* ── Intro banner ────────────────────────────────────────── */}
      <div className="bg-white border-b border-warm-200">
        <div className="container-main py-10 lg:py-12">
          <div className="max-w-3xl">
            <p className="font-body text-body-lg text-slate-600 leading-relaxed">
              {dict.intro}
            </p>
          </div>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-warm-50 border-b border-warm-200 shadow-sm">
        <div className="container-main py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg viewBox="0 0 20 20" fill="currentColor"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={dict.search_placeholder}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-warm-300 bg-white
                           text-sm font-body text-slate-700 placeholder:text-slate-400
                           focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent shadow-card"
              />
            </div>

            {/* Language filter */}
            <div className="relative">
              <select
                value={langFilter}
                onChange={e => setLangFilter(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-warm-300 bg-white
                           text-sm font-body text-slate-700
                           focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent shadow-card cursor-pointer"
              >
                <option value="">{dict.all_languages}</option>
                {allLangs.map(lc => (
                  <option key={lc} value={lc}>
                    {dict[`lang_${lc}`] ?? lc.toUpperCase()}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 20 20" fill="currentColor"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Population filter */}
            {allPops.length > 1 && (
              <div className="relative">
                <select
                  value={popFilter}
                  onChange={e => setPopFilter(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-warm-300 bg-white
                             text-sm font-body text-slate-700
                             focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent shadow-card cursor-pointer"
                >
                  <option value="">{dict.all_populations}</option>
                  {allPops.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <svg viewBox="0 0 20 20" fill="currentColor"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setLangFilter(''); setPopFilter(''); }}
                className="px-4 py-2.5 rounded-lg border border-warm-300 bg-white text-sm font-body text-slate-600
                           hover:border-navy-300 hover:text-navy-700 transition-colors shadow-card"
              >
                {dict.clear_filters}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Scales grid ─────────────────────────────────────────── */}
      <div className="container-main py-10 lg:py-14">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-slate-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="font-body text-slate-500 text-body-sm mb-3">{dict.no_results}</p>
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setLangFilter(''); setPopFilter(''); }}
                className="text-sm font-body text-gold-600 hover:text-gold-700 underline underline-offset-2"
              >
                {dict.clear_filters}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(scale => (
              <ScaleCard key={scale.id} scale={scale} lang={lang} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
