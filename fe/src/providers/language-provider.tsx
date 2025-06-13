'use client';

import { useEffect } from 'react';
import { useLocalization } from '@/i18n/hooks';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { currentLocale } = useLocalization();
  useEffect(() => {
    document.documentElement.lang = currentLocale;
  }, [currentLocale]);

  return <>{children}</>;
}
