import type { Metadata } from 'next';
import { Crimson_Pro, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales, isValidLocale, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { getSiteConfig } from '@/lib/content';
import { DEFAULT_OG_IMAGE } from '@/lib/metadata';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const [dict, config] = await Promise.all([
    getDictionary(params.lang),
    Promise.resolve(getSiteConfig()),
  ]);
  const ogImage = config.photo.profile || DEFAULT_OG_IMAGE;
  return {
    title: {
      template: `%s | ${dict.nav.site_name}`,
      default: dict.nav.site_name,
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    openGraph: {
      siteName: dict.nav.site_name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImage],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isValidLocale(params.lang)) notFound();

  const dict = await getDictionary(params.lang as Locale);

  return (
    <html
      id="top"
      lang={params.lang}
      className={`${crimsonPro.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-site">
        <GoogleAnalytics />
        <Navbar lang={params.lang as Locale} dict={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer lang={params.lang as Locale} dict={dict} />
      </body>
    </html>
  );
}
