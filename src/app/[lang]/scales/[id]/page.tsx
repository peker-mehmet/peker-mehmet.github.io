import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getScales, type Scale } from '@/lib/content';
import { PageTitle } from '@/components/ui/SectionTitle';
import SectionTitle from '@/components/ui/SectionTitle';
import CopyCitationButton from '@/components/ui/CopyCitationButton';

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getScales().map((s) => ({ id: s.id }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale; id: string };
}): Promise<Metadata> {
  const scale = getScales().find((s) => s.id === params.id);
  if (!scale) return {};
  const dict = await getDictionary(params.lang);
  return {
    title: scale.name[params.lang] || scale.name.en,
    description: scale.description[params.lang] || scale.description.en,
  };
}

// ── Helper components ─────────────────────────────────────────────────────────

const ROLE_STYLE: Record<string, string> = {
  developed:  'bg-navy-700 text-white',
  translated: 'bg-gold-100 text-gold-700 border border-gold-200',
  adapted:    'bg-slate-100 text-slate-600 border border-slate-200',
};

function RoleBadge({ role, dict }: { role: string; dict: Record<string, string> }) {
  const label =
    role === 'developed'  ? dict.role_developed  :
    role === 'translated' ? dict.role_translated :
    role === 'adapted'    ? dict.role_adapted    : role;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold font-body uppercase tracking-wider ${ROLE_STYLE[role] ?? 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-3 border-b border-warm-100 last:border-0">
      <dt className="flex-shrink-0 w-44 font-body text-xs font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
        {label}
      </dt>
      <dd className="font-body text-sm text-slate-700 leading-relaxed">{value}</dd>
    </div>
  );
}

function AlphaBadge({ value }: { value: number }) {
  const color =
    value >= 0.9 ? 'bg-green-50 text-green-700 border-green-200' :
    value >= 0.8 ? 'bg-blue-50 text-blue-700 border-blue-200'   :
    value >= 0.7 ? 'bg-gold-50 text-gold-700 border-gold-200'   :
                   'bg-red-50 text-red-700 border-red-200';
  return (
    <span className={`inline-block px-2 py-0.5 rounded border text-xs font-mono font-semibold ${color}`}>
      α = {value.toFixed(2)}
    </span>
  );
}

