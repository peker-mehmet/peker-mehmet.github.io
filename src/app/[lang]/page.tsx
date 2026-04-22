import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import {
  getSiteConfig,
  getPublications,
  getScales,
  getNewsItems,
} from '@/lib/content';
import { buildPageMetadata, personJsonLd, SITE_URL } from '@/lib/metadata';

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
  const { lang } = params;
  const config = getSiteConfig();

  const pageTitle = lang === 'tr'
    ? `${config.owner.name.full} | Psikoloji`
    : `${config.owner.name.full} | Psychology`;

  const ogTitle = lang === 'tr'
    ? 'Mehmet Peker | Psikolog ve Doçent, Ege Üniversitesi'
    : 'Mehmet Peker | Psychologist & Associate Professor';

  const ogDescription = lang === 'tr'
    ? 'Ege Üniversitesi Psikoloji Bölümü Doçenti. Duygusal emek, öz-düzenleme ve çalışan iyi oluşu alanlarında araştırmalar. Ölçekler ve yayınlar açık erişimde.'
    : 'Associate Professor at Ege University. Researching emotional labor, self-regulation, and employee well-being. Scales, publications, and resources shared openly.';

  return {
    ...buildPageMetadata({
      lang,
      path: '',
      title: pageTitle,
      description: config.bio.short[lang],
      ogTitle,
      ogDescription,
      type: 'profile',
    }),
    title: { absolute: pageTitle },
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

  const jsonLd = personJsonLd({
    name: config.owner.name.full,
    jobTitle: config.owner.title.en,
    affiliation: config.institution.name.en,
    url: SITE_URL,
    image: config.photo.profile || undefined,
    sameAs: [config.links.google_scholar, config.links.orcid, config.links.researchgate].filter(Boolean),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
