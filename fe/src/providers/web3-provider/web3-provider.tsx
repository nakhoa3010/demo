'use client';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { initialChainId, wagmiCustomConfig } from './wagmiConfig';
import { QueryProvider } from '../query-provider';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiCustomConfig}>
      <QueryProvider>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()} initialChain={initialChainId}>
          {children}
        </RainbowKitProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}
