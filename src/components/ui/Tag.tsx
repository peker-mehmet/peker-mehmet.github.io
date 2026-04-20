type TagProps = {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
};

export default function Tag({ children, onClick, active = false, className = '' }: TagProps) {
  const base =
    'inline-flex items-center font-body text-caption rounded-md px-2.5 py-1 ' +
    'border transition-all duration-150 leading-none whitespace-nowrap';

  const inactive =
    'bg-warm-50 border-warm-300 text-slate-600 hover:border-navy-300 hover:text-navy-700 hover:bg-navy-50';

  const activeStyle =
    'bg-navy-700 border-navy-700 text-white';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${active ? activeStyle : inactive} cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={`${base} ${active ? activeStyle : inactive} ${className}`}>
      {children}
    </span>
  );
}

// ── Tag list — renders a row of tags with optional filter behavior ─────────────

export function TagList({
  tags,
  active,
  onToggle,
  className = '',
}: {
  tags: string[];
  active?: string | null;
  onToggle?: (tag: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          active={active === tag}
          onClick={onToggle ? () => onToggle(tag) : undefined}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}
