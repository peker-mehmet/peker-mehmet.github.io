'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { type Locale } from '@/lib/i18n';
import { type Publication } from '@/lib/content';
import { trackDownload } from '@/lib/analytics';

// ── Dict type ─────────────────────────────────────────────────────────────────

export type PubsDict = {
  title: string;
  all: string;
  journal: string;
  conference: string;
  book: string;
  theses: string;
  search_placeholder: string;
  all_years: string;
  clear_filters: string;
  featured: string;
  abstract: string;
  hide_abstract: string;
  citation: string;
  hide_citation: string;
  copy_citation: string;
  copied: string;
  doi: string;
  pdf: string;
  slides: string;
  no_results: string;
  total: string;
  across: string;
  types: string;
  type_journal: string;
  type_conference: string;
  type_book: string;
  type_book_chapter: string;
  type_thesis: string;
  type_preprint: string;
  items_count_singular: string;
  items_count_plural: string;
  interest_filter_label: string;
};

type Tab = 'all' | 'journal' | 'conference' | 'books' | 'theses';

type Props = {
  publications: Publication[];
  lang: Locale;
  ownerName: string;
  dict: PubsDict;
};

// ── APA citation builder ──────────────────────────────────────────────────────

function buildApa(pub: Publication, lang: Locale): string {
  const authors = pub.authors_abbreviated || pub.authors.join(', ');
  const title   = pub.title[lang] || pub.title.en;
  const doiStr  = pub.doi  ? ` https://doi.org/${pub.doi}` :
                  pub.url  ? ` ${pub.url}` : '';
  const vol     = pub.volume ? `, ${pub.volume}` : '';
  const iss     = pub.issue  ? `(${pub.issue})`  : '';
  const pp      = pub.pages  ? `, ${pub.pages}`  : '';

  switch (pub.type) {
    case 'journal':
      return `${authors} (${pub.year}). ${title}. ${pub.journal ?? ''}${vol}${iss}${pp}.${doiStr}`;
    case 'conference':
      return `${authors} (${pub.year}). ${title}. Paper presented at ${pub.conference ?? ''}${pub.pages ? `, p. ${pub.pages}` : ''}.`;
    case 'book':
      return `${authors} (${pub.year}). ${title}. ${pub.publisher ?? ''}.${doiStr}`;
    case 'book-chapter': {
      const eds   = pub.editors?.length ? `In ${pub.editors.join(', ')} (Eds.), ` : '';
      const pages = pub.pages ? ` (pp. ${pub.pages})` : '';
      return `${authors} (${pub.year}). ${title}. ${eds}${pub.book_title ?? ''}${pages}. ${pub.publisher ?? ''}.${doiStr}`;
    }
    default:
      return `${authors} (${pub.year}). ${title}.${doiStr}`;
  }
}

// ── Small SVG icons ───────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);
const IconChevronDown = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);
const IconChevronExpand = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
    <path d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" />
  </svg>
);
const IconChain = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0" aria-hidden="true">
    <path d="M6.354 5.5H4a3 3 0 000 6h3a3 3 0 002.83-4H9c-.086 0-.17.01-.25.031A2 2 0 017 10H4a2 2 0 110-4h1.535c.218-.376.495-.714.82-1z"/>
    <path d="M9 5a3 3 0 00-2.83 4h.714A2 2 0 019 6h3a2 2 0 110 4h-1.535a3.954 3.954 0 01-.82 1H12a3 3 0 100-6H9z"/>
  </svg>
);
const IconFile = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0" aria-hidden="true">
    <path d="M9.293 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4.707A1 1 0 0013.707 4L10 .293A1 1 0 009.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 01-1-1z"/>
  </svg>
);
const IconExternalLink = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 00-.5-.5H1.5A1.5 1.5 0 000 4.5v10A1.5 1.5 0 001.5 16h10a1.5 1.5 0 001.5-1.5V7.864a.5.5 0 00-1 0V14.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z"/>
    <path fillRule="evenodd" d="M16 .5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793L6.146 9.146a.5.5 0 10.708.708L15 1.707V5.5a.5.5 0 001 0v-5z"/>
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0" aria-hidden="true">
    <path d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0" aria-hidden="true">
    <path d="M12.736 3.97a.733.733 0 011.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 01-1.065.02L3.217 8.384a.757.757 0 010-1.06.733.733 0 011.047 0l3.052 3.093 5.4-6.425a.247.247 0 01.02-.022z"/>
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 flex-shrink-0" aria-hidden="true">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
  </svg>
);
const IconQuestion = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-slate-400" aria-hidden="true">
    <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

