import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.about.title };
}

export default async function AboutPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="container-main section">
      <h1 className="section-title">{dict.about.title}</h1>
      <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
        {dict.about.bio_placeholder}
      </p>
    </div>
  );
}
