import type { Metadata } from 'next';
import type { Locale } from './i18n';

export const SITE_URL = 'https://peker-mehmet.github.io';
export const SITE_NAME = 'Mehmet Peker';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/profile.jpg`;

/**
 * Build a full Metadata object for a given page.
 * `path` is the part after the locale segment, e.g. '' | '/about' | '/publications'
 */
export function buildPageMetadata({
  lang,
  path,
  title,
  description,
  image,
  type = 'website',
}: {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'profile' | 'article';
}): Metadata {
  const canonicalUrl = `${SITE_URL}/${lang}${path}`;
  const altLang: Locale = lang === 'tr' ? 'en' : 'tr';
  const altUrl = `${SITE_URL}/${altLang}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  const ogLocale = lang === 'tr' ? 'tr_TR' : 'en_US';
  const ogAltLocale = lang === 'tr' ? 'en_US' : 'tr_TR';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [lang]:    canonicalUrl,
        [altLang]: altUrl,
        'x-default': `${SITE_URL}/tr${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: ogLocale,
      alternateLocale: [ogAltLocale],
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Build the Person JSON-LD schema for homepage / about page. */
export function personJsonLd({
  name,
  jobTitle,
  affiliation,
  url,
  sameAs,
  image,
}: {
  name: string;
  jobTitle: string;
  affiliation: string;
  url: string;
  sameAs: string[];
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    jobTitle,
    affiliation: { '@type': 'Organization', name: affiliation },
    image: image || DEFAULT_OG_IMAGE,
    sameAs: sameAs.filter(Boolean),
  };
}
