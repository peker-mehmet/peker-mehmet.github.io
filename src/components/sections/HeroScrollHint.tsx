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
        className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-full
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        style={{
          animation: 'hero-bounce 2.2s ease-in-out infinite',
          backgroundColor: 'rgba(201, 168, 76, 0.15)',
          border: '1px solid rgba(201, 168, 76, 0.4)',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c9a84c"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="w-6 h-6"
          style={{ opacity: 0.85 }}
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
          className="w-6 h-6 -mt-3"
          style={{ opacity: 0.4 }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
