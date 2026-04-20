import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.research.title };
}

export default async function ResearchPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="container-main section">
      <h1 className="section-title">{dict.research.title}</h1>
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-semibold mb-4">
          {dict.research.interests_title}
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Research Interest 1</li>
          <li>Research Interest 2</li>
          <li>Research Interest 3</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-serif font-semibold mb-4">
          {dict.research.projects_title}
        </h2>
        <p className="text-gray-500 italic">Projects coming soon.</p>
      </section>
    </div>
  );
}
