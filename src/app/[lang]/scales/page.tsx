import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig, getScales } from '@/lib/content';
import { buildPageMetadata, SITE_URL } from '@/lib/metadata';
import { PageTitle } from '@/components/ui/SectionTitle';
import ScalesClient, { type ScalesDict } from '@/components/sections/ScalesClient';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const { lang } = params;
  const title = lang === 'tr' ? 'Ölçekler' : 'Scales & Instruments';
  const description = lang === 'tr'
    ? 'Mehmet Peker tarafından geliştirilen, uyarlanan ve çevrilen psikolojik ölçekler.'
    : 'Psychological scales developed, adapted, and translated by Mehmet Peker.';
  return buildPageMetadata({ lang, path: '/scales', title, description });
}

export default async function ScalesPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, config, scales] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getScales()),
  ]);

  const d = (dict as any).scales as ScalesDict;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: d.title,
    description: lang === 'tr'
      ? 'Mehmet Peker tarafından geliştirilen, uyarlanan ve çevrilen psikolojik ölçekler.'
      : 'Psychological scales developed, adapted, and translated by Mehmet Peker.',
    url: `${SITE_URL}/${lang}/scales`,
    numberOfItems: scales.length,
    itemListElement: scales.map((scale, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${lang}/scales/${scale.id}`,
      name: [scale.abbreviation, scale.name[lang] || scale.name.en].filter(Boolean).join(' — '),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageTitle
        eyebrow={`${config.owner.title[lang]} · ${config.institution.department[lang]}`}
      >
        {d.title}
      </PageTitle>

      <ScalesClient scales={scales} lang={lang} dict={d} />
    </>
  );
}
