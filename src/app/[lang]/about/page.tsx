import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import {
  getSiteConfig, getPublications, getScales, getProjects, getCollaborations,
  type SiteConfig,
} from '@/lib/content';
import { buildPageMetadata, personJsonLd, SITE_URL } from '@/lib/metadata';
import Button from '@/components/ui/Button';
import SectionTitle, { PageTitle } from '@/components/ui/SectionTitle';
import BiographySection from '@/components/sections/BiographySection';
import CVGenerator from '@/components/CVGenerator';

// ── Types ─────────────────────────────────────────────────────────────────────

type AboutDict = {
  title: string;
  bio_title: string;
  interests_title: string;
  education_title: string;
  teaching_experience: string;
  profiles_title: string;
  cv_download: string;
  thesis: string;
  google_scholar: string;
  orcid: string;
  researchgate: string;
  linkedin: string;
  view_profile: string;
  toggle_en: string;
  toggle_tr: string;
  eyebrow_bio: string;
  eyebrow_interests: string;
  eyebrow_education: string;
  eyebrow_teaching: string;
  eyebrow_profiles: string;
  graduate: string;
  undergraduate: string;
  lecturer: string;
  teaching_assistant: string;
  generate_cv: string;
  cv_modal_title: string;
  copy: string;
  copied: string;
  download_txt: string;
  download_docx: string;
  close: string;
};

// ── Profile photo ─────────────────────────────────────────────────────────────

function ProfilePhoto({ config, lang }: { config: SiteConfig; lang: Locale }) {
  const isPlaceholder =
    !config.photo.profile || config.photo.profile === '/images/profile.jpg';
  const initials = config.owner.name.full
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative flex items-center justify-center">
      {/* Decorative conic ring */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 0%, rgba(201,168,76,0.3) 25%, transparent 50%, rgba(30,58,95,0.12) 75%, transparent 100%)',
          animation: 'orb-drift-slow 18s linear infinite',
        }}
      />

      {/* Photo circle */}
      <div
        className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden
                   border-4 border-white shadow-[0_8px_30px_rgba(30,58,95,0.15)]
                   ring-2 ring-gold-400/30 ring-offset-4 ring-offset-white"
      >
        {!isPlaceholder ? (
          <Image
            src={config.photo.profile}
            alt={config.photo.alt[lang]}
            fill
            sizes="(max-width: 640px) 176px, 208px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-100 to-navy-200 flex flex-col items-center justify-center gap-2">
            <span className="font-display text-4xl font-semibold text-navy-400 select-none">
              {initials}
            </span>
            <div className="h-px w-8 bg-gold-400/50" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Outer glow ring */}
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-full border border-gold-200/40"
        style={{ animation: 'orb-drift-alt 24s ease-in-out infinite' }}
      />
    </div>
  );
}

// ── Education timeline ────────────────────────────────────────────────────────

