'use client';
import { shortAddress } from '@/lib/utils/format';
import { useAccount, useDisconnect } from 'wagmi';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Typography from '../typography';
import { ChevronDownIcon, LogOut, Wallet } from 'lucide-react';
import { useLocalization } from '@/i18n/hooks';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function UserInfo() {
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { t } = useLocalization('common');

  const onLogout = () => {
    disconnectAsync();
  };

  const onConnectWallet = () => {
    openConnectModal?.();
  };

  if (!address)
    return (
      <div
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-green-500 px-4 py-2"
        onClick={onConnectWallet}
      >
        <Wallet className="h-4 w-4 text-green-500" />
        <Typography.Caption
          variant="caption_1_regular"
          className="text-green-500"
          text={t('connect_wallet')}
        />
      </div>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-green-500 px-4 py-2">
          <Typography.Caption
            variant="caption_1_regular"
            className="text-green-500"
            text={shortAddress(address || '')}
          />
          <ChevronDownIcon className="h-4 w-4 text-green-500" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-non border border-green-500 bg-black">
        <DropdownMenuItem
          className="hover:bg-transparent hover:text-white focus:bg-transparent focus:text-green-500"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 text-green-500" />
          <Typography.Caption
            text={t('logout')}
            className="cursor-pointer text-green-500 hover:text-white"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
