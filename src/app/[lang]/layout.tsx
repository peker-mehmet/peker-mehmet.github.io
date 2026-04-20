import type { Metadata } from 'next';
import { Crimson_Pro, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales, isValidLocale, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
  const dict = await getDictionary(params.lang);
  return {
    title: {
      template: `%s | ${dict.nav.site_name}`,
      default: dict.nav.site_name,
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
        <Navbar lang={params.lang as Locale} dict={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer lang={params.lang as Locale} dict={dict} />
      </body>
    </html>
  );
}