function EducationTimeline({
  education,
  lang,
  thesisLabel,
}: {
  education: SiteConfig['education'];
  lang: Locale;
  thesisLabel: string;
}) {
  return (
    <div>
      {education.map((edu, idx) => {
        const isLast = idx === education.length - 1;
        return (
          <div key={idx} className="relative flex gap-5 sm:gap-7">
            {/* Year badge */}
            <div className="flex-shrink-0 w-16 sm:w-20 text-right pt-0.5">
              <span className="inline-block px-2 py-1 bg-navy-700 text-white text-[11px] font-mono font-bold rounded-md shadow-card tracking-wider leading-none">
                {edu.year}
              </span>
            </div>

            {/* Dot + vertical connector */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="mt-[3px] w-3.5 h-3.5 rounded-full bg-gold-400 ring-[3px] ring-gold-200 ring-offset-2 ring-offset-warm-50 shadow-sm z-10 flex-shrink-0" />
              {!isLast && (
                <div className="flex-1 w-0.5 bg-gradient-to-b from-gold-300 via-gold-200/60 to-transparent mt-2 min-h-[2rem]" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 min-w-0 ${!isLast ? 'pb-10' : 'pb-2'}`}>
              <h3 className="font-display text-[1.0625rem] font-semibold text-navy-700 leading-snug">
                {edu.degree[lang]}
              </h3>
              <p className="mt-1 font-body text-[0.8125rem] text-slate-500 leading-relaxed">
                {edu.institution[lang]}
              </p>
              {edu.thesis[lang] && (
                <div className="mt-3 pl-3 border-l-2 border-gold-200">
                  <p className="font-body text-[0.6875rem] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                    {thesisLabel}
                  </p>
                  <p className="font-body text-[0.8125rem] text-slate-600 italic leading-relaxed">
                    {edu.thesis[lang]}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Academic profile card ─────────────────────────────────────────────────────

function ProfileCard({
  name,
  href,
  icon,
  viewLabel,
  iconBg,
}: {
  name: string;
  href: string;
  icon: React.ReactNode;
  viewLabel: string;
  iconBg: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-5 bg-white rounded-xl border border-warm-200 shadow-card
                 hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
    >
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center shadow-sm overflow-hidden`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-navy-700 group-hover:text-navy-900 text-[0.9375rem] leading-snug">
          {name}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 font-body">{viewLabel}</p>
      </div>
      {/* Arrow */}
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 text-slate-300 group-hover:text-gold-400 flex-shrink-0 transition-colors duration-150"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );
}

// ── Platform icons ────────────────────────────────────────────────────────────

function ScholarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#4285F4" aria-hidden="true">
      {/* Graduation cap */}
      <path d="M12 3L1 9l11 6 11-6-11-6zM5 13.18v4L12 21l7-4v-4L12 17l-7-3.82z" />
    </svg>
  );
}

function OrcidIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#A6CE39" />
      {/* Stylised "iD" mark */}
      <circle cx="8.5" cy="7.8" r="1.15" fill="white" />
      <rect x="7.4" y="10.2" width="2.2" height="7.2" rx="0.4" fill="white" />
      <rect x="11.2" y="6.6" width="2.2" height="10.8" rx="0.4" fill="white" />
      <path
        d="M13.4 6.6h2.4c3.2 0 5 2 5 5.4 0 3.3-1.8 5.4-5 5.4h-2.4V6.6z"
        fill="white"
      />
      <path
        d="M15.6 8.8c1.8 0 2.8 1.2 2.8 3.2s-1 3.2-2.8 3.2H15V8.8h.6z"
        fill="#A6CE39"
      />
    </svg>
  );
}

function ResearchGateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <rect width="24" height="24" rx="3.5" fill="#00CCBB" />
      {/* R */}
      <path
        d="M4.5 6.5h4.2c1.9 0 3 .9 3 2.4 0 1.1-.6 1.9-1.6 2.2l2 3.4H9.8l-1.8-3.1H6.5v3.1H4.5V6.5zm2 1.7v2.1H8c.8 0 1.3-.4 1.3-1.05S8.8 8.2 8 8.2H6.5z"
        fill="white"
      />
      {/* G */}
      <path
        d="M13.5 10c0-2.5 1.7-3.9 4-3.9 1.4 0 2.5.5 3.2 1.4l-1.3 1.1c-.4-.5-1-.8-1.8-.8-1.3 0-2.1.9-2.1 2.2s.8 2.2 2.2 2.2c.6 0 1.1-.15 1.4-.4v-1h-1.7V9.1h3.6V13c-.8.8-1.9 1.3-3.3 1.3-2.4 0-4.2-1.5-4.2-4.3z"
        fill="white"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#0A66C2" className="w-5 h-5" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

// ── Teaching section ──────────────────────────────────────────────────────────

type TeachingCourse = {
  level: string;
  role: string;
  institution: string;
  department: string;
  course_en: string;
  course_tr: string;
};

function TeachingSection({
  courses,
  lang,
  dict,
}: {
  courses: TeachingCourse[];
  lang: Locale;
  dict: Pick<AboutDict, 'graduate' | 'undergraduate' | 'lecturer' | 'teaching_assistant'>;
}) {
  const ma = courses.filter((c) => c.level === 'M.A.');
  const ba = courses.filter((c) => c.level === 'B.A.');

  const renderGroup = (group: TeachingCourse[], label: string) => (
    <div>
      <p className="font-body text-[0.6875rem] font-semibold uppercase tracking-widest text-gold-600 mb-3">
        {label}
      </p>
      <div className="rounded-xl overflow-hidden border border-warm-200">
        {group.map((c, i) => {
          const isLecturer = c.role === 'Lecturer';
          const courseName = lang === 'tr' ? c.course_tr : c.course_en;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 sm:gap-4 px-4 py-3 ${
                i % 2 === 0 ? 'bg-white' : 'bg-warm-50/60'
              }`}
            >
              <span
                className={`flex-shrink-0 mt-0.5 inline-block px-2 py-[3px] rounded text-[9px] font-semibold uppercase tracking-widest leading-none ${
                  isLecturer
                    ? 'bg-navy-100 text-navy-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isLecturer ? dict.lecturer : dict.teaching_assistant}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-[0.9rem] font-medium text-navy-700 leading-snug">
                  {courseName}
                </p>
                <p className="mt-0.5 font-body text-[0.75rem] italic text-slate-400">
                  {c.department}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {ma.length > 0 && renderGroup(ma, dict.graduate)}
      {ba.length > 0 && renderGroup(ba, dict.undergraduate)}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const { lang } = params;
  const config = getSiteConfig();
  const title = lang === 'tr' ? 'Hakkımda' : 'About';
  const description = config.bio.full[lang]?.[0] || config.bio.short[lang];
  return buildPageMetadata({ lang, path: '/about', title, description, type: 'profile' });
}

export default async function AboutPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, config, publications, scales, projects, collaborations] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getPublications()),
    Promise.resolve(getScales()),
    Promise.resolve(getProjects()),
    Promise.resolve(getCollaborations()),
  ]);

  const d = (dict as any).about as AboutDict;
  const { owner, institution, bio, research_interests, education, teaching, links, languages } = config;
  const cvLink = lang === 'tr' ? links.cv_tr || links.cv : links.cv;

  const profiles = [
    { key: 'scholar', name: d.google_scholar, href: links.google_scholar, icon: <ScholarIcon />, iconBg: 'bg-blue-50' },
    { key: 'orcid',   name: d.orcid,          href: links.orcid,          icon: <OrcidIcon />,   iconBg: 'bg-green-50' },
    { key: 'rg',      name: d.researchgate,   href: links.researchgate,   icon: <ResearchGateIcon />, iconBg: 'bg-teal-50' },
    { key: 'li',      name: d.linkedin,       href: links.linkedin,       icon: <LinkedInIcon />, iconBg: 'bg-sky-50' },
  ].filter((p) => Boolean(p.href));

  const jsonLd = personJsonLd({
    name: owner.name.full,
    jobTitle: owner.title.en,
    affiliation: institution.name.en,
    url: SITE_URL,
    image: config.photo.profile || undefined,
    sameAs: [links.google_scholar, links.orcid, links.researchgate].filter(Boolean),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <PageTitle eyebrow={`${owner.title[lang]} · ${institution.department[lang]}`}>
        {d.title}
      </PageTitle>

      {/* ── Profile block ────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-warm-200">
        <div className="container-main py-14 lg:py-16">
          <div className="flex flex-col sm:flex-row gap-10 lg:gap-16 items-center sm:items-start lg:items-center">
            {/* Photo */}
            <div className="flex-shrink-0">
              <ProfilePhoto config={config} lang={lang} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left" style={{ animation: 'fade-up 0.5s ease-out both' }}>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-navy-700 leading-tight">
                {owner.name.full}
              </h2>
              <p className="mt-1.5 font-body text-gold-600 font-semibold tracking-wide text-[0.9375rem]">
                {owner.title[lang]}
              </p>
              <p className="mt-0.5 font-body text-[0.8125rem] text-slate-500">
                {institution.department[lang]}&ensp;·&ensp;{institution.name[lang]}
              </p>

              {/* Gold rule */}
              <div className="flex items-center gap-2 my-5 justify-center sm:justify-start" aria-hidden="true">
                <div className="h-px w-12 bg-gold-400" />
                <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                <div className="h-px w-6 bg-gold-200" />
              </div>

              {/* Language badges */}
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
                  {languages.map((l, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-50 rounded-full text-xs font-body border border-warm-300"
                    >
                      <span className="font-semibold text-navy-700">{l.name[lang]}</span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-slate-500">{l.level[lang]}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* CV actions */}
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {cvLink && (
                  <Button href={cvLink} variant="gold" size="lg" external>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    {d.cv_download}
                  </Button>
                )}
                <CVGenerator
                  lang={lang}
                  config={config}
                  publications={publications}
                  scales={scales}
                  projects={projects}
                  collaborations={collaborations}
                  dict={d}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Biography ────────────────────────────────────────────────────── */}
      <section className="bg-warm-50 border-b border-warm-200">
        <div className="container-main py-14 lg:py-16">
          <SectionTitle eyebrow={d.eyebrow_bio}>{d.bio_title}</SectionTitle>
          <div className="max-w-3xl">
            <BiographySection
              bioEn={bio.full.en}
              bioTr={bio.full.tr}
              initialLang={lang}
              dict={{ toggle_en: d.toggle_en, toggle_tr: d.toggle_tr }}
            />
          </div>
        </div>
      </section>

      {/* ── Research Interests ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-warm-200">
        <div className="container-main py-14 lg:py-16">
          <SectionTitle eyebrow={d.eyebrow_interests}>{d.interests_title}</SectionTitle>
          <div className="flex flex-wrap gap-2.5 max-w-3xl">
            {research_interests[lang].map((interest, i) => (
              <Link
                key={i}
                href={`/${lang}/publications?interest=${encodeURIComponent(research_interests.en[i] ?? interest)}`}
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-full
                  font-body text-sm font-medium border
                  bg-warm-50 text-navy-700 border-navy-700
                  hover:bg-navy-700 hover:text-white
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
                "
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                {interest}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education timeline ───────────────────────────────────────────── */}
      <section className="bg-warm-50 border-b border-warm-200">
        <div className="container-main py-14 lg:py-16">
          <SectionTitle eyebrow={d.eyebrow_education}>{d.education_title}</SectionTitle>
          <div className="max-w-2xl">
            <EducationTimeline
              education={education}
              lang={lang}
              thesisLabel={d.thesis}
            />
          </div>
        </div>
      </section>

      {/* ── Teaching experience ─────────────────────────────────────────── */}
      {teaching && teaching.length > 0 && (
        <section className="bg-white border-b border-warm-200">
          <div className="container-main py-14 lg:py-16">
            <SectionTitle eyebrow={d.eyebrow_teaching}>{d.teaching_experience}</SectionTitle>
            <TeachingSection courses={teaching} lang={lang} dict={d} />
          </div>
        </section>
      )}

      {/* ── Academic profiles ────────────────────────────────────────────── */}
      {profiles.length > 0 && (
        <section className="bg-warm-50">
          <div className="container-main py-14 lg:py-16">
            <SectionTitle eyebrow={d.eyebrow_profiles}>{d.profiles_title}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
              {profiles.map((p) => (
                <ProfileCard
                  key={p.key}
                  name={p.name}
                  href={p.href}
                  icon={p.icon}
                  viewLabel={d.view_profile}
                  iconBg={p.iconBg}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
