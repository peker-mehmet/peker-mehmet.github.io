type Variant =
  | 'navy'
  | 'gold'
  | 'slate'
  | 'warm'
  | 'award'
  | 'publication'
  | 'conference'
  | 'grant'
  | 'media'
  | 'teaching'
  | 'other';

type Size = 'sm' | 'md';

const base =
  'inline-flex items-center gap-1 font-sans font-medium rounded-full ' +
  'tracking-wide leading-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  // Base palette variants
  navy:    'bg-navy-100 text-navy-800',
  gold:    'bg-gold-100 text-gold-800',
  slate:   'bg-slate-100 text-slate-700',
  warm:    'bg-warm-200 text-navy-700',

  // Semantic news-category variants
  award:       'bg-gold-100  text-gold-800',
  publication: 'bg-navy-100  text-navy-800',
  conference:  'bg-slate-100 text-slate-700',
  grant:       'bg-green-50  text-green-800 ring-1 ring-inset ring-green-200',
  media:       'bg-purple-50 text-purple-800 ring-1 ring-inset ring-purple-200',
  teaching:    'bg-sky-50    text-sky-800    ring-1 ring-inset ring-sky-200',
  other:       'bg-warm-100  text-slate-600',
};

const sizes: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[0.7rem]',
  md: 'px-3 py-1   text-xs',
};

type BadgeProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export default function Badge({
  variant = 'slate',
  size = 'md',
  className = '',
  children,
}: BadgeProps) {
  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

export function CategoryBadge({ category }: { category: Variant }) {
  const labels: Partial<Record<Variant, string>> = {
    award:       'Award',
    publication: 'Publication',
    conference:  'Conference',
    grant:       'Grant',
    media:       'Media',
    teaching:    'Teaching',
    other:       'News',
  };
  return (
    <Badge variant={category} size="sm">
      {labels[category] ?? category}
    </Badge>
  );
}
