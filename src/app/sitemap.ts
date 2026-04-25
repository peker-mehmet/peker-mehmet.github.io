import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { getScales } from '@/lib/content';
import { SITE_URL } from '@/lib/metadata';

const STATIC_ROUTES = [
  '',
  '/about',
  '/publications',
  '/scales',
  '/research',
  '/news',
  '/collaborations',
  '/teaching',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  const scaleEntries: MetadataRoute.Sitemap = getScales().flatMap((scale) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/scales/${scale.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...scaleEntries];
}
