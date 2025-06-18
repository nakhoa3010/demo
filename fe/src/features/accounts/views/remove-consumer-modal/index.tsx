import { AppButton } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/hooks';
import { cn } from '@/lib/utils';
import { Trash2, UserRoundX, X } from 'lucide-react';
import React from 'react';
import useRemoveConsumer from '../../hooks/contracts/use-remove-consumer';
import useToast from '@/lib/hooks/use-toast';
import useRemoveConsumerApi from '../../hooks/apis/use-remove-consumer';

interface RemoveConsumerModalProps {
  open: boolean;
  accId: number;
  consumerAddress: string;
  onOpenChange: (open: boolean) => void;
  onCallBack?: () => void;
}

export default function RemoveConsumerModal({
  open,
  accId,
  consumerAddress,
  onOpenChange,
  onCallBack,
}: RemoveConsumerModalProps) {
  const { t } = useLocalization('common');
  const { toastSuccess, toastError } = useToast();

  const { removeConsumer, isRemoveConsumerPending } = useRemoveConsumer();
  const { removeConsumerApi } = useRemoveConsumerApi();

  const onRemoveConsumer = async () => {
    try {
      const hash = await removeConsumer({ accId, consumerAddress });
      await removeConsumerApi({ txHash: hash });
      toastSuccess(t('remove_consumer_modal.remove_consumer_success'));
      onOpenChange(false);
      onCallBack?.();
    } catch (error) {
      console.error(error);
      toastError(t('remove_consumer_modal.remove_consumer_error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'shadow-07 border-green-500 bg-neutral-900 backdrop-blur-sm sm:max-w-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        )}
        hideCloseButton={true}
      >
        <DialogTitle className="sr-only">{t('remove_consumer_modal.title')}</DialogTitle>
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-8">
          <UserRoundX className="size-15 text-green-500" />
          <Typography.Headline
            variant="h6"
            text={t('remove_consumer_modal.title')}
            className="text-white"
          />
          <Typography.Body
            variant="14_regular"
            text={t('remove_consumer_modal.description')}
            className="text-white-70"
          />
          <div className="flex w-full items-center gap-4">
            <div className="flex-1">
              <AppButton
                iconLeft={<Trash2 className="size-4" />}
                text={t('remove_consumer_modal.remove')}
                variant="secondary-gray"
                size="40"
                className="w-full"
                onClick={onRemoveConsumer}
                isLoading={isRemoveConsumerPending}
              />
            </div>
            <div className="flex-1">
              <AppButton
                iconLeft={<X className="size-4" />}
                text={t('remove_consumer_modal.cancel')}
                size="40"
                className="w-full"
                onClick={() => onOpenChange(false)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
