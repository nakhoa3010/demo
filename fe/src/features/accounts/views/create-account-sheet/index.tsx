import { SheetContent, Sheet } from '@/components/ui/sheet';
import React from 'react';
import ConnectWalletContent from './connect-wallet-content';
import CreateAccountContent from './create-account-content';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAccount } from 'wagmi';

type StepValue = 'CREATE_ACCOUNT' | 'ADD_DEPOSIT' | 'ADD_CONSUMER';

interface CreateAccountSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accIdValue?: number;
  stepTo?: StepValue;
}

export default function CreateAccountSheet({
  open,
  onOpenChange,
  accIdValue,
  stepTo,
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
              onDoItLater={() => onOpenChange?.(false)}
              accIdValue={accIdValue}
              stepTo={stepTo}
            />
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
