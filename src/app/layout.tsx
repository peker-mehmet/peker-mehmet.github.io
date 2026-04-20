import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Academic Website',
  description: 'Personal academic website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
