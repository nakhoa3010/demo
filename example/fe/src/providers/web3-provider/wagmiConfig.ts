'use client';
import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'viem/chains';
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { APP_NAME } from '@/lib/constans';

const projectId = 'c8c689289f7b3547fc20222dfa21f7d2';
const chains = [base, baseSepolia] as const;
export type ValidChainId = (typeof chains)[number]['id'] | undefined;

export const initialChainId =
  process.env.NEXT_PUBLIC_IS_MAINNET === 'true' ? base.id : baseSepolia.id;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, walletConnectWallet, metaMaskWallet, injectedWallet],
    },
  ],
  {
    appName: APP_NAME,
    projectId,
  },
);
export const wagmiCustomConfig = createConfig({
  connectors,
  chains,
  client: ({ chain }) =>
    createPublicClient({
      chain,
      transport: http(),
    }),
  ssr: true,
});
export const wagmiConfig = getDefaultConfig({
  appName: APP_NAME,
  projectId,
  chains,
  ssr: true,
});
