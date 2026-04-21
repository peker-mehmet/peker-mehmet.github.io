import type { Metadata } from 'next';
import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig, getProjects } from '@/lib/content';
import { PageTitle } from '@/components/ui/SectionTitle';
import ResearchClient, { type ResearchDict } from '@/components/sections/ResearchClient';

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
    title: `${(dict as any).research.title} — ${config.owner.name.full}`,
    description: config.bio.short[params.lang],
  };
}

export default async function ResearchPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const lang = params.lang;

  const [dict, config, projects] = await Promise.all([
    getDictionary(lang),
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getProjects()),
  ]);

  const d = (dict as any).research as ResearchDict;

  const ongoing   = projects.filter((p) => p.status === 'active' || p.status === 'planned');
  const completed = projects.filter((p) => p.status === 'completed');

  return (
    <>
      <PageTitle
        eyebrow={`${config.owner.title[lang]} · ${config.institution.department[lang]}`}
      >
        {d.title}
      </PageTitle>

      <ResearchClient
        ongoing={ongoing}
        completed={completed}
        lang={lang}
        dict={d}
      />
    </>
  );
}
