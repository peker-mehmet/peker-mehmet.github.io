import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { type Publication, type Scale } from '@/lib/content';
import SectionTitle from '@/components/ui/SectionTitle';
import Card, { CardBody, CardFooter } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import JournalBadge from '@/components/ui/JournalBadge';

// ── Types ─────────────────────────────────────────────────────────────────────

type HighlightsDict = {
  home: {
    highlights_title: string;
    recent_publications_title: string;
    featured_scales_title: string;
    see_all_publications: string;
    see_all_scales: string;
    no_publications: string;
    no_scales: string;
    published_in: string;
    items: string;
    subscales: string;
    available_in: string;
    alpha: string;
    download_form_and_guide: string;
    type_journal: string;
    type_conference: string;
    type_book: string;
    type_book_chapter: string;
    type_thesis: string;
    type_preprint: string;
    type_invited_talk: string;
    type_presentation: string;
  };
};

type HighlightsProps = {
  lang: Locale;
  publications: Publication[];
  scales: Scale[];
  dict: HighlightsDict;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return '';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(' & ');
  return `${authors[0]} et al.`;
}

function pubTypeLabel(type: Publication['type'], dict: HighlightsDict['home']): string {
  const map: Record<Publication['type'], string> = {
    journal:        dict.type_journal,
    conference:     dict.type_conference,
    book:           dict.type_book,
    'book-chapter': dict.type_book_chapter,
    thesis:         dict.type_thesis,
    preprint:       dict.type_preprint,
    'invited-talk': dict.type_invited_talk,
    presentation:   dict.type_presentation,
  };
  return map[type] ?? type;
}

function pubTypeVariant(type: Publication['type']): 'navy' | 'slate' | 'gold' | 'warm' {
  if (type === 'journal')    return 'navy';
  if (type === 'conference') return 'slate';
  if (type === 'book' || type === 'book-chapter') return 'gold';
  return 'warm';
}

// ── Publication card ──────────────────────────────────────────────────────────

