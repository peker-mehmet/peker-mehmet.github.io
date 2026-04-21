import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig, getTeachingData, type Course, type Supervision } from '@/lib/content';
import { PageTitle } from '@/components/ui/SectionTitle';

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const [dict, config] = await Promise.all([
    getDictionary(params.lang),
    Promise.resolve(getSiteConfig()),
  ]);
  return {
    title: `${(dict as any).teaching.title} — ${config.owner.name.full}`,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

type TeachingDict = Record<string, string>;

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatBar({
  courses,
  supervision,
  dict,
}: {
  courses: Course[];
  supervision: Supervision[];
  dict: TeachingDict;
}) {
  const totalCourses   = courses.length;
  const currentStudents = supervision.filter(s => s.status === 'current').length;
  const graduates      = supervision.filter(s => s.status === 'completed').length;

  const stats = [
    { value: totalCourses,    label: dict.stats_courses },
    { value: currentStudents, label: dict.stats_current_students },
    { value: graduates,       label: dict.stats_graduates },
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

// ── Level badge ───────────────────────────────────────────────────────────────

const LEVEL_STYLE: Record<string, string> = {
  undergraduate: 'bg-navy-50 text-navy-700 border border-navy-200',
  graduate:      'bg-gold-50 text-gold-700 border border-gold-200',
};

// ── Course card (current) ─────────────────────────────────────────────────────

function CourseCard({
  course,
  lang,
  dict,
}: {
  course: Course;
  lang: Locale;
  dict: TeachingDict;
}) {
  const name       = course.name[lang] || course.name.en;
  const desc       = course.description[lang] || course.description.en;
  const termLabel  = course.term_label[lang] || course.term_label.en;
  const levelLabel = dict[`level_${course.level}`] ?? course.level;
  const levelStyle = LEVEL_STYLE[course.level] ?? LEVEL_STYLE.undergraduate;

  return (
    <article className="relative flex flex-col bg-white rounded-2xl border border-warm-200 shadow-card hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold-400 to-gold-200" />

      <div className="pt-6 px-6 pb-6 flex flex-col gap-3">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-block px-2.5 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-widest ${levelStyle}`}>
            {levelLabel}
          </span>
          <span className="inline-block px-2.5 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
            {course.code}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display text-[1.15rem] font-semibold text-navy-800 leading-snug">{name}</h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-body text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500 shrink-0" aria-hidden="true">
              <path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z"/>
            </svg>
            {termLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500 shrink-0" aria-hidden="true">
              <path d="M9.5 1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3zm-3-1A1.5 1.5 0 005 1.5H2a2 2 0 00-2 2V14a2 2 0 002 2h12a2 2 0 002-2V3.5a2 2 0 00-2-2H11A1.5 1.5 0 009.5 0h-3z"/>
            </svg>
            {course.credits} {dict.credits_label}
          </span>
        </div>

        {/* Description */}
        <p className="font-body text-[0.8125rem] text-slate-600 leading-relaxed">{desc}</p>

        {/* Syllabus link */}
        {course.syllabus_url && (
          <div className="pt-1">
            <a
              href={course.syllabus_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-warm-300 bg-white
                         text-xs font-medium font-body text-navy-600
                         hover:bg-navy-50 hover:border-navy-300 transition-colors"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0" aria-hidden="true">
                <path d="M.5 9.9a.5.5 0 01.5.5v2.5a1 1 0 001 1h12a1 1 0 001-1v-2.5a.5.5 0 011 0v2.5a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.5a.5.5 0 01.5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V1.5a.5.5 0 00-1 0v8.793L5.354 8.146a.5.5 0 10-.708.708l3 3z"/>
              </svg>
              {dict.download_syllabus}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

// ── Past course row ───────────────────────────────────────────────────────────

function PastCourseRow({
  course,
  lang,
  dict,
}: {
  course: Course;
  lang: Locale;
  dict: TeachingDict;
}) {
  const name       = course.name[lang] || course.name.en;
  const termLabel  = course.term_label[lang] || course.term_label.en;
  const levelLabel = dict[`level_${course.level}`] ?? course.level;
  const levelStyle = LEVEL_STYLE[course.level] ?? LEVEL_STYLE.undergraduate;

  return (
    <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3.5 border-b border-warm-100 last:border-0">
      {/* Term */}
      <span className="font-body text-xs text-slate-400 sm:w-28 shrink-0 pt-0.5">{termLabel}</span>

      {/* Code + Name */}
      <div className="flex-1 flex flex-wrap items-start gap-x-3 gap-y-1">
        <span className="font-mono text-xs text-slate-400">{course.code}</span>
        <span className="font-body text-sm font-medium text-navy-800">{name}</span>
      </div>

      {/* Level badge */}
      <span className={`self-start sm:self-center inline-block px-2 py-[2px] rounded text-[9px] font-semibold font-body uppercase tracking-widest ${levelStyle}`}>
        {levelLabel}
      </span>
    </li>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-2xl font-semibold text-navy-800">{title}</h2>
      <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
        <div className="h-px w-12 bg-gold-400" />
        <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
        <div className="h-px w-6 bg-gold-200" />
      </div>
    </div>
  );
}

// ── Supervision card ──────────────────────────────────────────────────────────

const SUPERVISION_TYPE_STYLE: Record<string, string> = {
  phd:    'bg-navy-700 text-white',
  masters:'bg-gold-50 text-gold-700 border border-gold-200',
  undergrad:'bg-slate-100 text-slate-600 border border-slate-200',
};

function SupervisionCard({
  student,
  lang,
  dict,
}: {
  student: Supervision;
  lang: Locale;
  dict: TeachingDict;
}) {
  const topic      = student.topic[lang] || student.topic.en;
  const typeLabel  = dict[`type_${student.type}`] ?? student.type;
  const typeStyle  = SUPERVISION_TYPE_STYLE[student.type] ?? SUPERVISION_TYPE_STYLE.undergrad;
  const statusLabel = dict[`status_${student.status}`] ?? student.status;
  const isActive   = student.status === 'current';

  const period = student.year_end
    ? `${student.year_start}–${student.year_end}`
    : `${student.year_start}–`;

  return (
    <div className={`relative flex flex-col gap-2.5 p-5 rounded-xl border ${isActive ? 'border-gold-200 bg-gold-50/40' : 'border-warm-200 bg-white'}`}>
      {/* Dot accent for active */}
      {isActive && (
        <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-50" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-500" />
        </span>
      )}

      <div className="flex flex-wrap items-center gap-2 pr-5">
        <span className={`inline-block px-2 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-widest ${typeStyle}`}>
          {typeLabel}
        </span>
        <span className={`inline-block px-2 py-[3px] rounded text-[10px] font-semibold font-body uppercase tracking-widest ${isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
          {statusLabel}
        </span>
      </div>

      <p className="font-body text-sm font-semibold text-navy-700 leading-snug">{student.name}</p>

      <p className="font-body text-xs text-slate-600 leading-relaxed italic">{topic}</p>

      <p className="font-body text-[10px] text-slate-400 mt-auto">{period}</p>

      {student.thesis_url && (
        <a
          href={student.thesis_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-body text-navy-600 hover:text-gold-700 transition-colors"
        >
          View thesis →
        </a>
      )}
    </div>
  );
}

// ── Office hours banner ───────────────────────────────────────────────────────

function OfficeHoursBanner({ hours, title }: { hours: string; title: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl bg-navy-900 text-white">
      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gold-400" aria-hidden="true">
          <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-navy-400 mb-1">{title}</p>
        <p className="font-body text-sm text-navy-100 leading-relaxed">{hours}</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TeachingPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, teaching] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getTeachingData()),
  ]);

  const d = (dict as any).teaching as TeachingDict;

  const currentCourses = teaching.courses.filter(c => c.current);
  const pastCourses    = teaching.courses
    .filter(c => !c.current)
    .sort((a, b) => b.term.localeCompare(a.term));

  const currentStudents   = teaching.supervision.filter(s => s.status === 'current');
  const completedStudents = teaching.supervision.filter(s => s.status === 'completed');

  return (
    <>
      <PageTitle eyebrow={d.eyebrow} subtitle={d.intro}>
        {d.title}
      </PageTitle>

      <StatBar courses={teaching.courses} supervision={teaching.supervision} dict={d} />

      <div className="container-main py-10 lg:py-14 space-y-16">

        {/* ── Current Courses ────────────────────────────────────────────── */}
        {currentCourses.length > 0 && (
          <section>
            <SectionHeading title={d.current_courses} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentCourses.map(course => (
                <CourseCard key={course.id} course={course} lang={lang} dict={d} />
              ))}
            </div>
          </section>
        )}

        {/* ── Past Courses ───────────────────────────────────────────────── */}
        {pastCourses.length > 0 && (
          <section>
            <SectionHeading title={d.past_courses} />
            <div className="bg-white rounded-2xl border border-warm-200 shadow-card px-6">
              <ul>
                {pastCourses.map(course => (
                  <PastCourseRow key={course.id} course={course} lang={lang} dict={d} />
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Supervision ────────────────────────────────────────────────── */}
        {teaching.supervision.length > 0 && (
          <section>
            <SectionHeading title={d.supervision_title} />
            {d.supervision_intro && (
              <p className="font-body text-sm text-slate-500 mb-6 max-w-2xl">{d.supervision_intro}</p>
            )}

            {currentStudents.length > 0 && (
              <div className="mb-8">
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">{d.status_current}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentStudents.map((s, i) => (
                    <SupervisionCard key={i} student={s} lang={lang} dict={d} />
                  ))}
                </div>
              </div>
            )}

            {completedStudents.length > 0 && (
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">{d.status_completed}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedStudents.map((s, i) => (
                    <SupervisionCard key={i} student={s} lang={lang} dict={d} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Office Hours ───────────────────────────────────────────────── */}
        {teaching.office_hours && (
          <section>
            <OfficeHoursBanner
              hours={teaching.office_hours[lang] || teaching.office_hours.en}
              title={d.office_hours_title}
            />
          </section>
        )}

      </div>
    </>
  );
}
