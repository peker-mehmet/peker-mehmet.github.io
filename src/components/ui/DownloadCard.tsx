'use client';

import { trackDownload } from '@/lib/analytics';

type Props = {
  href: string;
  label: string;
  btnLabel: string;
};

export default function DownloadCard({ href, label, btnLabel }: Props) {
  if (!href) return null;

  const handleClick = () => {
    const fileName = href.split('/').pop() ?? href;
    trackDownload(fileName, 'pdf', window.location.pathname);
  };

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
        onClick={handleClick}
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
