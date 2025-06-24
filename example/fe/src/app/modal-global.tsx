'use client';

import { useAtom } from 'jotai';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadingModalAtom } from '@/features/common/store/loading-atom';
import Typography from '@/components/shared-components/typography';

export default function ModalGlobal() {
  const [loadingModal] = useAtom(loadingModalAtom);

  return (
    <Dialog open={loadingModal.isOpen} onOpenChange={() => {}}>
      <DialogContent
        className={cn(
          'shadow-07 border-0 bg-neutral-50 backdrop-blur-sm sm:max-w-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        )}
        hideCloseButton={true}
      >
        <DialogTitle className="sr-only">Loading</DialogTitle>
        <div className="flex flex-col items-center justify-center px-4 py-8">
          <div className="relative mb-6">
            <Loader2 className="h-12 w-12 animate-spin text-neutral-700" />
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-600/20"></div>
          </div>

          <div className="text-center">
            <Typography.Body
              variant="12_regular"
              text={loadingModal.message}
              className="text-neutral-500"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
