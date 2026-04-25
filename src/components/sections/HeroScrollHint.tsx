'use client';

export default function HeroScrollHint() {
  function handleClick() {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  }

  return (
    <div className="flex justify-center pb-6 pt-2">
      <button
        onClick={handleClick}
        aria-label="Scroll down"
        className="flex flex-col items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
        style={{ animation: 'hero-bounce 2.2s ease-in-out infinite' }}
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
          style={{ opacity: 0.75 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c9a84c"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="w-5 h-5 -mt-3"
          style={{ opacity: 0.35 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
