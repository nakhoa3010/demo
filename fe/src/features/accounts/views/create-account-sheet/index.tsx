import { SheetContent, Sheet } from '@/components/ui/sheet';
import React from 'react';
import ConnectWalletContent from './connect-wallet-content';
import CreateAccountContent from './create-account-content';

interface CreateAccountSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CreateAccountSheet({ open, onOpenChange }: CreateAccountSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-black-80 max-w-[400px] py-5">
        <ConnectWalletContent />
        <CreateAccountContent />
      </SheetContent>
    </Sheet>
  );
}
