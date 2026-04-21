'use client';

import { useState } from 'react';

type Props = {
  text: string;
  copyLabel: string;
  copiedLabel: string;
};

export default function CopyCitationButton({ text, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-body border transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
        ${copied
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-white text-navy-600 border-warm-300 hover:bg-navy-50 hover:border-navy-300'
        }`}
    >
      {copied ? (
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
          <path d="M12.736 3.97a.733.733 0 011.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 01-1.065.02L3.217 8.384a.757.757 0 010-1.06.733.733 0 011.047 0l3.052 3.093 5.4-6.425a.247.247 0 01.02-.022z" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
          <path d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z" />
          <path d="M9.5 1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h3zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z" />
        </svg>
      )}
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
