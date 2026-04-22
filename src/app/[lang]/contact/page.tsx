import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig } from '@/lib/content';
import { buildPageMetadata } from '@/lib/metadata';
import { PageTitle } from '@/components/ui/SectionTitle';
import ContactForm, { type ContactDict } from '@/components/sections/ContactForm';

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const { lang } = params;
  const config = getSiteConfig();
  const title = lang === 'tr' ? 'İletişim' : 'Contact';
  const description = config.contact.note[lang] || config.bio.short[lang];
  return buildPageMetadata({ lang, path: '/contact', title, description });
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 shrink-0 text-gold-500" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 shrink-0 text-gold-500" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function IconOffice() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 shrink-0 text-gold-500" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 shrink-0 text-gold-500" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Academic profile icons ────────────────────────────────────────────────────

function IconScholar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-2 13.73v3.5l-1-.57V16.73L5.87 14.5 4 15.59V12.5l8 4.34 8-4.34v3.09l-1.87-1.09L15 16.73v3.5l-1 .57v-3.5L12 18.5l-2-1.77z"/>
    </svg>
  );
}

function IconOrcid() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.853-2.203 3.853-3.722 0-2.175-1.3-3.722-3.828-3.722h-2.322z"/>
    </svg>
  );
}

function IconResearchGate() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.123 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .077.53 3.187 3.187 0 0 0 .113.437c.245.743.65 1.303 1.214 1.68.565.375 1.255.565 2.073.565.707 0 1.356-.168 1.956-.501.6-.334 1.02-.845 1.26-1.535l-1.217-.457c-.145.393-.396.684-.75.873-.356.19-.76.284-1.21.284-.47 0-.866-.113-1.188-.34-.322-.227-.546-.571-.672-1.034a8.033 8.033 0 0 1-.118-.728 12.68 12.68 0 0 1-.048-.906v-.386H22.35V5.36c0-.46-.043-.893-.129-1.3a3.627 3.627 0 0 0-.413-1.078 2.149 2.149 0 0 0-.751-.742c-.317-.19-.702-.24-1.471-.24zm0 1.22c.376 0 .677.076.903.23.226.153.397.376.513.667.117.292.188.618.213.98.025.36.038.745.038 1.152v.154h-3.264c.006-.42.02-.797.038-1.132.018-.335.057-.632.118-.892.06-.26.154-.462.28-.605.127-.143.309-.214.547-.214zm-16.972.604h5.05c1.226 0 2.138.286 2.736.858.598.572.897 1.39.897 2.454 0 .744-.175 1.374-.524 1.888-.35.514-.87.9-1.56 1.157L11.95 12.5h-2.14L7.83 8.685H5.64V12.5H3.8V1.824h2.814zm.99 1.406V7.28H7.81c.8 0 1.39-.163 1.77-.49.38-.326.57-.8.57-1.42 0-.65-.175-1.12-.525-1.412-.35-.29-.92-.437-1.71-.437H4.605zm9.16 12.27c-1.013 0-1.818.338-2.416 1.014-.598.676-.897 1.62-.897 2.833 0 1.25.307 2.207.92 2.87.614.665 1.43.997 2.449.997.857 0 1.568-.215 2.135-.643.566-.428.934-1.048 1.102-1.862l-1.23-.37c-.119.55-.341.967-.666 1.25-.324.285-.715.427-1.172.427-.623 0-1.115-.23-1.477-.69-.362-.46-.543-1.126-.543-1.997v-.193H18c.002-.167.003-.314.003-.44 0-.914-.084-1.645-.25-2.194a2.793 2.793 0 0 0-.696-1.26c-.31-.311-.685-.516-1.126-.651a5.107 5.107 0 0 0-1.166-.09zm-.027 1.163c.334 0 .604.057.81.17.208.115.37.284.488.509.118.224.196.502.233.833.037.33.057.72.057 1.17H11.4c.007-.45.032-.845.074-1.184.042-.34.12-.621.237-.843.116-.222.278-.385.484-.49.206-.104.447-.165.72-.165z"/>
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ContactPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, config] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getSiteConfig()),
  ]);

  const d = (dict as any).contact as ContactDict;
  const { links } = config;

  // Academic profiles — only render if URL is non-empty
  const profiles = [
    {
      id: 'google_scholar',
      label: 'Google Scholar',
      url: links.google_scholar,
      icon: <IconScholar />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      ring: 'hover:ring-blue-200',
    },
    {
      id: 'orcid',
      label: 'ORCID',
      url: links.orcid,
      icon: <IconOrcid />,
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-700',
      ring: 'hover:ring-green-200',
    },
    {
      id: 'researchgate',
      label: 'ResearchGate',
      url: links.researchgate,
      icon: <IconResearchGate />,
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      text: 'text-teal-700',
      ring: 'hover:ring-teal-200',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      url: links.linkedin,
      icon: <IconLinkedIn />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      text: 'text-sky-700',
      ring: 'hover:ring-sky-200',
    },
    {
      id: 'twitter',
      label: 'Twitter / X',
      url: links.twitter,
      icon: <IconTwitter />,
      bg: 'bg-slate-50',
      border: 'border-slate-100',
      text: 'text-slate-700',
      ring: 'hover:ring-slate-200',
    },
  ].filter(p => p.url);

  return (
    <>
      {/* ── Page title ─────────────────────────────────────────────── */}
      <PageTitle
        eyebrow={`${config.owner.title[lang]} · ${config.institution.department[lang]}`}
        subtitle={config.contact.note[lang]}
      >
        {d.title}
      </PageTitle>

      {/* ── Main grid ──────────────────────────────────────────────── */}
      <div className="container-main py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* ── Left: contact form ──────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-warm-200 shadow-card overflow-hidden">
              {/* Card header */}
              <div className="px-7 py-5 border-b border-warm-100 bg-warm-50">
                <h2 className="font-display text-lg font-semibold text-navy-800">
                  {d.form_title}
                </h2>
              </div>
              {/* Card body */}
              <div className="px-7 py-6">
                <ContactForm dict={d} />
              </div>
            </div>
          </div>

          {/* ── Right: info + profiles ──────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Contact info card */}
            <div className="bg-white rounded-2xl border border-warm-200 shadow-card overflow-hidden">
              <div className="px-6 py-5 border-b border-warm-100 bg-warm-50">
                <h2 className="font-display text-lg font-semibold text-navy-800">
                  {d.info_title}
                </h2>
              </div>
              <ul className="px-6 py-5 flex flex-col gap-5">

                {/* Email */}
                <li className="flex items-start gap-3.5">
                  <IconMail />
                  <div className="min-w-0">
                    <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                      {d.email}
                    </p>
                    <a
                      href={`mailto:${links.email}`}
                      className="font-body text-sm text-navy-700 font-medium hover:text-navy-900 transition-colors break-all link-accent"
                    >
                      {links.email}
                    </a>
                  </div>
                </li>

                {/* Institution */}
                <li className="flex items-start gap-3.5">
                  <IconBuilding />
                  <div className="min-w-0">
                    <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                      {config.institution.department[lang]}
                    </p>
                    <p className="font-body text-sm text-slate-700 leading-snug">
                      {config.institution.name[lang]}
                    </p>
                    {config.institution.faculty[lang] && (
                      <p className="font-body text-xs text-slate-500 mt-0.5">
                        {config.institution.faculty[lang]}
                      </p>
                    )}
                  </div>
                </li>

                {/* Office */}
                {config.institution.office[lang] && (
                  <li className="flex items-start gap-3.5">
                    <IconOffice />
                    <div className="min-w-0">
                      <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                        {d.office}
                      </p>
                      <p className="font-body text-sm text-slate-700">{config.institution.office[lang]}</p>
                    </div>
                  </li>
                )}

                {/* Address */}
                {config.institution.address[lang] && (
                  <li className="flex items-start gap-3.5">
                    <IconOffice />
                    <div className="min-w-0">
                      <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                        {d.address}
                      </p>
                      <p className="font-body text-sm text-slate-700 leading-relaxed">
                        {config.institution.address[lang]}
                      </p>
                    </div>
                  </li>
                )}

                {/* Response time */}
                <li className="flex items-start gap-3.5 pt-2 border-t border-warm-100">
                  <IconClock />
                  <div className="min-w-0">
                    <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                      {d.response_label}
                    </p>
                    <p className="font-body text-sm text-slate-700">{d.response_value}</p>
                  </div>
                </li>

              </ul>
            </div>

            {/* Academic profiles */}
            {profiles.length > 0 && (
              <div className="bg-white rounded-2xl border border-warm-200 shadow-card overflow-hidden">
                <div className="px-6 py-5 border-b border-warm-100 bg-warm-50">
                  <h2 className="font-display text-lg font-semibold text-navy-800">
                    {d.profiles_title}
                  </h2>
                </div>
                <div className="px-6 py-5 grid grid-cols-1 gap-3">
                  {profiles.map(profile => (
                    <a
                      key={profile.id}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${d.view_profile}: ${profile.label}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${profile.border} ${profile.bg}
                                  ring-1 ring-transparent ${profile.ring} transition-all duration-150
                                  hover:shadow-sm hover:-translate-y-0.5 group`}
                    >
                      <span className={`${profile.text} transition-transform duration-150 group-hover:scale-110`}>
                        {profile.icon}
                      </span>
                      <span className={`font-body text-sm font-medium ${profile.text}`}>
                        {profile.label}
                      </span>
                      <svg
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className={`w-3.5 h-3.5 ml-auto opacity-40 group-hover:opacity-70 ${profile.text} transition-opacity`}
                        aria-hidden="true"
                      >
                        <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                        <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
