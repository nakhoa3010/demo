import { AppButton, AppInput } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { useLocalization } from '@/i18n/hooks';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import useToast from '@/lib/hooks/use-toast';
import useAddConsumer from '@/features/accounts/hooks/contracts/use-add-consumer';
import useAddConsumerApi from '@/features/accounts/hooks/apis/use-add-consumer';

interface AddConsumerStepProps {
  accId: number;
  onSuccess: () => void;
}

export default function AddConsumerStep({ accId, onSuccess }: AddConsumerStepProps) {
  const { t } = useLocalization();
  const { toastError, toastSuccess } = useToast();
  const [consumerAddress, setConsumerAddress] = useState<string>('');

  const { addConsumer, isConsumerPending } = useAddConsumer();
  const { addConsumerApi } = useAddConsumerApi();

  const handleAddConsumer = async () => {
    try {
      const txHash = await addConsumer({ accId, consumerAddress });
      await addConsumerApi({ txHash });
      setConsumerAddress('');
      toastSuccess(t('create_account_sheet.success_add_consumer'));
      onSuccess();
    } catch (ex) {
      toastError(t('create_account_sheet.error_add_consumer'));
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 px-4">
        <Typography.Headline
          variant="h6"
          text={t('create_account_sheet.add_consumer')}
          className="text-white-80"
        />
        <Typography.Body
          variant="14_regular"
          className="text-white-80"
          text={t('create_account_sheet.consumer_description')}
        />

        <AppInput
          placeholder={t('create_account_sheet.consumer_placeholder')}
          value={consumerAddress}
          onChange={(e) => setConsumerAddress(e.target.value)}
          inputClassName="!bg-transparent"
          className="rounded-[5px] border border-green-500"
          required={isConsumerPending}
        />
      </div>
      <div className="mt-5 flex flex-col gap-1 px-4">
        <AppButton
          variant="primary"
          text={t('create_account_sheet.add_consumer')}
          iconRight={<ChevronRight className="size-6" />}
          isLoading={isConsumerPending}
          onClick={handleAddConsumer}
        />
      </div>
    </>
  );
}
