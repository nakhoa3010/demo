export const defaultLocale = 'en';
export const locales = ['en', 'vi'] as const;
export type Locale = (typeof locales)[number]; // union type: 'vi' | 'en'

export const namespaces = ['common', 'error', 'validate'] as const;
export type Namespace = (typeof namespaces)[number]; // union type: 'common' | 'auth' | ..

export const languageNames: Record<Locale, string> = {
  vi: 'Việt Nam',
  en: 'English',
};

export interface Resources {
  common: typeof import('./locales/en/common.json');
  error: typeof import('./locales/en/error.json');
  validate: typeof import('./locales/en/validate.json');
}

export type TranslationPath<N extends Namespace> = FlattenObjectKeys<Resources[N]>;

type FlattenObjectKeys<T extends object> = {
  [K in keyof T & string]: T[K] extends object ? `${K}.${FlattenObjectKeys<T[K]>}` : K;
}[keyof T & string];

// Type for translation parameters
export type TranslationParams = {
  [key: string]: string | number | boolean | null | undefined | TranslationParams;
};
