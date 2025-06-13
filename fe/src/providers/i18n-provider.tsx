// src/providers/i18n-provider.tsx
'use client';

import { PropsWithChildren, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/i18n/client';
import { Locale } from '@/i18n/types';

export function I18nProvider({ children, locale }: PropsWithChildren<{ locale: Locale }>) {
  useEffect(() => {
    if (i18next.language !== locale) {
      i18next.changeLanguage(locale);
    }
  }, [locale]);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