// ── Type badge ────────────────────────────────────────────────────────────────

const TYPE_STYLE: Record<string, string> = {
  journal:        'bg-navy-700 text-white',
  conference:     'bg-gold-100 text-gold-700 border border-gold-200',
  book:           'bg-slate-100 text-slate-600 border border-slate-200',
  'book-chapter': 'bg-slate-100 text-slate-600 border border-slate-200',
  thesis:         'bg-warm-100 text-slate-600 border border-warm-300',
  preprint:       'bg-warm-100 text-slate-600 border border-warm-300',
};

function TypeBadge({ type, dict }: { type: string; dict: PubsDict }) {
  const label =
    type === 'journal'      ? dict.type_journal      :
    type === 'conference'   ? dict.type_conference   :
    type === 'book'         ? dict.type_book         :
    type === 'book-chapter' ? dict.type_book_chapter :
    type === 'thesis'       ? dict.type_thesis       :
    type === 'preprint'     ? dict.type_preprint     : type;
  return (
    <span className={`inline-block px-2 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-wider flex-shrink-0 ${TYPE_STYLE[type] ?? 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  );
}

// ── Author list with owner highlighted ───────────────────────────────────────

function AuthorList({ authors, ownerLastName }: { authors: string[]; ownerLastName: string }) {
  return (
    <>
      {authors.map((author, i) => {
        const isOwner = ownerLastName.length > 0 &&
          author.toLowerCase().startsWith(ownerLastName.toLowerCase());
        return (
          <span key={i}>
            {i > 0 && <span className="text-slate-400">, </span>}
            {isOwner
              ? <span className="font-semibold text-navy-700">{author}</span>
              : <span>{author}</span>
            }
          </span>
        );
      })}
    </>
  );
}

// ── Unified author display (handles both array and abbreviated string) ────────

function AuthorDisplay({ pub, ownerLastName }: { pub: Publication; ownerLastName: string }) {
  if (pub.authors_abbreviated) {
    if (!ownerLastName) return <>{pub.authors_abbreviated}</>;
    const regex = new RegExp(`(${ownerLastName})`, 'i');
    const parts = pub.authors_abbreviated.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part)
            ? <span key={i} className="font-semibold text-navy-700">{part}</span>
            : <span key={i}>{part}</span>
        )}
      </>
    );
  }
  return <AuthorList authors={pub.authors} ownerLastName={ownerLastName} />;
}

// ── Pill link ─────────────────────────────────────────────────────────────────

function PillLink({
  href, label, icon, disabled = false, onClick,
}: {
  href: string; label: string; icon: React.ReactNode; disabled?: boolean; onClick?: () => void;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold font-body
                   bg-slate-50 text-slate-400 border border-slate-200
                   opacity-40 cursor-not-allowed select-none"
      >
        {icon}
        {label}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold font-body
                 bg-navy-50 text-navy-600 border border-navy-200
                 hover:bg-navy-700 hover:text-gold-300 hover:border-navy-700
                 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      {icon}
      {label}
    </a>
  );
}

// ── Publication pills row ─────────────────────────────────────────────────────

function PillRow({ pub, dict }: { pub: Publication; dict: PubsDict }) {
  const hasPdf = Boolean(pub.pdf);
  return (
    <div className="flex flex-wrap gap-1.5">
      {/* DOI and URL: only shown when present */}
      {pub.doi && (
        <PillLink href={`https://doi.org/${pub.doi}`} label={dict.doi} icon={<IconChain />} />
      )}
      {pub.url && !pub.doi && (
        <PillLink href={pub.url} label="Link" icon={<IconExternalLink />} />
      )}
      {/* PDF: always shown — disabled (grayed out) when link is missing */}
      <PillLink
        href={pub.pdf ?? ''}
        label={dict.pdf}
        icon={<IconFile />}
        disabled={!hasPdf}
        onClick={hasPdf ? () => {
          const fileName = (pub.pdf ?? '').split('/').pop() ?? 'unknown.pdf';
          trackDownload(fileName, 'pdf', window.location.pathname);
        } : undefined}
      />
    </div>
  );
}

