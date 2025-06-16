import { AppButton, AppCard } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import useCreateAccountApi from '@/features/accounts/hooks/apis/use-create-account-api';
import useCreateAccount from '@/features/accounts/hooks/contracts/use-create-account';
import { useLocalization } from '@/i18n/hooks';
import useToast from '@/lib/hooks/use-toast';
import { shortAddress } from '@/lib/utils/format';
import { ChevronRight } from 'lucide-react';
import React from 'react';

interface CreateAccountStepProps {
  address: string;
  onDoItLater?: () => void;
  onSuccess?: (accId: number) => void;
}

export default function CreateAccountStep({
  address,
  onDoItLater,
  onSuccess,
}: CreateAccountStepProps) {
  const { t } = useLocalization();
  const { toastError } = useToast();

  const { createAccount, isPending: isCreateAccountPending } = useCreateAccount();
  const { createAccount: createAccountApi, isPending: isCreateAccountApiPending } =
    useCreateAccountApi();

  const handleCreateAccount = async () => {
    try {
      const { hash, accId } = await createAccount();
      await createAccountApi({ txHash: hash });
      if (accId) {
        onSuccess?.(accId);
      }
    } catch (ex) {
      const error = t('create_account_sheet.error');
      toastError(`${error}: ${ex instanceof Error ? ex.message : 'Unknown error'}`);
    }
  };

  const isPending = isCreateAccountPending || isCreateAccountApiPending;

  return (
    <>
      <div className="flex flex-col gap-4 px-4">
        <Typography.Headline
          variant="h6"
          text={t('create_account_sheet.title')}
          className="text-white-80"
        />
        <Typography.Body
          variant="14_regular"
          className="text-white-80"
          text={t('create_account_sheet.description')}
        />
        <Typography.Caption
          variant="caption_1_regular"
          className="text-white-60"
          text={t('create_account_sheet.as_an_owner')}
        />

        <AppCard className="flex flex-col gap-2">
          <Typography.Body
            variant="14_regular"
            text={t('create_account_sheet.owner_address')}
            className="text-white-80"
          />
          <Typography.Body
            variant="14_medium"
            text={shortAddress(address ?? '')}
            className="text-white-80"
          />
        </AppCard>
      </div>
      <div className="mt-5 flex flex-col gap-1 px-4">
        <AppButton
          variant="primary"
          text={t('create_account')}
          iconRight={<ChevronRight className="size-6" />}
          onClick={() => handleCreateAccount()}
          isLoading={isPending}
        />

        <AppButton
          variant="link"
          text={t('create_account_sheet.do_it_later')}
          className="text-white-60 text-sm"
          disabled={isPending}
          onClick={onDoItLater}
        />
      </div>
    </>
  );
}
