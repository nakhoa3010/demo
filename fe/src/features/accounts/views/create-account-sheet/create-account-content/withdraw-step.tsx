import { AppButton, AppInput } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import useNativeChain from '@/lib/hooks/use-native-chain';
import { useLocalization } from '@/i18n/hooks';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import useToast from '@/lib/hooks/use-toast';
import useWithdraw from '@/features/accounts/hooks/contracts/use-withdraw';

interface WithdrawStepProps {
  accountBalance?: number;
  accId: number;
  onSuccess: () => void;
}

export default function WithdrawStep({ accId, accountBalance, onSuccess }: WithdrawStepProps) {
  const { t } = useLocalization('common');
  const { toastError } = useToast();
  const [amount, setAmount] = useState<string>('');

  const { withdraw, isPending: isWithdrawPending } = useWithdraw();
  const { onRefetchBalance } = useNativeChain();

  const handleWithdraw = async () => {
    try {
      await withdraw({ accId, amount: Number(amount) });
      await onRefetchBalance();
      onSuccess();
    } catch (ex) {
      console.log(ex);
      toastError(t('error_deposit'));
    }
  };

  const onMax = () => {
    setAmount(accountBalance?.toString() || '0');
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
          text={t('create_account_sheet.withdraw_title')}
          className="text-white-80"
        />
        <Typography.Body
          variant="14_regular"
          className="text-white-80"
          text={t('create_account_sheet.withdraw_description')}
        />
        <Typography.Caption
          variant="caption_1_regular"
          className="text-white-60"
          text={t('create_account_sheet.withdraw_balance', {
            balanceValue: Number(accountBalance).toFixed(4),
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
          text={t('create_account_sheet.withdraw')}
          iconRight={<ChevronRight className="size-6" />}
          onClick={handleWithdraw}
          isLoading={isWithdrawPending}
        />
      </div>
    </>
  );
}
