/* eslint-disable @typescript-eslint/no-explicit-any */
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { defaultLocale, locales, Namespace, TranslationPath, TranslationParams } from './types';

// create i18next instance for server
const initI18next = async (locale: string, namespaces: string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`),
      ),
    )
    .init({
      lng: locale,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      defaultNS: 'common',
      fallbackNS: 'common',
      ns: namespaces,
      preload: locales,
    });

  return i18nInstance;
};

// Function for server components
export async function getTranslations<N extends Namespace>(
  locale: string,
  namespaceList: N[] = ['common'] as N[],
) {
  const i18nextInstance = await initI18next(
    locale,
    namespaceList.includes('common' as N)
      ? (namespaceList as string[])
      : ([...namespaceList, 'common'] as string[]),
  );

  // Function t() with TypeScript support
  function t<P extends TranslationParams>(key: TranslationPath<N>, params?: P): string {
    return i18nextInstance.t(key as any, params);
  }

  return {
    t,
    i18n: i18nextInstance,
  };
}
