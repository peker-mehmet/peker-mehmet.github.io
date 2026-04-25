'use client';

import { useState } from 'react';
import { type Locale } from '@/lib/i18n';
import {
  type SiteConfig,
  type Publication,
  type Scale,
  type Project,
  type Collaboration,
} from '@/lib/content';

// ── Dict type ─────────────────────────────────────────────────────────────────

type CVDict = {
  generate_cv: string;
  cv_modal_title: string;
  copy: string;
  copied: string;
  download_txt: string;
  close: string;
};

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  lang: Locale;
  config: SiteConfig;
  publications: Publication[];
  scales: Scale[];
  projects: Project[];
  collaborations: Collaboration[];
  dict: CVDict;
};

// ── CV text builder ───────────────────────────────────────────────────────────

function buildCVText(
  lang: Locale,
  config: SiteConfig,
  publications: Publication[],
  scales: Scale[],
  projects: Project[],
  collaborations: Collaboration[],
): string {
  const isTr = lang === 'tr';
  const SEP = '═'.repeat(52);
  const lines: string[] = [];

  const section = (title: string) => {
    lines.push('');
    lines.push(SEP);
    lines.push(title);
    lines.push(SEP);
    lines.push('');
  };

  // ── 1. Personal Info ───────────────────────────────────────────────────────
  section(isTr ? 'KİŞİSEL BİLGİLER' : 'PERSONAL INFORMATION');
  lines.push(`${isTr ? 'Ad Soyad'     : 'Name'}       : ${config.owner.name.full}`);
  lines.push(`${isTr ? 'Unvan'        : 'Title'}       : ${config.owner.title[lang]}`);
  lines.push(`${isTr ? 'Pozisyon'     : 'Position'}    : ${config.owner.position[lang]}`);
  lines.push(`${isTr ? 'Kurum'        : 'Institution'} : ${config.institution.name[lang]}`);
  lines.push(`${isTr ? 'Bölüm'        : 'Department'}  : ${config.institution.department[lang]}`);
  if (config.links.email) {
    lines.push(`E-posta${isTr ? '' : ' / Email'}      : ${config.links.email}`);
  }
  if (config.links.orcid) {
    lines.push(`ORCID               : ${config.links.orcid}`);
  }
  if (config.links.google_scholar) {
    lines.push(`Google Scholar      : ${config.links.google_scholar}`);
  }
  if (config.links.researchgate) {
    lines.push(`ResearchGate        : ${config.links.researchgate}`);
  }

  // ── 2. Publications ────────────────────────────────────────────────────────
  section(isTr ? 'YAYINLAR' : 'PUBLICATIONS');
  if (publications.length === 0) {
    lines.push(isTr ? '(Yayın bulunamadı)' : '(No publications found)');
  } else {
    const sorted = [...publications].sort((a, b) => b.year - a.year);
    for (const pub of sorted) {
      const title   = pub.title[lang] || pub.title.en;
      const authors = pub.authors_abbreviated || pub.authors.join(', ');
      let line = `${authors} (${pub.year}). ${title}.`;

      if (pub.journal) {
        line += ` ${pub.journal}`;
        if (pub.volume) line += `, ${pub.volume}`;
        if (pub.issue)  line += `(${pub.issue})`;
        if (pub.pages)  line += `, ${pub.pages}`;
        line += '.';
      } else if (pub.conference) {
        line += ` ${pub.conference}.`;
      } else if (pub.book_title) {
        if (pub.editors && pub.editors.length > 0) {
          line += ` In ${pub.editors.join(', ')} (Eds.), ${pub.book_title}.`;
        } else {
          line += ` ${pub.book_title}.`;
        }
        if (pub.publisher) line += ` ${pub.publisher}.`;
      } else if (pub.publisher) {
        line += ` ${pub.publisher}.`;
      }

      if (pub.doi) {
        const doiClean = pub.doi.startsWith('http')
          ? pub.doi
          : `https://doi.org/${pub.doi}`;
        line += ` ${doiClean}`;
      } else if (pub.url) {
        line += ` ${pub.url}`;
      }

      lines.push(line);
    }
  }

  // ── 3. Measurement Tools (Scales) ─────────────────────────────────────────
  section(isTr ? 'ÖLÇME ARAÇLARI' : 'MEASUREMENT TOOLS');
  if (scales.length === 0) {
    lines.push(isTr ? '(Ölçek bulunamadı)' : '(No scales found)');
  } else {
    for (const scale of scales) {
      const scaleName = scale.name[lang] || scale.name.en;
      const abbr = scale.abbreviation ? ` [${scale.abbreviation}]` : '';
      const year = scale.year ? ` (${scale.year}).` : '.';
      const url  = `https://peker-mehmet.github.io/${lang}/scales/${scale.id}`;
      lines.push(`Peker, M.${year} ${scaleName}${abbr}. ${url}`);
    }
  }

  // ── 4. Projects ────────────────────────────────────────────────────────────
  section(isTr ? 'PROJELER' : 'PROJECTS');
  if (projects.length === 0) {
    lines.push(isTr ? '(Proje bulunamadı)' : '(No projects found)');
  } else {
    for (const proj of projects) {
      const title     = proj.title[lang] || proj.title.en;
      const startYear = proj.start_date?.split('-')[0] ?? '';
      const endYear   = proj.end_date
        ? proj.end_date.split('-')[0]
        : isTr ? 'devam ediyor' : 'ongoing';
      const period = startYear ? `${startYear}–${endYear}` : '';
      const funder = proj.funding?.agency ?? '';
      const meta   = [proj.role, period, funder].filter(Boolean).join(', ');
      lines.push(`- ${title}${meta ? ` (${meta})` : ''}`);
    }
  }

  // ── 5. Collaborations ──────────────────────────────────────────────────────
  section(isTr ? 'İŞ BİRLİKLERİ' : 'COLLABORATIONS');
  if (collaborations.length === 0) {
    lines.push(isTr ? '(İş birliği bulunamadı)' : '(No collaborations found)');
  } else {
    for (const collab of collaborations) {
      const org  = collab.organization[lang] || collab.organization.en;
      const desc = collab.description[lang]  || collab.description.en;
      const end  = collab.active
        ? (isTr ? 'devam ediyor' : 'present')
        : (collab.period_end ?? '');
      const period = `${collab.period_start}–${end}`;
      lines.push(`- ${org} (${period})`);
      if (desc) lines.push(`  ${desc}`);
    }
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  lines.push('');
  lines.push(SEP);
  const dateStr = new Date().toLocaleDateString(isTr ? 'tr-TR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  lines.push(
    isTr
      ? `Bu CV ${dateStr} tarihinde otomatik olarak oluşturulmuştur.`
      : `This CV was automatically generated on ${dateStr}.`,
  );
  lines.push('https://peker-mehmet.github.io');

  return lines.join('\n');
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CVGenerator({
  lang, config, publications, scales, projects, collaborations, dict,
}: Props) {
  const [open,   setOpen]   = useState(false);
  const [copied, setCopied] = useState(false);

  // Build once; all inputs are static server-rendered props
  const cvText = buildCVText(lang, config, publications, scales, projects, collaborations);

  function handleCopy() {
    navigator.clipboard.writeText(cvText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'cv-mehmet-peker.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* ── Trigger button ──────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="
          inline-flex items-center gap-2 h-12 px-7 text-base font-sans font-semibold
          rounded-md border-2 border-gold-400 text-gold-700 bg-transparent
          hover:bg-gold-50 active:bg-gold-100
          transition-all duration-200 whitespace-nowrap tracking-wide
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2
        "
        aria-haspopup="dialog"
      >
        {/* FileText icon (inline SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9"  x2="8" y2="9"  />
        </svg>
        {dict.generate_cv}
      </button>

      {/* ── Modal ───────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={dict.cv_modal_title}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm-200 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-[3px] rounded-full bg-gold-400" aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold text-navy-700">
                  {dict.cv_modal_title}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:bg-warm-100 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                aria-label={dict.close}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              <textarea
                readOnly
                value={cvText}
                onClick={(e) => e.currentTarget.select()}
                className="
                  w-full min-h-[52vh] font-mono text-[0.7rem] leading-relaxed
                  text-slate-700 bg-warm-50 border border-warm-200 rounded-lg p-4
                  resize-none cursor-text
                  focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent
                "
                spellCheck={false}
                aria-label="CV text"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-warm-200 bg-warm-50 flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="font-body text-sm text-slate-500 hover:text-slate-700 transition-colors px-3 py-1.5 rounded-md hover:bg-warm-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              >
                {dict.close}
              </button>

              <div className="flex items-center gap-2">
                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="
                    inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-body text-sm font-medium
                    border border-warm-300 bg-white text-slate-700
                    hover:border-navy-300 hover:text-navy-700
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
                  "
                >
                  {copied ? (
                    <>
                      {/* Check icon */}
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-green-600" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-600">{dict.copied}</span>
                    </>
                  ) : (
                    <>
                      {/* Clipboard icon */}
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                        <path d="M8 2a1.5 1.5 0 00-1.5 1.5v1h-1A1.5 1.5 0 004 6v10.5A1.5 1.5 0 005.5 18h9a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5h-1v-1A1.5 1.5 0 0012 2H8zm0 1.5h4v1.5H8V3.5zm-2.5 3H5.5v9h9v-9h-.5V8a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5V6.5h-2z" />
                      </svg>
                      {dict.copy}
                    </>
                  )}
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="
                    inline-flex items-center gap-1.5 px-4 py-2 rounded-md font-body text-sm font-semibold
                    bg-gold-400 text-navy-900 hover:bg-gold-500 active:bg-gold-600
                    shadow-sm transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2
                  "
                >
                  {/* Download icon */}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M3 17h14" />
                  </svg>
                  {dict.download_txt}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
