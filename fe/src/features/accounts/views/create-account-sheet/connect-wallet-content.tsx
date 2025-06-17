import { AppButton } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useLocalization } from '@/i18n/hooks';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
import React from 'react';

interface ConnectWalletContentProps {
  onClose?: () => void;
}
export default function ConnectWalletContent({ onClose }: ConnectWalletContentProps) {
  const { t } = useLocalization();
  const { openConnectModal } = useConnectModal();

  const onHandleConnect = () => {
    openConnectModal?.();
    onClose?.();
  };

  return (
    <>
      <SheetHeader>
        <div className="rounded-12 bg-5 flex w-fit items-center justify-center border border-green-300 p-2">
          <Wallet className="size-8 text-green-300" />
        </div>
        <SheetTitle />
        <Typography.Headline
          variant="h6"
          text={t('connect_your_wallet')}
          className="text-white-80"
        />
        <SheetDescription>
          <Typography.Body
            variant="16_regular"
            className="text-white-80"
            text={t('connect_wallet_description')}
          />
        </SheetDescription>
      </SheetHeader>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <AppButton
          variant="secondary-gray"
          text={t('connect_wallet')}
          className="hover:border-white-90 hover:text-white-90"
          onClick={onHandleConnect}
        />
      </div>
    </>
  );
}
