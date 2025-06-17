import { AppButton, AppInput } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import useDeposit from '@/features/accounts/hooks/contracts/use-deposit';
import useNativeChain from '@/lib/hooks/use-native-chain';
import { useLocalization } from '@/i18n/hooks';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import useToast from '@/lib/hooks/use-toast';
import { Trans } from 'react-i18next';

interface AddDepositStepProps {
  accId: number;
  onSuccess: () => void;
}

export default function AddDepositStep({ accId, onSuccess }: AddDepositStepProps) {
  const { t } = useLocalization('common');
  const { toastError } = useToast();
  const [amount, setAmount] = useState<string>('');

  const { deposit, isPending: isDepositPending } = useDeposit();
  const { balanceValue, onRefetchBalance } = useNativeChain();

  const handleDeposit = async () => {
    try {
      await deposit({ accId, amount: Number(amount) });
      await onRefetchBalance();
      onSuccess();
    } catch (ex) {
      console.log(ex);
      toastError(t('error_deposit'));
    }
  };

  const onMax = () => {
    setAmount(balanceValue.toString());
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setAmount(value);
  };

  return (
    <>
      <div className="flex flex-col gap-4 px-4">
        <Typography.Headline
          variant="h6"
          text={t('create_account_sheet.add_deposit')}
          className="text-white-80"
        />
        <Typography.Body
          variant="14_regular"
          className="text-white-80"
          text={t('create_account_sheet.deposit_description')}
        />
        <Typography.Caption
          variant="caption_1_regular"
          className="text-white-60"
          text={t('create_account_sheet.your_balance', {
            balanceValue: Number(balanceValue).toFixed(4),
          })}
        />
        <div className="relative flex w-full">
          <AppInput
            placeholder={t('create_account_sheet.enter_amount')}
            value={amount || ''}
            onChange={onInputChange}
            inputClassName="!bg-transparent"
            className="rounded-[5px] border border-green-500"
          />

          <Typography.Caption
            variant="caption_1_regular"
            className="text-white-60 absolute top-1/2 right-4 bottom-0 my-auto -translate-y-1/2 cursor-pointer"
            text={t('create_account_sheet.max')}
            onClick={onMax}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-1 px-4">
        <AppButton
          variant="primary"
          text={t('create_account_sheet.add_deposit')}
          iconRight={<ChevronRight className="size-6" />}
          onClick={handleDeposit}
          isLoading={isDepositPending}
        />
      </div>
    </>
  );
}
