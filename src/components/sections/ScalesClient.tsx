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
  no_results: string;
  clear_filters: string;
  view_details: string;
  items: string;
  factors: string;
  role_developed: string;
  role_translated: string;
  role_adapted: string;
  section_developed: string;
  section_adapted: string;
  section_translated: string;
  scales_unit: string;
  tab_adapted: string;
  tab_adapted_desc: string;
  tab_translated: string;
  tab_translated_desc: string;
  tab_developed: string;
  tab_developed_desc: string;
  [key: string]: string;
};

type Tab = 'adapted' | 'translated' | 'developed';

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

// ── Scale card ────────────────────────────────────────────────────────────────

function ScaleCard({ scale, lang, dict }: { scale: Scale; lang: Locale; dict: ScalesDict }) {
  const name        = scale.name[lang] || scale.name.en;
  const construct   = scale.construct?.[lang] || scale.construct?.en || '';
  const desc        = scale.description[lang] || scale.description.en;
  const factorCount = scale.subscales?.length ?? 0;

  return (
    <article className="group relative flex flex-col bg-white rounded-xl border border-warm-200 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
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

        <h3 className="font-display text-[1.1rem] font-semibold text-navy-800 leading-snug mb-1">{name}</h3>

        {construct && (
          <p className="font-body text-xs text-gold-700 font-semibold uppercase tracking-wider mb-3">{construct}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {scale.languages_available.map((lc) => (
            <span key={lc} className="inline-block px-2 py-0.5 bg-navy-50 text-navy-600 border border-navy-100 rounded text-[10px] font-bold font-body tracking-wider">
              {lc.toUpperCase()}
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

        <p className="font-body text-[0.8125rem] text-slate-600 leading-relaxed flex-1 line-clamp-3 mb-5">{desc}</p>

        <Link
          href={`/${lang}/scales/${scale.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium font-body text-navy-700 hover:text-gold-700 transition-colors group-hover:gap-2.5 self-start"
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
  const counts = useMemo(() => ({
    adapted:    scales.filter(s => s.role === 'adapted').length,
    translated: scales.filter(s => s.role === 'translated').length,
    developed:  scales.filter(s => s.role === 'developed').length,
  }), [scales]);

  // Default to the first non-empty tab in order: adapted → translated → developed
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    counts.adapted > 0 ? 'adapted' : counts.translated > 0 ? 'translated' : 'developed'
  );
  const [search, setSearch] = useState('');

  const TABS: { id: Tab; label: string; desc: string }[] = (
    [
      { id: 'adapted'    as Tab, label: dict.tab_adapted,    desc: dict.tab_adapted_desc },
      { id: 'translated' as Tab, label: dict.tab_translated, desc: dict.tab_translated_desc },
      { id: 'developed'  as Tab, label: dict.tab_developed,  desc: dict.tab_developed_desc },
    ] as { id: Tab; label: string; desc: string }[]
  ).filter(t => counts[t.id] > 0);

  const filtered = useMemo(() => {
    let res = scales.filter(s => s.role === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(s =>
        (s.name[lang] || s.name.en).toLowerCase().includes(q) ||
        (s.construct?.[lang] || s.construct?.en || '').toLowerCase().includes(q) ||
        (s.description[lang] || s.description.en).toLowerCase().includes(q)
      );
    }
    return res;
  }, [scales, activeTab, search, lang]);

  const activeTabDef = TABS.find(t => t.id === activeTab);

  return (
    <>
      {/* ── Intro banner ────────────────────────────────────────── */}
      <div className="bg-white border-b border-warm-200">
        <div className="container-main py-10 lg:py-12">
          <div className="max-w-3xl">
            <p className="font-body text-body-lg text-slate-600 leading-relaxed">{dict.intro}</p>
          </div>
        </div>
      </div>

      {/* ── Sticky tab bar ──────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-warm-50 border-b border-warm-200 shadow-sm">
        <div className="container-main py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            {/* Tab buttons */}
            <div className="flex flex-wrap gap-2 flex-1" role="tablist" aria-label={dict.title}>
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-medium
                      transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
                      ${isActive
                        ? 'bg-navy-700 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-warm-300 hover:border-navy-300 hover:text-navy-700'}
                    `}
                  >
                    {tab.label}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      isActive ? 'bg-white/20 text-white' : 'bg-warm-200 text-slate-500'
                    }`}>
                      {counts[tab.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative sm:w-64 lg:w-72 flex-shrink-0">
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
                className="w-full pl-9 pr-4 py-2 rounded-full border border-warm-300 bg-white
                           text-sm font-body text-slate-700 placeholder:text-slate-400
                           focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent shadow-card"
              />
            </div>

          </div>
        </div>
      </div>

      {/* ── Tab description ──────────────────────────────────────── */}
      {activeTabDef && (
        <div className="bg-white border-b border-warm-200">
          <div className="container-main py-5">
            <p className="font-body text-sm text-slate-500 leading-relaxed max-w-3xl">
              {activeTabDef.desc}
            </p>
          </div>
        </div>
      )}

      {/* ── Scale cards ──────────────────────────────────────────── */}
      <div className="container-main py-10 lg:py-14">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-slate-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="font-body text-slate-500 text-body-sm mb-3">{dict.no_results}</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-sm font-body text-gold-600 hover:text-gold-700 underline underline-offset-2"
              >
                {dict.clear_filters}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" role="tabpanel">
            {filtered.map(scale => (
              <ScaleCard key={scale.id} scale={scale} lang={lang} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
