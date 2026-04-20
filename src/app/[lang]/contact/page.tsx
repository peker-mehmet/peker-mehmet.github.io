import { type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.contact.title };
}

export default async function ContactPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="container-main section">
      <h1 className="section-title">{dict.contact.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4 text-gray-700">
          <div>
            <p className="font-semibold">{dict.contact.email}</p>
            <p>name@university.edu</p>
          </div>
          <div>
            <p className="font-semibold">{dict.contact.office}</p>
            <p>Room 000, Building Name</p>
          </div>
          <div>
            <p className="font-semibold">{dict.contact.address}</p>
            <p>University Name<br />Department Name<br />City, Country</p>
          </div>
        </div>
      </div>
    </div>
  );
}
