'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Locale } from '@/lib/i18n';

export default function ResearchRedirectPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${params.lang}/publications?tab=projects`);
  }, [router, params.lang]);
  return null;
}
