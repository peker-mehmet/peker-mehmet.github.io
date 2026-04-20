import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.scales.title };
}

export default async function ScalesPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="container-main section">
      <h1 className="section-title">{dict.scales.title}</h1>
      <p className="text-slate-500 italic">Scale entries coming soon.</p>
    </div>
  );
}
