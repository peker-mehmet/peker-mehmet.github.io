'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTopButton({ label = 'Back to top' }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={label}
      className="
        fixed bottom-8 right-6 z-50
        flex items-center justify-center
        w-11 h-11 rounded-full
        bg-navy-700 border border-gold-400/60
        shadow-[0_2px_8px_rgba(0,0,0,0.2)]
        hover:bg-navy-600 hover:border-gold-400
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400
      "
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c9a84c"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="w-5 h-5"
      >
        <path d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}
