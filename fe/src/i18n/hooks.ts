/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback } from 'react';
import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, Namespace, TranslationParams } from './types';

export function useTranslation<N extends Namespace>(namespace: N | N[] = 'common' as N) {
  const { t, i18n, ...rest } = useTranslationOriginal(namespace);

  // Function for TypeScript support
  const translate = useCallback(
    <P extends TranslationParams>(key: string, params?: P): string => {
      return t(key, params);
    },
    [t],
  );

  // Function to change language
  const changeLanguage = useCallback(
    async (locale: Locale) => {
      await i18n.changeLanguage(locale);
    },
    [i18n],
  );

  // Check if key exists
  const exists = useCallback(
    (key: string): boolean => {
      return i18n.exists(key);
    },
    [i18n],
  );

  return {
    t: translate,
    i18n,
    changeLanguage,
    exists,
    ...rest,
  };
}

// Custom hook for localized routes
export function useLocalizedRoutes() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] as Locale;

  const switchLocale = useCallback(
    async (locale: Locale) => {
      if (locale === currentLocale) return;

      const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
      await router.push(newPath);
    },
    [currentLocale, pathname, router],
  );

  const navigateTo = useCallback(
    async (path: string, locale: Locale = currentLocale) => {
      const localePath = path.startsWith('/') ? `/${locale}${path}` : `/${locale}/${path}`;
      await router.push(localePath);
    },
    [currentLocale, router],
  );

  return {
    currentLocale,
    switchLocale,
    navigateTo,
  };
}

type TranslationFunction = <P extends TranslationParams>(key: string, params?: P) => string;

export function useLocalization<N extends Namespace>(namespace: N | N[] = 'common' as N) {
  const translation = useTranslation(namespace);
  const localizedRoutes = useLocalizedRoutes();

  // Wrapper for switchLocale that also changes i18n language
  const switchLocale = useCallback(
    async (locale: Locale) => {
      await translation.changeLanguage(locale);
      await localizedRoutes.switchLocale(locale);
    },
    [translation, localizedRoutes],
  );

  return {
    ...translation,
    ...localizedRoutes,
    switchLocale,
    t: translation.t as TranslationFunction,
  };
}
