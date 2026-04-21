'use client';

import { useEffect } from 'react';
import { defaultLocale } from '@/lib/i18n';

export default function RootPage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (
      hash.includes('recovery_token') ||
      hash.includes('invite_token') ||
      hash.includes('confirmation_token')
    ) {
      window.location.href = '/admin/' + hash;
    } else {
      window.location.replace(`/${defaultLocale}/`);
    }
  }, []);

  return null;
}
