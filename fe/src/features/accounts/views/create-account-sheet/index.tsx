import { SheetContent, Sheet } from '@/components/ui/sheet';
import React from 'react';
import ConnectWalletContent from './connect-wallet-content';
import CreateAccountContent from './create-account-content';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateAccountSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CreateAccountSheet({ open, onOpenChange }: CreateAccountSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-black-90 max-w-[400px] py-5">
        <ScrollArea className="h-full">
          <ConnectWalletContent />
          <CreateAccountContent onDoItLater={() => onOpenChange?.(false)} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
