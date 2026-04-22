import type { Metadata } from 'next';
import './globals.css';
import { SITE_URL } from '@/lib/metadata';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: '4vFfjVKssUHROved4rjw86ip05m_nUASmWoy6vjAgxY',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
