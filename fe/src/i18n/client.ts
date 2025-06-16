/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {
  defaultLocale,
  locales,
  Namespace,
  TranslationPath,
  TranslationParams,
  namespaces,
} from './types';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    defaultNS: 'common',
    ns: namespaces,
    fallbackNS: 'common',
  });

export function useTranslation<N extends Namespace>(namespace: N | N[] = 'common' as N) {
  const { t } = useTranslationOrg(namespace);

  function typedT<P extends TranslationParams>(
    key: TranslationPath<N extends Array<infer AN> ? AN : N>,
    params?: P,
  ): string {
    return t(key, params);
  }

  return { t: typedT };
}

export default i18next;
