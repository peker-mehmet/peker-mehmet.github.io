'use client';

import { type Locale } from '@/lib/i18n';
import { type Project } from '@/lib/content';
import ResearchClient, { type ResearchDict } from './ResearchClient';

export type { ResearchDict };

type Props = {
  ongoing: Project[];
  completed: Project[];
  lang: Locale;
  dict: ResearchDict;
};

export default function ProjectsTab({ ongoing, completed, lang, dict }: Props) {
  return (
    <ResearchClient
      ongoing={ongoing}
      completed={completed}
      lang={lang}
      dict={dict}
    />
  );
}
