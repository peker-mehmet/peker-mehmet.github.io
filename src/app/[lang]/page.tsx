import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import {
  getSiteConfig,
  getPublications,
  getScales,
  getNewsItems,
} from '@/lib/content';

import HeroSection        from '@/components/sections/HeroSection';
import ResearchInterests  from '@/components/sections/ResearchInterests';
import Highlights         from '@/components/sections/Highlights';
import NewsSection        from '@/components/sections/NewsSection';
import SocialBar          from '@/components/sections/SocialBar';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const [dict, config] = [await getDictionary(params.lang), getSiteConfig()];
  const isDefault = config.owner.name.full === 'Your Full Name';
  return {
    title: isDefault ? dict.nav.site_name : config.owner.name.full,
    description: config.bio.short[params.lang],
  };
}

export default async function HomePage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, config, publications, scales, news] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getPublications()),
    Promise.resolve(getScales()),
    Promise.resolve(getNewsItems()),
  ]);

  return (
    <>
      {/* 1 ── Hero */}
      <HeroSection lang={lang} config={config} dict={dict} />

      {/* 2 ── Research Interests */}
      <ResearchInterests lang={lang} config={config} dict={dict} />

      {/* 3 ── Recent Highlights: publications + scales */}
      <Highlights
        lang={lang}
        publications={publications}
        scales={scales}
        dict={dict}
      />

      {/* 4 ── Latest News */}
      <NewsSection lang={lang} news={news} dict={dict} />

      {/* 5 ── Social / Connect bar */}
      <SocialBar lang={lang} config={config} dict={dict} />
    </>
  );
}