// ── Featured card ─────────────────────────────────────────────────────────────

function FeaturedCard({
  pub, lang, ownerLastName, dict,
}: { pub: Publication; lang: Locale; ownerLastName: string; dict: PubsDict }) {
  const title    = pub.title[lang] || pub.title.en;
  const abstract = pub.abstract?.[lang] || pub.abstract?.en || '';
  const source   =
    pub.type === 'journal'      ? pub.journal :
    pub.type === 'conference'   ? pub.conference :
    pub.type === 'book-chapter' ? pub.book_title :
    pub.publisher ?? '';

  return (
    <article className="relative bg-white rounded-xl border border-warm-200 shadow-card-md overflow-hidden flex flex-col">
      {/* Thick gold left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-400" />

      <div className="pl-6 pr-5 pt-5 pb-5 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-semibold font-body uppercase tracking-wider bg-gold-100 text-gold-700 border border-gold-200">
            <IconStar />
            {dict.featured}
          </span>
          <TypeBadge type={pub.type} dict={dict} />
          <span className="ml-auto font-mono text-xs text-slate-400">{pub.year}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-[1.2rem] font-semibold text-navy-800 leading-snug mb-2">
          {title}
        </h3>

        {/* Authors */}
        <p className="font-body text-sm text-slate-600 mb-1.5">
          <AuthorDisplay pub={pub} ownerLastName={ownerLastName} />
        </p>

        {/* Source */}
        {source && (
          <p className="font-body text-sm text-slate-500 italic mb-3">{source}</p>
        )}

        {/* Abstract — shown inline for featured */}
        {abstract && (
          <p className="font-body text-[0.8125rem] text-slate-600 leading-relaxed mb-4 pl-3 border-l-2 border-gold-200 flex-1">
            {abstract}
          </p>
        )}

        {/* Pills */}
        <PillRow pub={pub} dict={dict} />
      </div>
    </article>
  );
}

// ── Publication card ──────────────────────────────────────────────────────────

