import { ReactNode } from 'react';
import { defaultLocale, Locale, locales } from '@/i18n/types';
import { I18nProvider } from '@/providers/i18n-provider';
import ModalGlobal from './modal-global';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  return (
    <I18nProvider locale={validLocale}>
      <div className="flex flex-col">
        {children}
        <ModalGlobal />
      </div>
    </I18nProvider>
  );
}
