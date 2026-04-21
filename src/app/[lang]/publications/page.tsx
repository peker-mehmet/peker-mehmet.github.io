import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig, getPublications } from '@/lib/content';
import { PageTitle } from '@/components/ui/SectionTitle';
import PublicationsClient, { type PubsDict } from '@/components/sections/PublicationsClient';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const [dict, config] = await Promise.all([
    getDictionary(params.lang),
    Promise.resolve(getSiteConfig()),
  ]);
  return {
    title: `${(dict as any).publications.title} — ${config.owner.name.full}`,
    description: config.bio.short[params.lang],
  };
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

  return (
    <>
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
