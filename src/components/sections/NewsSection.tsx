import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { type NewsItem } from '@/lib/content';
import SectionTitle from '@/components/ui/SectionTitle';
import { CategoryBadge } from '@/components/ui/Badge';

// ── Types ─────────────────────────────────────────────────────────────────────

type NewsSectionDict = {
  home: {
    latest_news_title: string;
    see_all_news: string;
    no_news: string;
    read_more: string;
  };
};

type NewsSectionProps = {
  lang: Locale;
  news: NewsItem[];
  dict: NewsSectionDict;
};

// ── Date formatter ────────────────────────────────────────────────────────────

function formatDate(dateStr: string, lang: Locale): string {
  try {
    return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ── Single news row ───────────────────────────────────────────────────────────

function NewsRow({
  item,
  lang,
  dict,
  isLast,
}: {
  item: NewsItem;
  lang: Locale;
  dict: NewsSectionDict['home'];
  isLast: boolean;
}) {
  const title   = lang === 'tr' ? (item.title_tr || item.title) : item.title;
  const summary = lang === 'tr' ? (item.summary_tr || item.summary) : item.summary;
  const href    = item.link || `/${lang}/news#${item.slug}`;
  const isExternal = Boolean(item.link);

  return (
    <article
      className={`
        group grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 py-6
        ${!isLast ? 'border-b border-warm-200' : ''}
      `}
    >
      {/* Left: date + category */}
      <div className="flex sm:flex-col items-start gap-2.5 sm:gap-2 flex-shrink-0">
        <time
          dateTime={item.date}
          className="font-body text-xs text-slate-400 tabular-nums whitespace-nowrap"
        >
          {formatDate(item.date, lang)}
        </time>
        <CategoryBadge category={item.category} />
      </div>

      {/* Right: title + summary + link */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy-700 leading-snug mb-1.5
                       group-hover:text-navy-600 transition-colors duration-200">
          {title}
        </h3>
        <p className="font-body text-sm text-slate-500 leading-relaxed mb-3">
          {summary}
        </p>
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="inline-flex items-center gap-1.5 font-body text-xs font-semibold
                     text-navy-600 hover:text-gold-600 transition-colors duration-200"
          aria-label={`${dict.read_more}: ${title}`}
        >
          {dict.read_more}
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}

// ── NewsSection ───────────────────────────────────────────────────────────────

export default function NewsSection({ lang, news, dict }: NewsSectionProps) {
  const itemsToShow = news.slice(0, 3);

  return (
    <section className="bg-white border-y border-warm-200" aria-labelledby="news-heading">
      <div className="container-main section">

        {/* Header row */}
        <div className="flex items-end justify-between mb-2">
          <SectionTitle id="news-heading" as="h2" accent className="mb-0">
            {dict.home.latest_news_title}
          </SectionTitle>

          <Link
            href={`/${lang}/news`}
            className="flex-shrink-0 inline-flex items-center gap-1.5 mb-10
                       font-body text-sm text-slate-500 hover:text-navy-700
                       transition-colors duration-200 group"
          >
            {dict.home.see_all_news}
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* News list */}
        {itemsToShow.length > 0 ? (
          <div className="rounded-xl bg-white border border-warm-200 shadow-card overflow-hidden">
            <div className="divide-y divide-warm-100 px-6 sm:px-8">
              {itemsToShow.map((item, i) => (
                <NewsRow
                  key={item.slug}
                  item={item}
                  lang={lang}
                  dict={dict.home}
                  isLast={i === itemsToShow.length - 1}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="font-body text-sm text-slate-400 italic py-8 text-center">
            {dict.home.no_news}
          </p>
        )}

      </div>
    </section>
  );
}
