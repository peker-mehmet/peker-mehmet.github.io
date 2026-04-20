import { type ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
type Size    = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-medium rounded-md ' +
  'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-gold-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ' +
  'whitespace-nowrap tracking-wide';

const variants: Record<Variant, string> = {
  primary:
    'bg-navy-700 text-white hover:bg-navy-800 active:bg-navy-900 shadow-card hover:shadow-card-md',
  secondary:
    'bg-warm-100 text-navy-700 hover:bg-warm-200 active:bg-warm-300 border border-warm-200',
  outline:
    'border border-navy-700 text-navy-700 bg-transparent hover:bg-navy-50 active:bg-navy-100',
  ghost:
    'bg-transparent text-navy-700 hover:bg-warm-100 active:bg-warm-200',
  gold:
    'bg-gold-400 text-navy-900 hover:bg-gold-500 active:bg-gold-600 shadow-card hover:shadow-card-md font-semibold',
};

const sizes: Record<Size, string> = {
  sm:  'h-8  px-3.5 text-xs  gap-1.5',
  md:  'h-10 px-5   text-sm  gap-2',
  lg:  'h-12 px-7   text-base gap-2.5',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, external, className = '', children, ...props }, ref) => {
    const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