function DownloadCard({
  href,
  label,
  btnLabel,
}: {
  href: string;
  label: string;
  btnLabel: string;
}) {
  if (!href) return null;
  return (
    <div className="flex items-center justify-between gap-3 p-3.5 bg-warm-50 rounded-lg border border-warm-200">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-navy-600" aria-hidden="true">
            <path d="M9.293 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4.707A1 1 0 0013.707 4L10 .293A1 1 0 009.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 01-1-1z" />
          </svg>
        </div>
        <span className="font-body text-sm font-medium text-navy-700">{label}</span>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-navy-700 text-white text-xs font-semibold font-body
                   hover:bg-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
          <path d="M.5 9.9a.5.5 0 01.5.5v2.5a1 1 0 001 1h12a1 1 0 001-1v-2.5a.5.5 0 011 0v2.5a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.5a.5.5 0 01.5-.5z" />
          <path d="M7.646 11.854a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V1.5a.5.5 0 00-1 0v8.793L5.354 8.146a.5.5 0 10-.708.708l3 3z" />
        </svg>
        {btnLabel}
      </a>
    </div>
  );
}

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-body
                 bg-navy-50 text-navy-600 border border-navy-200
                 hover:bg-navy-700 hover:text-gold-300 hover:border-navy-700
                 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
        <path d="M6.354 5.5H4a3 3 0 000 6h3a3 3 0 002.83-4H9c-.086 0-.17.01-.25.031A2 2 0 017 10H4a2 2 0 110-4h1.535c.218-.376.495-.714.82-1z" />
        <path d="M9 5a3 3 0 00-2.83 4h.714A2 2 0 019 6h3a2 2 0 110 4h-1.535a3.954 3.954 0 01-.82 1H12a3 3 0 100-6H9z" />
      </svg>
      {label}
    </a>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ScaleDetailPage({
  params,
}: {
  params: { lang: Locale; id: string };
}) {
  const lang = params.lang;
  const scale = getScales().find((s) => s.id === params.id);
  if (!scale) notFound();

  const dict = await getDictionary(lang);
  const d = (dict as any).scales as Record<string, string>;

  const name        = scale.name[lang] || scale.name.en;
  const description = scale.description[lang] || scale.description.en;
  const construct   = scale.construct?.[lang] || scale.construct?.en || '';
  const validity    = scale.validity_notes?.[lang] || scale.validity_notes?.en || '';
  const citation    = scale.citation[lang] || scale.citation.en;

  const hasSubscales = (scale.subscales?.length ?? 0) > 0;
  const hasPsychometrics =
    scale.reliability?.cronbach_alpha_total !== undefined ||
    scale.reliability?.test_retest;

  // Merge scale_form and scoring_guide into one download card
  const primaryFormHref = scale.downloads?.scale_form || scale.downloads?.scoring_guide || '';
  const formCardLabel = scale.downloads?.scoring_guide
    ? d.download_form_and_scoring
    : d.download_form;

  const hasDownloads = Boolean(primaryFormHref || scale.downloads?.manual);

  // Original citation (for translated/adapted scales)
  const originalCitation =
    scale.original_citation?.[lang] || scale.original_citation?.en || '';
  const showOriginalCitation =
    (scale.role === 'translated' || scale.role === 'adapted') && Boolean(originalCitation);

  // Extract DOI from citation string for the pill
  const doiMatch = citation.match(/https?:\/\/doi\.org\/[^\s]+/);
  const doiUrl = doiMatch ? doiMatch[0] : null;

  return (
    <>
      {/* ── Page header ─────────────────────────────────────────── */}
      <PageTitle
        eyebrow={scale.abbreviation ? `${scale.abbreviation} · ${construct}` : construct}
      >
        {name}
      </PageTitle>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="container-main py-10 lg:py-14">
        {/* Back link */}
        <Link
          href={`/${lang}/scales`}
          className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-slate-500 hover:text-navy-700 transition-colors mb-10"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path fillRule="evenodd" d="M15 8a.5.5 0 00-.5-.5H2.707l3.147-3.146a.5.5 0 10-.708-.708l-4 4a.5.5 0 000 .708l4 4a.5.5 0 00.708-.708L2.707 8.5H14.5A.5.5 0 0015 8z" clipRule="evenodd" />
          </svg>
          {d.back}
        </Link>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {scale.role && <RoleBadge role={scale.role} dict={d} />}
          {scale.abbreviation && (
            <span className="inline-block px-3 py-1 bg-gold-50 text-gold-700 border border-gold-200 rounded-full text-sm font-bold font-mono tracking-wider">
              {scale.abbreviation}
            </span>
          )}
          {scale.languages_available.map((lc) => (
            <span key={lc} className="inline-block px-2.5 py-1 bg-navy-50 text-navy-600 border border-navy-100 rounded-full text-xs font-bold font-body tracking-wider">
              {lc.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">

          {/* ── Left: detail content (col 1-7) ────────────────────── */}
          <div className="lg:col-span-7 space-y-10">

            {/* Core facts */}
            <section>
              <SectionTitle as="h2" eyebrow={d.detail_eyebrow_overview} accent>
                {name}
              </SectionTitle>
              <p className="font-body text-body-lg text-slate-700 leading-relaxed mb-6">{description}</p>

              <dl>
                <DetailRow label={d.detail_construct}  value={construct} />
                <DetailRow label={d.detail_population} value={scale.target_population} />
                <DetailRow label={d.detail_response}   value={scale.response_format} />
                {scale.year && (
                  <DetailRow label={d.detail_year} value={String(scale.year)} />
                )}
                {scale.adaptation_year && (
                  <DetailRow label={d.detail_adaptation_year} value={String(scale.adaptation_year)} />
                )}
                {scale.original_authors && scale.original_authors.length > 0 && (
                  <DetailRow
                    label={d.detail_authors}
                    value={scale.original_authors.join(', ')}
                  />
                )}
              </dl>
            </section>

            {/* Subscales */}
            {hasSubscales && (
              <section>
                <SectionTitle as="h2" eyebrow={d.detail_eyebrow_structure} accent>
                  {d.detail_subscales}
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scale.subscales!.map((sub) => {
                    const alpha = scale.reliability?.cronbach_alpha_subscales?.[sub.name];
                    const desc  = sub.description?.[lang] || sub.description?.en || '';
                    return (
                      <div key={sub.name} className="relative bg-white rounded-xl border border-warm-200 shadow-card p-4 overflow-hidden">
                        {/* Gold left accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold-300" />
                        <div className="pl-2">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-display text-[0.95rem] font-semibold text-navy-700 leading-snug flex-1">
                              {sub.name}
                            </h3>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {sub.item_count !== undefined && (
                                <span className="inline-block px-2 py-0.5 bg-navy-50 text-navy-600 border border-navy-100 rounded text-[10px] font-bold font-body">
                                  {sub.item_count} {d.detail_subscale_items}
                                </span>
                              )}
                              {alpha !== undefined && <AlphaBadge value={alpha} />}
                            </div>
                          </div>
                          {desc && (
                            <p className="font-body text-xs text-slate-600 leading-relaxed">{desc}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Psychometrics */}
            {hasPsychometrics && (
              <section>
                <SectionTitle as="h2" eyebrow={d.detail_eyebrow_statistics} accent>
                  {d.detail_psychometrics}
                </SectionTitle>
                <div className="bg-white rounded-xl border border-warm-200 shadow-card overflow-hidden">
                  <div className="p-5 space-y-4">
                    {scale.reliability?.cronbach_alpha_total !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="font-body text-sm text-slate-600">{d.detail_alpha_total}</span>
                        <AlphaBadge value={scale.reliability.cronbach_alpha_total} />
                      </div>
                    )}
                    {scale.reliability?.cronbach_alpha_subscales &&
                      Object.keys(scale.reliability.cronbach_alpha_subscales).length > 0 && (
                        <div>
                          <p className="font-body text-sm text-slate-500 mb-3">{d.detail_alpha_subscales}</p>
                          <div className="space-y-2">
                            {Object.entries(scale.reliability.cronbach_alpha_subscales).map(([sub, alpha]) => (
                              <div key={sub} className="flex items-center justify-between gap-3">
                                <span className="font-body text-xs text-slate-600 flex-1">{sub}</span>
                                <AlphaBadge value={alpha} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    {scale.reliability?.test_retest && (
                      <div className="flex items-start justify-between gap-4 pt-3 border-t border-warm-100">
                        <span className="font-body text-sm text-slate-600">{d.detail_test_retest}</span>
                        <span className="font-mono text-xs text-slate-700 flex-shrink-0">{scale.reliability.test_retest}</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Validity notes */}
            {validity && (
              <section>
                <SectionTitle as="h2" eyebrow={d.detail_eyebrow_evidence} accent>
                  {d.detail_validity}
                </SectionTitle>
                <div className="surface-inset">
                  <p className="font-body text-sm text-slate-700 leading-relaxed">{validity}</p>
                </div>
              </section>
            )}
          </div>

          {/* ── Right: sticky panel (col 8-12) ─────────────────────── */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-5">

              {/* Downloads */}
              {hasDownloads && (
                <div className="bg-white rounded-xl border border-warm-200 shadow-card p-5">
                  <h2 className="font-display text-title font-semibold text-navy-700 mb-4">
                    {d.detail_downloads}
                  </h2>
                  <div className="space-y-2.5">
                    {primaryFormHref && (
                      <DownloadCard href={primaryFormHref} label={formCardLabel} btnLabel={d.download_btn} />
                    )}
                    {scale.downloads?.manual && (
                      <DownloadCard href={scale.downloads.manual} label={d.download_manual} btnLabel={d.download_btn} />
                    )}
                  </div>
                </div>
              )}

              {/* Citation */}
              <div className="bg-white rounded-xl border border-warm-200 shadow-card p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-display text-title font-semibold text-navy-700">
                    {d.detail_citation}
                  </h2>
                  <CopyCitationButton
                    text={citation}
                    copyLabel={d.copy_citation}
                    copiedLabel={d.copied}
                  />
                </div>
                <div className="bg-warm-50 rounded-lg border border-warm-200 p-3.5">
                  <p className="font-mono text-[0.7rem] text-slate-600 leading-relaxed select-all">
                    {citation}
                  </p>
                </div>

                {/* DOI pill */}
                {doiUrl && (
                  <div className="mt-3 pt-3 border-t border-warm-100">
                    <p className="font-body text-xs text-slate-400 mb-2">{d.detail_reference}</p>
                    <PillLink href={doiUrl} label={d.detail_doi_label} />
                  </div>
                )}
              </div>

              {/* Original scale citation — translated/adapted only */}
              {showOriginalCitation && (
                <div className="bg-white rounded-xl border border-warm-200 shadow-card p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="font-display text-title font-semibold text-navy-700">
                      {d.detail_citation_original}
                    </h2>
                    <CopyCitationButton
                      text={originalCitation}
                      copyLabel={d.copy_citation}
                      copiedLabel={d.copied}
                    />
                  </div>
                  <div className="bg-warm-50 rounded-lg border border-warm-200 p-3.5">
                    <p className="font-mono text-[0.7rem] text-slate-600 leading-relaxed select-all">
                      {originalCitation}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
