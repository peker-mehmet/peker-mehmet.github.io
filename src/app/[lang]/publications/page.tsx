import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig, getPublications } from '@/lib/content';
import { buildPageMetadata } from '@/lib/metadata';
import { PageTitle } from '@/components/ui/SectionTitle';
import PublicationsClient, { type PubsDict } from '@/components/sections/PublicationsClient';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const { lang } = params;
  const title = lang === 'tr' ? 'Bilimsel Çalışmalar' : 'Research Output';
  const description = lang === 'tr'
    ? 'Mehmet Peker\'in hakemli dergi makaleleri, kitap bölümleri, konferans bildirileri, davetli konuşmaları ve sunumları.'
    : 'Peer-reviewed journal articles, book chapters, conference papers, invited talks, and presentations by Mehmet Peker.';
  return buildPageMetadata({ lang, path: '/publications', title, description });
}

export default async function PublicationsPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, config, publications] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getPublications()),
  ]);

  const d = (dict as any).publications as PubsDict;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: d.title,
    numberOfItems: publications.length,
    itemListElement: publications.slice(0, 20).map((pub, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'ScholarlyArticle',
        name: pub.title.en || pub.title.tr,
        author: pub.authors.map((a) => ({ '@type': 'Person', name: a })),
        datePublished: String(pub.year),
        ...(pub.doi ? { identifier: `https://doi.org/${pub.doi}` } : {}),
        ...(pub.journal ? { isPartOf: { '@type': 'Periodical', name: pub.journal } } : {}),
      },
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

      <PublicationsClient
        publications={publications}
        lang={lang}
        ownerName={config.owner.name.full}
        dict={d}
      />
    </>
  );
}
