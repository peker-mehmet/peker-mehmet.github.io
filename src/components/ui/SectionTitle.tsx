type Level = 'h1' | 'h2' | 'h3';
type Align = 'left' | 'center';

type SectionTitleProps = {
  as?: Level;
  align?: Align;
  eyebrow?: string;
  subtitle?: string;
  accent?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export default function SectionTitle({
  as: Tag = 'h2',
  align = 'left',
  eyebrow,
  subtitle,
  accent = true,
  id,
  className = '',
  children,
}: SectionTitleProps) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-10 ${isCenter ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className="font-body text-label uppercase tracking-widest text-gold-600 font-semibold mb-2">
          {eyebrow}
        </p>
      )}

      <Tag
        id={id}
        className={`font-display text-navy-700 font-semibold leading-tight
          ${Tag === 'h1' ? 'text-display' : Tag === 'h2' ? 'text-headline' : 'text-title'}`}
      >
        {children}
      </Tag>

      {accent && (
        <div className={`mt-4 flex ${isCenter ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-1.5">
            <div className="h-px w-12 bg-gold-400" />
            <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            <div className="h-px w-6 bg-gold-200" />
          </div>
        </div>
      )}

      {subtitle && (
        <p className={`mt-4 text-slate-500 text-subtitle leading-relaxed
          ${isCenter ? 'mx-auto max-w-prose-narrow' : 'max-w-prose'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Page title variant — used at the top of each page ────────────────────────

export function PageTitle({
  eyebrow,
  subtitle,
  children,
}: {
  eyebrow?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-warm-200 bg-white py-12">
      <div className="container-main">
        <SectionTitle as="h1" eyebrow={eyebrow} subtitle={subtitle} accent>
          {children}
        </SectionTitle>
      </div>
    </div>
  );
}
