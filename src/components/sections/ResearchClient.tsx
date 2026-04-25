'use client';

import { type Locale } from '@/lib/i18n';
import { type Project } from '@/lib/content';

// ── Dict type ─────────────────────────────────────────────────────────────────

export type ResearchDict = {
  title: string;
  interests_title: string;
  ongoing_title: string;
  completed_title: string;
  show_completed: string;
  hide_completed: string;
  collaborators_title: string;
  role_pi: string;
  role_co_pi: string;
  role_collaborator: string;
  role_co_investigator: string;
  status_active: string;
  status_completed: string;
  status_planned: string;
  status_submitted: string;
  funding_label: string;
  duration_label: string;
  ongoing: string;
  grant_label: string;
  amount_label: string;
  collaborators_label: string;
  outputs_label: string;
  visit_project: string;
  visit_osf: string;
  no_ongoing: string;
  no_completed: string;
  [key: string]: string;
};

type Props = {
  ongoing: Project[];
  completed: Project[];
  lang: Locale;
  dict: ResearchDict;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function roleLabel(role: string, dict: ResearchDict) {
  if (role === 'Principal Investigator') return dict.role_pi;
  if (role === 'Co-PI') return dict.role_co_pi;
  if (role === 'Collaborator') return dict.role_collaborator;
  if (role === 'Co-Investigator') return dict.role_co_investigator;
  return role;
}

const ROLE_STYLE: Record<string, string> = {
  'Principal Investigator': 'bg-navy-700 text-white',
  'Co-PI':                  'bg-navy-100 text-navy-700 border border-navy-200',
  'Collaborator':           'bg-slate-100 text-slate-600 border border-slate-200',
  'Co-Investigator':        'bg-slate-100 text-slate-600 border border-slate-200',
};

function roleBadgeStyle(role: string) {
  return ROLE_STYLE[role] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
}

type StatusMeta = { label: string; cls: string };

function statusBadge(status: string, dict: ResearchDict): StatusMeta {
  switch (status) {
    case 'active':    return { label: dict.status_active,    cls: 'bg-green-50 text-green-700 border border-green-200' };
    case 'completed': return { label: dict.status_completed, cls: 'bg-slate-100 text-slate-500 border border-slate-200' };
    case 'planned':   return { label: dict.status_planned,   cls: 'bg-gold-50 text-gold-700 border border-gold-200' };
    case 'submitted': return { label: dict.status_submitted, cls: 'bg-amber-50 text-amber-700 border border-amber-200' };
    default:          return { label: status,                cls: 'bg-slate-100 text-slate-500 border border-slate-200' };
  }
}

function cardAccentClass(status: string): string {
  switch (status) {
    case 'active':    return 'bg-gradient-to-r from-gold-400 to-gold-200';
    case 'planned':   return 'bg-gradient-to-r from-gold-300 to-warm-200';
    case 'submitted': return 'bg-gradient-to-r from-amber-400 to-amber-200';
    default:          return 'bg-warm-200';
  }
}

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

function IconLink() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0" aria-hidden="true">
      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
    </svg>
  );
}

