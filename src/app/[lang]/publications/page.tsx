import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.publications.title };
}

export default async function PublicationsPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="container-main section">
      <h1 className="section-title">{dict.publications.title}</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-serif font-semibold mb-4">
          {dict.publications.journal}
        </h2>
        <p className="text-gray-500 italic">No articles listed yet.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-serif font-semibold mb-4">
          {dict.publications.conference}
        </h2>
        <p className="text-gray-500 italic">No papers listed yet.</p>
      </section>

      <section>
        <h2 className="text-2xl font-serif font-semibold mb-4">
          {dict.publications.book}
        </h2>
        <p className="text-gray-500 italic">No books listed yet.</p>
      </section>
    </div>
  );
}
