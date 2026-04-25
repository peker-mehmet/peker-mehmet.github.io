'use client';

import { useState, useMemo } from 'react';
import { type Locale } from '@/lib/i18n';
import Badge from '@/components/ui/Badge';

// ── Dict type ─────────────────────────────────────────────────────────────────

export type NewsDict = {
  title: string;
  eyebrow: string;
  all: string;
  cat_award: string;
  cat_publication: string;
  cat_conference: string;
  cat_grant: string;
  cat_media: string;
  cat_teaching: string;
  cat_other: string;
  no_results: string;
  read_more: string;
  details: string;
  [key: string]: string;
};

// ── Data type ─────────────────────────────────────────────────────────────────

export type NewsItemFlat = {
  slug: string;
  title: string;
  title_tr: string;
  date: string;
  category: string;
  summary: string;
  summary_tr: string;
  link?: string;
  featured?: boolean;
  bodyHtml: string;
};

type Props = {
  items: NewsItemFlat[];
  lang: Locale;
  dict: NewsDict;
};

// ── Constants ─────────────────────────────────────────────────────────────────

type Category = 'award' | 'publication' | 'conference' | 'grant' | 'media' | 'teaching' | 'other';

const CATEGORY_ORDER: Category[] = [
  'award', 'publication', 'conference', 'grant', 'media', 'teaching', 'other',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const s = typeof dateStr === 'string' ? dateStr : String(dateStr).slice(0, 10);
  const parts = s.split('-').map(Number);
  const date = new Date(parts[0], (parts[1] ?? 1) - 1, parts[2] ?? 1);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={`w-3 h-3 ${className}`} aria-hidden="true">
      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
    </svg>
  );
}

// ── News item ─────────────────────────────────────────────────────────────────

function NewsCard({
  item,
  lang,
  dict,
  isExpanded,
  onToggle,
}: {
  item: NewsItemFlat;
  lang: Locale;
  dict: NewsDict;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const title   = lang === 'tr' ? (item.title_tr   || item.title)   : item.title;
  const summary = lang === 'tr' ? (item.summary_tr || item.summary) : item.summary;
  const cat     = item.category as Category;

  return (
    <div className="relative pl-10 pb-12 last:pb-0">

      {/* Timeline dot — larger + gold ring for featured items */}
      <div
        aria-hidden="true"
        className={`absolute top-[7px] left-0 rounded-full
          ${item.featured
            ? 'w-4 h-4 -ml-0.5 bg-gold-500 ring-2 ring-offset-2 ring-gold-300'
            : 'w-3 h-3 bg-gold-300 ring-1 ring-offset-1 ring-gold-200'}`}
      />

      {/* Date + category badge */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <time dateTime={item.date} className="font-body text-xs text-slate-400 tabular-nums">
          {formatDate(item.date)}
        </time>
        <Badge variant={cat} size="sm">
          {dict[`cat_${cat}`] ?? cat}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="font-display text-[1.125rem] font-semibold text-navy-800 leading-snug mb-2">
        {title}
      </h3>

      {/* Summary */}
      <p className="font-body text-sm text-slate-600 leading-relaxed mb-3">
        {summary}
      </p>

      {/* Expandable full body */}
      {item.bodyHtml && (
        <div className="mb-3">
          <button
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="inline-flex items-center gap-1 text-xs font-medium font-body text-navy-500 hover:text-navy-800 transition-colors"
          >
            <ChevronRight className={`transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`} />
            {dict.details}
          </button>

          {isExpanded && (
            <div
              className={`mt-3 text-sm leading-relaxed text-slate-600
                [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-navy-800 [&_h3]:mt-4 [&_h3]:mb-1.5
                [&_h4]:font-display [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-navy-700 [&_h4]:mt-3 [&_h4]:mb-1
                [&_p]:font-body [&_p]:mb-3 [&_p:last-child]:mb-0
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
                [&_li]:font-body
                [&_strong]:font-semibold [&_strong]:text-slate-800
                [&_em]:italic
                [&_a]:text-navy-600 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-navy-200 [&_a:hover]:text-navy-800`}
              dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
            />
          )}
        </div>
      )}

      {/* External link */}
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium font-body text-navy-600 hover:text-navy-800 transition-colors group"
        >
          {dict.read_more}
          <span className="transition-transform duration-150 group-hover:translate-x-0.5 inline-flex">
            <ArrowRight />
          </span>
        </a>
      )}
    </div>
  );
}

// ── Filter button ─────────────────────────────────────────────────────────────

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-body font-medium border transition-colors
        ${active
          ? 'bg-navy-700 text-white border-navy-700 shadow-sm'
          : 'bg-white text-slate-600 border-warm-300 hover:border-navy-300 hover:text-navy-700 shadow-card'}`}
    >
      {label}
      <span
        className={`inline-flex items-center justify-center min-w-[1.25rem] px-1 py-0.5 rounded text-[10px] font-semibold leading-none
          ${active ? 'bg-white/20 text-white' : 'bg-warm-100 text-slate-500'}`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NewsClient({ items, lang, dict }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expanded, setExpanded]         = useState<Set<string>>(new Set());

  // Count items per category
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const item of items) {
      c[item.category] = (c[item.category] ?? 0) + 1;
    }
    return c;
  }, [items]);

  // Only show filter buttons for categories that have at least one item
  const presentCategories = CATEGORY_ORDER.filter(cat => (counts[cat] ?? 0) > 0);

  // Filtered item list
  const filtered = useMemo(
    () => (activeFilter === 'all' ? items : items.filter(i => i.category === activeFilter)),
    [items, activeFilter],
  );

  const toggle = (slug: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <div className="container-main py-10 lg:py-14">

      {/* ── Category filter row ───────────────────────────── */}
      {presentCategories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by category">
          <FilterButton
            label={dict.all}
            count={counts.all}
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          />
          {presentCategories.map(cat => (
            <FilterButton
              key={cat}
              label={dict[`cat_${cat}`] ?? cat}
              count={counts[cat] ?? 0}
              active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
            />
          ))}
        </div>
      )}

      {/* ── Timeline or empty state ───────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-warm-100 border border-warm-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-slate-400" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="font-body text-sm text-slate-400 italic">{dict.no_results}</p>
          <button
            onClick={() => setActiveFilter('all')}
            className="text-xs font-medium font-body text-navy-500 hover:text-navy-800 underline underline-offset-2 transition-colors"
          >
            {dict.all}
          </button>
        </div>
      ) : (
        <div className="relative max-w-2xl">

          {/* Vertical gold line */}
          <div
            aria-hidden="true"
            className="absolute left-[5px] top-2 bottom-4 w-0.5 bg-gradient-to-b from-gold-300 via-gold-200 to-transparent"
          />

          {filtered.map(item => (
            <NewsCard
              key={item.slug}
              item={item}
              lang={lang}
              dict={dict}
              isExpanded={expanded.has(item.slug)}
              onToggle={() => toggle(item.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
