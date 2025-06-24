import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from 'react';
import '../styles/globals.css';
import JotaiProvider from '@/providers/jotai-provider';
import { Toaster } from '@/components/ui/sonner';
import { Web3Provider } from '@/providers/web3-provider';
import Header from './layout/header';

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning>
        <Web3Provider>
          <JotaiProvider>
            <div className="flex flex-col">
              <Header />
              {children}
            </div>
          </JotaiProvider>
        </Web3Provider>
        <Toaster richColors />
      </body>
    </html>
  );
}