function PublicationCard({
  pub, lang, ownerLastName,
  abstractOpen, citationOpen, copiedId,
  onToggleAbstract, onToggleCitation, onCopy,
  dict,
}: {
  pub: Publication;
  lang: Locale;
  ownerLastName: string;
  abstractOpen: boolean;
  citationOpen: boolean;
  copiedId: string | null;
  onToggleAbstract: (id: string) => void;
  onToggleCitation: (id: string) => void;
  onCopy: (pub: Publication) => void;
  dict: PubsDict;
}) {
  const title    = pub.title[lang] || pub.title.en;
  const abstract = pub.abstract?.[lang] || pub.abstract?.en || '';
  const citation = buildApa(pub, lang);

  const source =
    pub.type === 'journal'      ? pub.journal :
    pub.type === 'conference'   ? pub.conference :
    pub.type === 'book-chapter' ? pub.book_title :
    pub.publisher ?? '';

  const meta = [
    pub.volume && `Vol. ${pub.volume}`,
    pub.issue  && `No. ${pub.issue}`,
    pub.pages  && `pp. ${pub.pages}`,
  ].filter(Boolean).join(' · ');

  return (
    <article className="relative bg-white rounded-xl border border-warm-200 shadow-card hover:shadow-card-md transition-shadow duration-200 overflow-hidden">
      {/* Thin gold left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gold-400 to-gold-200" />

      <div className="pl-5 pr-5 pt-5 pb-0">
        {/* Type + year */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <TypeBadge type={pub.type} dict={dict} />
          <span className="font-mono text-xs text-slate-400 flex-shrink-0 mt-px">{pub.year}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-[1.075rem] font-semibold text-navy-800 leading-snug mb-2">
          {title}
        </h3>

        {/* Authors */}
        <p className="font-body text-[0.8125rem] text-slate-600 mb-1.5 leading-relaxed">
          <AuthorDisplay pub={pub} ownerLastName={ownerLastName} />
        </p>

        {/* Source */}
        {source && (
          <p className="font-body text-[0.8125rem] text-slate-500 italic mb-1">{source}</p>
        )}

        {/* Metadata */}
        {meta && (
          <p className="font-body text-xs text-slate-400 mb-3">{meta}</p>
        )}

        {/* Pills */}
        <div className="mb-3">
          <PillRow pub={pub} dict={dict} />
        </div>

        {/* Expand controls */}
        <div className="flex items-center gap-4 border-t border-warm-100 py-3">
          {abstract && (
            <button
              onClick={() => onToggleAbstract(pub.id)}
              className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-slate-500 hover:text-navy-700 transition-colors"
            >
              <IconChevronExpand open={abstractOpen} />
              {abstractOpen ? dict.hide_abstract : dict.abstract}
            </button>
          )}
          <button
            onClick={() => onToggleCitation(pub.id)}
            className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-slate-500 hover:text-navy-700 transition-colors"
          >
            <IconChevronExpand open={citationOpen} />
            {citationOpen ? dict.hide_citation : dict.citation}
          </button>
        </div>

        {/* Abstract panel */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${abstractOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
          {abstract && (
            <div className="pt-1 pb-5 border-t border-warm-100">
              <p className="font-body text-[0.875rem] text-slate-600 leading-relaxed">{abstract}</p>
            </div>
          )}
        </div>

        {/* Citation panel */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${citationOpen ? 'max-h-[280px]' : 'max-h-0'}`}>
          <div className="pt-1 pb-5 border-t border-warm-100">
            <div className="relative bg-warm-50 rounded-lg border border-warm-200 p-3.5">
              <p className="font-mono text-[0.7rem] text-slate-600 leading-relaxed pr-20 select-all">{citation}</p>
              <button
                onClick={() => onCopy(pub)}
                className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium font-body border transition-all duration-150
                  ${copiedId === pub.id
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-white text-navy-600 border-warm-300 hover:bg-navy-50 hover:border-navy-300'
                  }`}
              >
                {copiedId === pub.id ? <IconCheck /> : <IconCopy />}
                {copiedId === pub.id ? dict.copied : dict.copy_citation}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function PublicationsClient({ publications, lang, ownerName, dict }: Props) {
  const [activeTab,          setActiveTab]          = useState<Tab>('all');
  const [search,             setSearch]             = useState('');
  const [yearFilter,         setYearFilter]         = useState('');
  const [interestFilter,     setInterestFilter]     = useState('');
  const [expandedAbstracts,  setExpandedAbstracts]  = useState<Set<string>>(new Set());
  const [expandedCitations,  setExpandedCitations]  = useState<Set<string>>(new Set());
  const [copiedId,           setCopiedId]           = useState<string | null>(null);

  const ownerLastName = ownerName.split(' ').filter(Boolean).pop() ?? '';

  // Read ?interest= query param from URL on mount (compatible with static export)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const interest = params.get('interest');
    if (interest) setInterestFilter(interest);
  }, []);

  // ── Derived data ────────────────────────────────────────────────────────────

  const counts = useMemo(() => ({
    all:        publications.length,
    journal:    publications.filter(p => p.type === 'journal').length,
    conference: publications.filter(p => p.type === 'conference').length,
    books:      publications.filter(p => p.type === 'book' || p.type === 'book-chapter').length,
    theses:     publications.filter(p => p.type === 'thesis'  || p.type === 'preprint').length,
  }), [publications]);

  const uniqueTypeCount = useMemo(
    () => new Set(publications.map(p => p.type)).size,
    [publications]
  );

  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case 'journal':    return publications.filter(p => p.type === 'journal');
      case 'conference': return publications.filter(p => p.type === 'conference');
      case 'books':      return publications.filter(p => p.type === 'book' || p.type === 'book-chapter');
      case 'theses':     return publications.filter(p => p.type === 'thesis'  || p.type === 'preprint');
      default:           return publications;
    }
  }, [publications, activeTab]);

  const filtered = useMemo(() => {
    let res = tabFiltered;
    if (interestFilter) {
      res = res.filter(p => p.tags?.includes(interestFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(p =>
        (p.title[lang] || p.title.en).toLowerCase().includes(q) ||
        p.authors.some(a => a.toLowerCase().includes(q)) ||
        (p.authors_abbreviated ?? '').toLowerCase().includes(q) ||
        (p.journal     ?? '').toLowerCase().includes(q) ||
        (p.conference  ?? '').toLowerCase().includes(q)
      );
    }
    if (yearFilter) res = res.filter(p => String(p.year) === yearFilter);
    return res;
  }, [tabFiltered, search, yearFilter, interestFilter, lang]);

  const featured = useMemo(() => {
    if (activeTab !== 'all' || search.trim() || yearFilter || interestFilter) return [];
    return publications.filter(p => p.featured).slice(0, 3);
  }, [publications, activeTab, search, yearFilter, interestFilter]);

  const byYear = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const pub of filtered) {
      const arr = map.get(pub.year) ?? [];
      arr.push(pub);
      map.set(pub.year, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const years = useMemo(
    () => Array.from(new Set(publications.map(p => p.year))).sort((a, b) => b - a),
    [publications]
  );

  const hasFilters = Boolean(search.trim() || yearFilter || interestFilter);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleAbstract = useCallback((id: string) => {
    setExpandedAbstracts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleCitation = useCallback((id: string) => {
    setExpandedCitations(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const copyCitation = useCallback(async (pub: Publication) => {
    try {
      await navigator.clipboard.writeText(buildApa(pub, lang));
      setCopiedId(pub.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }, [lang]);

  // ── Tab definitions ─────────────────────────────────────────────────────────

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: 'all',        label: dict.all,        count: counts.all },
    { id: 'journal',    label: dict.journal,    count: counts.journal },
    { id: 'conference', label: dict.conference, count: counts.conference },
    { id: 'books',      label: dict.book,       count: counts.books },
    { id: 'theses',     label: dict.theses,     count: counts.theses },
  ].filter(t => t.id === 'all' || t.count > 0) as { id: Tab; label: string; count: number }[];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Sticky tab bar ─────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-white border-b border-warm-200 shadow-sm">
        <div className="container-main">
          {/* Stat line */}
          <p className="pt-3 pb-0.5 font-body text-xs text-slate-400">
            <span className="font-semibold text-navy-700">{publications.length}</span>{' '}
            {dict.total}{' · '}
            <span className="font-semibold text-navy-700">{uniqueTypeCount}</span>{' '}
            {dict.types}
          </p>

          {/* Tabs */}
          <nav
            className="flex overflow-x-auto scrollbar-none"
            role="tablist"
            aria-label="Publication types"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-body font-medium whitespace-nowrap
                  transition-colors duration-150 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-gold-400
                  ${activeTab === tab.id ? 'text-navy-700' : 'text-slate-500 hover:text-navy-600'}`}
              >
                {tab.label}
                <span
                  className={`inline-block px-1.5 py-[2px] rounded text-[10px] font-bold leading-none transition-colors
                    ${activeTab === tab.id ? 'bg-navy-700 text-white' : 'bg-warm-100 text-slate-500'}`}
                >
                  {tab.count}
                </span>
                {/* Active underline */}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-400 rounded-t-sm" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Search & filter bar ─────────────────────────────────── */}
      <div className="bg-warm-50 border-b border-warm-200">
        <div className="container-main py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <IconSearch />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={dict.search_placeholder}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-warm-300 bg-white
                           text-sm font-body text-slate-700 placeholder:text-slate-400
                           focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent
                           shadow-card"
              />
            </div>

            {/* Year filter */}
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-warm-300 bg-white
                           text-sm font-body text-slate-700
                           focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent
                           shadow-card cursor-pointer"
              >
                <option value="">{dict.all_years}</option>
                {years.map(y => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <IconChevronDown />
              </span>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setYearFilter(''); setInterestFilter(''); }}
                className="px-4 py-2.5 rounded-lg border border-warm-300 bg-white text-sm font-body text-slate-600
                           hover:border-navy-300 hover:text-navy-700 transition-colors shadow-card"
              >
                {dict.clear_filters}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Active interest filter chip ─────────────────────────── */}
      {interestFilter && (
        <div className="bg-gold-50 border-b border-gold-200">
          <div className="container-main py-3 flex items-center gap-3">
            <span className="font-body text-xs font-semibold text-gold-700 uppercase tracking-wider flex-shrink-0">
              {dict.interest_filter_label}
            </span>
            <span className="inline-flex items-center gap-2 pl-3 pr-2 py-1 rounded-full bg-navy-700 text-white font-body text-sm font-medium">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
              {interestFilter}
              <button
                onClick={() => setInterestFilter('')}
                aria-label="Remove interest filter"
                className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-2.5 h-2.5" aria-hidden="true">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </button>
            </span>
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="container-main py-10 lg:py-14">

        {/* Featured section — only on "all" tab with no active filters */}
        {featured.length > 0 && (
          <section className="mb-14" aria-label="Featured publications">
            <div className="flex items-center gap-4 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 border border-gold-200 rounded-full flex-shrink-0">
                <IconStar />
                <span className="text-[11px] font-bold font-body uppercase tracking-widest text-gold-700">
                  {dict.featured}
                </span>
              </div>
              <div className="flex-1 h-px bg-warm-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {featured.map(pub => (
                <FeaturedCard
                  key={pub.id}
                  pub={pub}
                  lang={lang}
                  ownerLastName={ownerLastName}
                  dict={dict}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {byYear.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mb-4">
              <IconQuestion />
            </div>
            <p className="font-body text-slate-500 text-body-sm">{dict.no_results}</p>
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setYearFilter(''); setInterestFilter(''); }}
                className="mt-3 text-sm font-body text-gold-600 hover:text-gold-700 underline underline-offset-2"
              >
                {dict.clear_filters}
              </button>
            )}
          </div>
        )}

        {/* Year-grouped list */}
        <div className="space-y-14">
          {byYear.map(([year, pubs]) => (
            <section key={year} aria-label={`Publications from ${year}`}>
              {/* Year heading */}
              <div className="flex items-center gap-5 mb-6">
                <h2 className="font-display text-5xl font-semibold text-navy-100 leading-none select-none flex-shrink-0 tabular-nums">
                  {year}
                </h2>
                <div className="flex-1 h-px bg-warm-200" />
                <span className="font-body text-xs text-slate-400 flex-shrink-0">
                  {pubs.length === 1
                    ? `1 ${dict.items_count_singular}`
                    : `${pubs.length} ${dict.items_count_plural}`}
                </span>
              </div>

              {/* Two-column card grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pubs.map((pub: Publication) => (
                  <PublicationCard
                    key={pub.id}
                    pub={pub}
                    lang={lang}
                    ownerLastName={ownerLastName}
                    abstractOpen={expandedAbstracts.has(pub.id)}
                    citationOpen={expandedCitations.has(pub.id)}
                    copiedId={copiedId}
                    onToggleAbstract={toggleAbstract}
                    onToggleCitation={toggleCitation}
                    onCopy={copyCitation}
                    dict={dict}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