function IconOsf() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0" aria-hidden="true">
      <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
      <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
    </svg>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project, lang, dict, muted = false,
}: {
  project: Project; lang: Locale; dict: ResearchDict; muted?: boolean;
}) {
  const title = project.title[lang] || project.title.en;
  const desc  = project.description[lang] || project.description.en;
  const { label: statusLabel, cls: statusCls } = statusBadge(project.status, dict);

  const start    = formatDate(project.start_date);
  const end      = project.end_date ? formatDate(project.end_date) : dict.ongoing;
  const duration = `${start} – ${end}`;

  const hasLinks = !!(project.url || project.osf_url);

  return (
    <article
      className={`relative flex flex-col bg-white rounded-xl border overflow-hidden transition-all duration-200
        ${muted
          ? 'border-warm-200 opacity-75 shadow-card'
          : 'border-warm-200 shadow-card hover:shadow-card-md hover:-translate-y-0.5'}`}
    >
      {/* Status-keyed accent stripe */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] ${
          muted ? 'bg-warm-200' : cardAccentClass(project.status)
        }`}
      />

      <div className="pt-6 px-6 pb-6 flex flex-col gap-4">

        {/* Role + status badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-block px-2.5 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-widest ${roleBadgeStyle(project.role)}`}
          >
            {roleLabel(project.role, dict)}
          </span>
          <span
            className={`ml-auto inline-block px-2.5 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-widest ${statusCls}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-[1.125rem] font-semibold text-navy-800 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="font-body text-[0.8125rem] text-slate-600 leading-relaxed">
          {desc}
        </p>

        {/* Meta */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[0.8125rem]">

          {/* Duration */}
          <div>
            <dt className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
              {dict.duration_label}
            </dt>
            <dd className="font-body text-slate-700">{duration}</dd>
          </div>

          {/* Funding */}
          {project.funding?.agency && (
            <div>
              <dt className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                {dict.funding_label}
              </dt>
              <dd className="font-body text-slate-700">
                {project.funding.agency}
                {project.funding.grant_number && (
                  <span className="text-slate-400 ml-1.5">· {project.funding.grant_number}</span>
                )}
                {project.funding.amount && (
                  <span className="block text-slate-500 text-xs mt-0.5">{project.funding.amount}</span>
                )}
              </dd>
            </div>
          )}

          {/* Team */}
          {project.collaborators && project.collaborators.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                {dict.collaborators_label}
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {project.collaborators.map((c) => (
                  <span
                    key={c.name}
                    className="inline-block px-2.5 py-1 bg-warm-50 border border-warm-200 rounded-md text-[0.75rem] font-body text-slate-700"
                  >
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-slate-400 ml-1.5">· {c.affiliation}</span>
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        {/* Pill links */}
        {hasLinks && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-warm-300 bg-white
                           text-xs font-medium font-body text-navy-600
                           hover:bg-navy-50 hover:border-navy-300 transition-colors"
              >
                <IconLink />
                {dict.visit_project}
              </a>
            )}
            {project.osf_url && (
              <a
                href={project.osf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-navy-700 text-white
                           text-xs font-medium font-body
                           hover:bg-navy-800 transition-colors"
              >
                <IconOsf />
                {dict.visit_osf}
              </a>
            )}
          </div>
        )}

      </div>
    </article>
  );
}

// ── Collaborators grid ────────────────────────────────────────────────────────

function CollaboratorsGrid({ projects, dict }: { projects: Project[]; dict: ResearchDict }) {
  const seen = new Set<string>();
  const collaborators: { name: string; affiliation: string }[] = [];

  for (const p of projects) {
    for (const c of (p.collaborators ?? [])) {
      if (!seen.has(c.name)) {
        seen.add(c.name);
        collaborators.push(c);
      }
    }
  }

  if (collaborators.length === 0) return null;

  return (
    <section className="container-main pb-14 lg:pb-20">
      <h2 className="font-display text-2xl font-semibold text-navy-800 mb-6">
        {dict.collaborators_title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collaborators.map((c) => {
          const initial = c.name.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?';
          return (
            <div
              key={c.name}
              className="flex items-start gap-3 p-4 bg-white rounded-xl border border-warm-200 shadow-card"
            >
              {/* Monogram avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center">
                <span className="font-display text-sm font-bold text-navy-600">{initial}</span>
              </div>
              <div className="min-w-0">
                <p className="font-body text-sm font-semibold text-navy-800 leading-snug">{c.name}</p>
                <p className="font-body text-xs text-slate-500 leading-snug mt-0.5">{c.affiliation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResearchClient({ ongoing, completed, lang, dict }: Props) {
  const allProjects = [...ongoing, ...completed];

  return (
    <>
      {/* ── Ongoing ──────────────────────────────────────────────── */}
      <section className="container-main py-10 lg:py-14">
        <h2 className="font-display text-2xl font-semibold text-navy-800 mb-6">
          {dict.ongoing_title}
        </h2>

        {ongoing.length === 0 ? (
          <p className="font-body text-slate-500 italic">{dict.no_ongoing}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {ongoing.map((p) => (
              <ProjectCard key={p.id} project={p} lang={lang} dict={dict} />
            ))}
          </div>
        )}
      </section>

      {/* ── Completed ─────────────────────────────────────────────── */}
      {completed.length > 0 && (
        <section className="container-main pb-10 lg:pb-14">
          <h2 className="font-display text-2xl font-semibold text-navy-800 mb-6">
            {dict.completed_title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {completed.map((p) => (
              <ProjectCard key={p.id} project={p} lang={lang} dict={dict} muted />
            ))}
          </div>
        </section>
      )}

      {/* ── Collaborators ─────────────────────────────────────────── */}
      <div className="border-t border-warm-200 bg-warm-50">
        <CollaboratorsGrid projects={allProjects} dict={dict} />
      </div>
    </>
  );
}