function PublicationCard({
  pub,
  lang,
  dict,
}: {
  pub: Publication;
  lang: Locale;
  dict: HighlightsDict['home'];
}) {
  const venue = pub.journal || pub.conference || pub.publisher || '';
  const href  = pub.doi
    ? `https://doi.org/${pub.doi}`
    : pub.url || pub.pdf || '#';
  const isExternal = !pub.pdf || pub.doi || pub.url;

  return (
    <Card as="article" variant="default" padding="md" className="flex flex-col h-full group hover:-translate-y-1 hover:shadow-md transition-all duration-200">

      {/* Type badge + year */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge variant={pubTypeVariant(pub.type)} size="sm">
          {pubTypeLabel(pub.type, dict)}
        </Badge>
        <span className="font-body text-caption text-slate-400 tabular-nums">
          {pub.year}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-semibold text-navy-700 leading-snug mb-2
                     group-hover:text-navy-600 transition-colors">
        {pub.title[lang] || pub.title.en}
      </h3>

      {/* Journal badge */}
      {pub.journal && (
        <div className="mb-2">
          <JournalBadge journal={pub.journal} />
        </div>
      )}

      <CardBody className="flex-1 space-y-1.5">
        {/* Authors */}
        <p className="text-slate-500 text-xs">
          {formatAuthors(pub.authors)}
        </p>
        {/* Venue */}
        {venue && (
          <p className="text-slate-500 text-xs italic">
            <span className="not-italic text-slate-400">{dict.published_in} </span>
            {venue}
            {pub.volume && `, ${pub.volume}`}
            {pub.issue  && `(${pub.issue})`}
            {pub.pages  && `, ${pub.pages}`}
          </p>
        )}
      </CardBody>

      {/* Tags */}
      {pub.tags && pub.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {pub.tags.slice(0, 3).map((t) => (
            <span key={t} className="font-body text-[0.7rem] px-2 py-0.5 rounded-full
                                     bg-warm-100 text-slate-500 border border-warm-200">
              {t}
            </span>
          ))}
        </div>
      )}

      <CardFooter>
        {href !== '#' && (
          <a
            href={href}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center gap-1.5 font-body text-xs font-semibold
                       text-navy-600 hover:text-gold-600 transition-colors duration-200"
          >
            {pub.doi ? 'DOI' : pub.url ? 'Link' : 'PDF'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
              strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
              <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        )}
        {pub.pdf && (
          <a
            href={pub.pdf}
            className="inline-flex items-center gap-1.5 font-body text-xs font-semibold
                       text-slate-500 hover:text-navy-700 transition-colors duration-200"
          >
            PDF
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
              strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}

// ── Scale card ────────────────────────────────────────────────────────────────

function ScaleCard({
  scale,
  lang,
  dict,
}: {
  scale: Scale;
  lang: Locale;
  dict: HighlightsDict['home'];
}) {
  const alpha = scale.reliability?.en || scale.reliability?.tr;
  const hasDocument = Boolean(scale.document);

  return (
    <Card as="article" variant="default" padding="md" className="flex flex-col h-full group hover:-translate-y-1 hover:shadow-md transition-all duration-200">

      {/* Name + abbreviation */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-navy-700 leading-snug
                         group-hover:text-navy-600 transition-colors">
            {scale.name[lang] || scale.name.en}
          </h3>
        </div>
        {scale.abbreviation && (
          <span className="flex-shrink-0 font-body text-xs font-bold tracking-widest
                           text-gold-700 bg-gold-50 border border-gold-200 rounded px-2 py-0.5">
            {scale.abbreviation}
          </span>
        )}
      </div>

      <CardBody className="flex-1">
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {scale.description[lang] || scale.description.en}
        </p>
      </CardBody>

      {/* Psychometric meta row */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-warm-100">
        {scale.item_count && (
          <MetaPill label={`${scale.item_count} ${dict.items}`} />
        )}
        {scale.subscales && scale.subscales.length > 0 && (
          <MetaPill label={`${scale.subscales.length} ${dict.subscales}`} />
        )}
      </div>

      <CardFooter>
        {hasDocument && (
          <a
            href={scale.document!}
            className="inline-flex items-center gap-1.5 font-body text-xs font-semibold
                       text-navy-600 hover:text-gold-600 transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
              strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {dict.download_form_and_guide}
          </a>
        )}
      </CardFooter>
    </Card>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <span className="font-body text-[0.7rem] text-slate-500 bg-warm-50 border border-warm-200
                     rounded-full px-2.5 py-0.5 leading-none whitespace-nowrap">
      {label}
    </span>
  );
}

// ── Section heading with "See all" link ───────────────────────────────────────

function SubSectionHeader({
  title,
  href,
  linkLabel,
  lang,
}: {
  title: string;
  href: string;
  linkLabel: string;
  lang: Locale;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-display text-2xl font-semibold text-navy-700">
        {title}
      </h3>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 font-body text-sm text-slate-500
                   hover:text-navy-700 transition-colors duration-200 group"
      >
        {linkLabel}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
          strokeLinecap="round" strokeLinejoin="round"
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true">
          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}

// ── Highlights section ────────────────────────────────────────────────────────

export default function Highlights({ lang, publications, scales, dict }: HighlightsProps) {
  // Featured first, then most-recent; take top 3
  const featuredPubs = publications.filter((p) => p.featured);
  const restPubs     = publications.filter((p) => !p.featured);
  const pubsToShow   = [...featuredPubs, ...restPubs].slice(0, 3);

  const featuredScales = scales.filter((s) => s.featured);
  const restScales     = scales.filter((s) => !s.featured);
  const scalesToShow   = [...featuredScales, ...restScales].slice(0, 3);

  const hasPubs   = pubsToShow.length > 0;
  const hasScales = scalesToShow.length > 0;

  if (!hasPubs && !hasScales) return null;

  return (
    <section className="bg-warm-50" aria-labelledby="highlights-heading">
      <div className="container-main section">

        <SectionTitle id="highlights-heading" as="h2" accent>
          {dict.home.highlights_title}
        </SectionTitle>

        {/* Publications sub-section */}
        {hasPubs && (
          <div className="mb-14">
            <SubSectionHeader
              title={dict.home.recent_publications_title}
              href={`/${lang}/publications`}
              linkLabel={dict.home.see_all_publications}
              lang={lang}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pubsToShow.map((pub) => (
                <PublicationCard key={pub.id} pub={pub} lang={lang} dict={dict.home} />
              ))}
            </div>
          </div>
        )}

        {/* Scales sub-section */}
        {hasScales && (
          <div>
            <SubSectionHeader
              title={dict.home.featured_scales_title}
              href={`/${lang}/scales`}
              linkLabel={dict.home.see_all_scales}
              lang={lang}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {scalesToShow.map((scale) => (
                <ScaleCard key={scale.id} scale={scale} lang={lang} dict={dict.home} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
