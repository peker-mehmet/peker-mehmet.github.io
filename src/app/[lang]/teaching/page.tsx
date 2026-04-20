import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.teaching.title };
}

export default async function TeachingPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="container-main section">
      <h1 className="section-title">{dict.teaching.title}</h1>
      <section>
        <h2 className="text-2xl font-serif font-semibold mb-4">
          {dict.teaching.courses_title}
        </h2>
        <p className="text-gray-500 italic">Course list coming soon.</p>
      </section>
    </div>
  );
}
