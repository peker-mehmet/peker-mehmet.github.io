import { type Locale } from '@/lib/i18n';
import Button from '@/components/ui/Button';

type Dict = {
  home: {
    greeting: string;
    role: string;
    tagline: string;
    cta_research: string;
    cta_contact: string;
  };
};

export default function Hero({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <section className="bg-white border-b border-warm-200">
      <div className="container-main section flex flex-col items-center text-center gap-8">

        {/* Avatar placeholder */}
        <div className="relative">
          <div className="w-36 h-36 rounded-full bg-warm-100 border-4 border-warm-200 shadow-card-md overflow-hidden flex items-center justify-center">
            <span className="font-display text-5xl text-navy-300 select-none">&#9671;</span>
          </div>
          {/* Gold ring accent */}
          <div className="absolute inset-0 rounded-full ring-2 ring-gold-400/30 ring-offset-4 ring-offset-white" />
        </div>

        {/* Text block */}
        <div className="max-w-2xl">
          <p className="font-body text-label uppercase tracking-widest text-gold-600 font-semibold mb-3">
            {dict.home.greeting}
          </p>
          <h1 className="font-display text-display text-navy-700 font-semibold mb-3">
            Your Name
          </h1>
          <p className="font-body text-subtitle text-slate-500 font-medium mb-5">
            {dict.home.role}
          </p>

          {/* Gold rule */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-1.5">
              <div className="h-px w-10 bg-gold-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <div className="h-px w-5 bg-gold-200" />
            </div>
          </div>

          <p className="font-body text-body text-slate-600 leading-relaxed">
            {dict.home.tagline}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button href={`/${lang}/publications`} variant="primary" size="lg">
            {dict.home.cta_research}
          </Button>
          <Button href={`/${lang}/contact`} variant="outline" size="lg">
            {dict.home.cta_contact}
          </Button>
        </div>

      </div>
    </section>
  );
}
