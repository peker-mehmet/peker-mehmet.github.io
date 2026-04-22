import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig, getCollaborations, type Collaboration } from '@/lib/content';
import { buildPageMetadata } from '@/lib/metadata';
import { PageTitle } from '@/components/ui/SectionTitle';

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const { lang } = params;
  const config = getSiteConfig();
  const title = lang === 'tr' ? 'İş Birlikleri' : 'Collaborations';
  const description = lang === 'tr'
    ? `${config.owner.name.full} tarafından yürütülen araştırma ortaklıkları ve iş birlikleri.`
    : `Research partnerships and collaborations by ${config.owner.name.full}.`;
  return buildPageMetadata({ lang, path: '/collaborations', title, description });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type CollabDict = Record<string, string>;

const TYPE_STYLE: Record<string, string> = {
  industry:   'bg-blue-50   text-blue-700   border border-blue-200',
  ngo:        'bg-green-50  text-green-700  border border-green-200',
  public:     'bg-navy-50   text-navy-700   border border-navy-200',
  university: 'bg-gold-50   text-gold-700   border border-gold-200',
  healthcare: 'bg-red-50    text-red-700    border border-red-200',
  other:      'bg-slate-100 text-slate-600  border border-slate-200',
};

function typeBadgeCls(type: string) {
  return TYPE_STYLE[type] ?? TYPE_STYLE.other;
}

// ── Monogram avatar ───────────────────────────────────────────────────────────

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center">
      <span className="font-display text-lg font-bold text-navy-600 tracking-tight">{initials}</span>
    </div>
  );
}

// ── Collaboration card ────────────────────────────────────────────────────────

function CollabCard({
  collab,
  lang,
  dict,
}: {
  collab: Collaboration;
  lang: Locale;
  dict: CollabDict;
}) {
  const name        = collab.organization[lang] || collab.organization.en;
  const description = collab.description[lang]  || collab.description.en;
  const typeLabel   = dict[`type_${collab.type}`] ?? collab.type;

  const periodEnd = collab.active
    ? dict.active_badge
    : (collab.period_end || '');

  const period = periodEnd
    ? `${collab.period_start} – ${periodEnd}`
    : collab.period_start;

  return (
    <article className="relative flex flex-col bg-white rounded-2xl border border-warm-200 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Top accent — gold for active, slate for ended */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${collab.active ? 'bg-gradient-to-r from-gold-400 to-gold-200' : 'bg-warm-200'}`} />

      <div className="pt-6 px-6 pb-6 flex flex-col gap-4">

        {/* Header row: monogram + name + type badge */}
        <div className="flex items-start gap-4">
          <Monogram name={name} />
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`inline-block px-2.5 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-widest ${typeBadgeCls(collab.type)}`}>
                {typeLabel}
              </span>
              {collab.active && (
                <span className="inline-block px-2.5 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-widest bg-green-50 text-green-700 border border-green-200">
                  {dict.active_badge}
                </span>
              )}
            </div>
            <h3 className="font-display text-[1.1rem] font-semibold text-navy-800 leading-snug">{name}</h3>
          </div>
        </div>

        {/* Period */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500 shrink-0" aria-hidden="true">
            <path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z"/>
          </svg>
          <span className="font-body text-xs text-slate-500">
            <span className="font-semibold text-slate-700 uppercase tracking-wide text-[10px]">{dict.period_label}</span>
            <span className="ml-2 text-sm text-slate-600">{period}</span>
          </span>
        </div>

        {/* Description */}
        <p className="font-body text-[0.8125rem] text-slate-600 leading-relaxed">{description}</p>

        {/* Outputs */}
        {collab.outputs && collab.outputs.length > 0 && (
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
              {dict.outputs_label}
            </p>
            <ul className="space-y-1.5">
              {collab.outputs.map((o, i) => {
                const text = o[lang] || o.en;
                return (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-[5px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold-400" aria-hidden="true" />
                    <span className="font-body text-xs text-slate-600 leading-relaxed">{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Website pill */}
        {collab.website && (
          <div className="pt-1">
            <a
              href={collab.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-warm-300 bg-white
                         text-xs font-medium font-body text-navy-600
                         hover:bg-navy-50 hover:border-navy-300 transition-colors"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0" aria-hidden="true">
                <path d="M8.636 3.5a.5.5 0 00-.5-.5H1.5A1.5 1.5 0 000 4.5v10A1.5 1.5 0 001.5 16h10a1.5 1.5 0 001.5-1.5V7.864a.5.5 0 00-1 0V14.5a.5.5 0 01-.5.5h-10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h6.636a.5.5 0 00.5-.5z"/>
                <path d="M16 .5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.793L6.146 9.146a.5.5 0 101.708.708L15 1.707V5.5a.5.5 0 001 0v-5z"/>
              </svg>
              {dict.visit_org}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatBar({
  collabs,
  dict,
}: {
  collabs: Collaboration[];
  dict: CollabDict;
}) {
  const total   = collabs.length;
  const active  = collabs.filter(c => c.active).length;
  const sectors = new Set(collabs.map(c => c.type)).size;

  const stats = [
    { value: total,   label: dict.stats_total },
    { value: active,  label: dict.stats_active },
    { value: sectors, label: dict.stats_sectors },
  ];

  return (
    <div className="bg-white border-b border-warm-200">
      <div className="container-main py-6">
        <div className="flex flex-wrap gap-8 sm:gap-12">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col">
              <span className="font-display text-3xl font-semibold text-navy-700 leading-none mb-1">{value}</span>
              <span className="font-body text-xs text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CollaborationsPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, config, collabs] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getCollaborations()),
  ]);

  const d = (dict as any).collaborations as CollabDict;

  // Active first, then by period_start descending
  const sorted = [...collabs].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return b.period_start.localeCompare(a.period_start);
  });

  return (
    <>
      <PageTitle
        eyebrow={d.eyebrow}
        subtitle={d.intro}
      >
        {d.title}
      </PageTitle>

      {sorted.length > 0 && <StatBar collabs={sorted} dict={d} />}

      <div className="container-main py-10 lg:py-14">
        {sorted.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-body text-slate-400 italic">{d.no_collaborations}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sorted.map(collab => (
              <CollabCard key={collab.id} collab={collab} lang={lang} dict={d} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
