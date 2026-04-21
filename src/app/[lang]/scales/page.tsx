import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig, getScales } from '@/lib/content';
import { PageTitle } from '@/components/ui/SectionTitle';
import ScalesClient, { type ScalesDict } from '@/components/sections/ScalesClient';

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
    title: `${(dict as any).scales.title} — ${config.owner.name.full}`,
    description: config.bio.short[params.lang],
  };
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

  return (
    <>
      <PageTitle
        eyebrow={`${config.owner.title[lang]} · ${config.institution.department[lang]}`}
      >
        {d.title}
      </PageTitle>

      <ScalesClient scales={scales} lang={lang} dict={d} />
    </>
  );
}
