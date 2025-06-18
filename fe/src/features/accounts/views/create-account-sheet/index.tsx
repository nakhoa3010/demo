import { SheetContent, Sheet } from '@/components/ui/sheet';
import React from 'react';
import ConnectWalletContent from './connect-wallet-content';
import CreateAccountContent, { StepValue } from './create-account-content';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAccount } from 'wagmi';

interface CreateAccountSheetProps {
  open?: boolean;
  accIdValue?: number;
  stepTo?: StepValue;
  isAutoGoNext?: boolean;
  accountBalance?: number;
  onCallBack?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export default function CreateAccountSheet({
  open,
  onOpenChange,
  accIdValue,
  stepTo,
  isAutoGoNext = true,
  accountBalance,
  onCallBack,
}: CreateAccountSheetProps) {
  const { address } = useAccount();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="bg-black-90 max-w-[400px] py-5"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <ScrollArea className="h-full">
          {!address && <ConnectWalletContent onClose={() => onOpenChange?.(false)} />}
          {address && (
            <CreateAccountContent
              address={address}
              accIdValue={accIdValue}
              stepTo={stepTo}
              isAutoGoNext={isAutoGoNext}
              accountBalance={accountBalance}
              onCallBack={onCallBack}
              onDoItLater={() => onOpenChange?.(false)}
            />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
