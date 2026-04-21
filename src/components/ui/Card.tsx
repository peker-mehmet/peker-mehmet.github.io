import { type HTMLAttributes } from 'react';

type Variant = 'default' | 'bordered' | 'flat' | 'elevated';

const base = 'bg-card rounded-xl transition-shadow duration-200';

const variants: Record<Variant, string> = {
  default:  'shadow-card border border-warm-200 hover:shadow-card-md',
  bordered: 'border border-slate-200 hover:border-navy-200',
  flat:     'bg-warm-50 border border-warm-200',
  elevated: 'shadow-card-md hover:shadow-card-lg border border-warm-100',
};

type CardProps = Omit<HTMLAttributes<HTMLElement>, 'onToggle'> & {
  variant?: Variant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section' | 'li';
};

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export default function Card({
  variant = 'default',
  padding = 'md',
  as: Tag = 'div',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={`${base} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

export function CardHeader({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`text-slate-600 text-body-sm leading-relaxed ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mt-5 pt-4 border-t border-warm-200 flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardDivider() {
  return <hr className="my-4 border-warm-200" />;
}
