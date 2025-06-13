import { AppButton } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Wallet } from 'lucide-react';
import React from 'react';

export default function ConnectWalletContent() {
  return (
    <>
      <SheetHeader>
        <div className="rounded-12 border-white-10 bg-5 flex w-fit items-center justify-center border p-2">
          <Wallet className="text-white-80 size-10" />
        </div>
        <SheetTitle />
        <Typography.Headline variant="h6" text="Connect your wallet" className="text-white-80" />
        <SheetDescription>
          <Typography.Body
            variant="16_regular"
            className="text-white-80"
            text="To use Orakl Network services, you need to connect to your wallet first."
          />
        </SheetDescription>
      </SheetHeader>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <AppButton
          variant="secondary-gray"
          text="Connect Wallet"
          className="hover:border-white-90 hover:text-white-90"
        />
      </div>
    </>
  );
}
