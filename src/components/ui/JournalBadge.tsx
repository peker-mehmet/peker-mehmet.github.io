// Deterministic colored journal badge.
// Color priority: hardcoded brand map → hash-derived HSL fallback.

const JOURNAL_COLORS: Record<string, string> = {
  'Nature Human Behaviour':              '#00A087',
  'Current Psychology':                  '#4A90D9',
  'Journal of Managerial Psychology':    '#7B5EA7',
  'Motivation and Emotion':              '#E07B39',
  'Journal of Clinical Psychology':      '#2E8B57',
  'Personality and Individual Differences': '#C0392B',
  'Journal of Personality Assessment':   '#2C3E8C',
  'Cognitive Therapy and Research':      '#27AE60',
  'Safety and Health at Work':           '#E67E22',
  'Turkish Journal of Psychiatry':       '#8E1B1B',
  'Turkish Journal of Psychology':       '#A93226',
};

function hashHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) & 0xffffff;
  }
  return h % 360;
}

export function journalColor(journal: string): string {
  return JOURNAL_COLORS[journal] ?? `hsl(${hashHue(journal)}, 60%, 40%)`;
}

export default function JournalBadge({ journal }: { journal: string }) {
  const color = journalColor(journal);
  // 15% opacity background via hex alpha (0x26 ≈ 15% of 0xFF)
  const bgColor = color.startsWith('#')
    ? `${color}26`
    : color.replace('hsl(', 'hsla(').replace(')', ', 0.15)');

  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium max-w-[200px] truncate leading-5"
      style={{ backgroundColor: bgColor, color }}
      title={journal}
    >
      {journal}
    </span>
  );
}
