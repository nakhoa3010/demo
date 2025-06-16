import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from 'react';
import '../styles/globals.css';
import { defaultLocale } from '@/i18n/types';
import { LanguageProvider } from '@/providers/language-provider';
import JotaiProvider from '@/providers/jotai-provider';
import { Toaster } from '@/components/ui/sonner';
import { Web3Provider } from '@/providers/web3-provider';

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
        <Web3Provider>
          <JotaiProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </JotaiProvider>
        </Web3Provider>
        <Toaster richColors />
      </body>
    </html>
  );
}
