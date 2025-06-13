import { ReactNode } from 'react';
import '../styles/globals.css';
import { defaultLocale } from '@/i18n/types';
import { LanguageProvider } from '@/providers/language-provider';
import JotaiProvider from '@/providers/jotai-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html suppressHydrationWarning lang={locale || defaultLocale}>
      <body suppressHydrationWarning>
        <QueryProvider>
          <JotaiProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </JotaiProvider>
        </QueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
