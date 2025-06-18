'use client';
import { AppButton, AppCard } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import Wrapper from '@/components/shared-components/wrapper';
import { useLocalization, useLocalizedRoutes } from '@/i18n/hooks';
import React, { useState } from 'react';
import Image from 'next/image';
import CopyButton from '@/components/shared-components/app-button/copy-button';
import { UserPlus } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getRandomAvatar } from '../../helpers';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { useGetAccountDetail } from '../../hooks/apis';
import {
  formatDate,
  formatNumberWithUnit,
  formatWithDecimals,
  shortAddress,
} from '@/lib/utils/format';
import useToast from '@/lib/hooks/use-toast';
import CreateAccountSheet from '../create-account-sheet';
import { StepValue } from '../create-account-sheet/create-account-content';
import Link from 'next/link';
import { FadeInDown, FadeInUp } from '@/components/animations';
import { RemoveConsumerModal } from '..';

export default function AccountDetailHeader() {
  const { currentLocale } = useLocalizedRoutes();
  const { t } = useLocalization('common');
  const { toastSuccess } = useToast();
  const params = useParams();
  const accountId = params.id as string;

  //State to open create account sheet
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRemoveConsumerModal, setIsOpenRemoveConsumerModal] = useState(false);
  const [consumerAddress, setConsumerAddress] = useState('');

  const [stepTo, setStepTo] = useState<StepValue>('ADD_CONSUMER');

  const { accountDetail, isLoading: isAccountsLoading, refetch } = useGetAccountDetail(accountId);

  const onOpenCreateAccountSheet = (type: StepValue) => {
    setStepTo(type);
    setIsOpen(true);
  };

  const onCloseCreateAccountSheet = () => {
    setIsOpen(false);
    setStepTo('ADD_CONSUMER');
  };

  const onCallBack = () => {
    switch (stepTo) {
      case 'ADD_CONSUMER':
      case 'ADD_DEPOSIT':
        refetch();
        setIsOpen(false);
        break;
      case 'WITHDRAW':
        refetch();
        setIsOpen(false);
        toastSuccess(t('account_detail.withdraw_success'));
        break;
    }
  };

  const onCallBackRemoveConsumer = () => {
    refetch();
    setIsOpenRemoveConsumerModal(false);
  };

  const onOpenRemoveConsumerModal = (consumerAddress: string) => {
    setConsumerAddress(consumerAddress);
    setIsOpenRemoveConsumerModal(true);
  };

  return (
    <Wrapper className="flex min-h-[50vh] flex-col justify-center py-10">
      <div id="breadcrumb" className="flex items-center gap-2">
        <Link href={`/${currentLocale}/account`} className="text-white-70 hover:underline">
          <Typography.Body
            variant="14_medium"
            text={t('account_detail.list_accounts')}
            className="text-white-70 underline"
          />
        </Link>
      </div>
      <FadeInDown>
        <AppCard className="mt-10 flex flex-col gap-10 lg:flex-row">
          <div className="flex flex-2 flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={getRandomAvatar()}
                alt="avatar"
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-green-500" />
                  <Typography.Body
                    variant="14_medium"
                    className="text-green-500"
                    text={t('account_detail.active')}
                  />
                </div>
                <div className="bg-white-60 h-[10px] w-[1px]" />
                <Typography.Body
                  variant="14_medium"
                  className="text-white"
                  text={t('account_detail.account_id')}
                />
                <Typography.Body
                  variant="14_medium"
                  className="text-white"
                  text={accountDetail?.id?.toString() || ''}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-1 flex-col gap-2">
                <Typography.Body
                  variant="14_medium"
                  className="text-white-60"
                  text={t('account_detail.owner')}
                />
                <div className="flex items-center gap-2">
                  <Typography.Body
                    variant="14_medium"
                    className="text-white"
                    text={shortAddress(accountDetail?.owner || '')}
                  />

                  <CopyButton
                    className="size-3"
                    onClick={() => {
                      navigator.clipboard.writeText(accountDetail?.owner || '');
                      toastSuccess(t('address_copied'));
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center gap-2">
                <Typography.Body
                  variant="14_medium"
                  className="text-white-60"
                  text={t('account_detail.consumers_count')}
                />
                <Typography.Body
                  variant="14_medium"
                  className="text-white"
                  text={accountDetail?.consumerCount?.toString() || '0'}
                />
              </div>

              <div className="flex flex-1 flex-col items-center gap-2">
                <Typography.Body
                  variant="14_medium"
                  className="text-white-60"
                  text={t('account_detail.balance_value')}
                />
                <Typography.Body
                  variant="14_medium"
                  className="text-white"
                  text={formatWithDecimals(accountDetail?.balance || '0').toString()}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <AppButton
              text={t('account_detail.withdraw')}
              variant="secondary-gray"
              size="40"
              className="w-full"
              onClick={() => onOpenCreateAccountSheet('WITHDRAW')}
            />
            <AppButton
              text={t('account_detail.deposit')}
              size="40"
              className="w-full"
              onClick={() => onOpenCreateAccountSheet('ADD_DEPOSIT')}
            />
          </div>
        </AppCard>
      </FadeInDown>

      <FadeInUp>
        <div className="mt-20 mb-10 flex flex-col justify-between gap-4 lg:flex-row">
          <Typography.Headline
            variant="h6"
            className="text-white"
            text={t('account_detail.consumers')}
          />
          <AppButton
            text={t('account_detail.add_consumer')}
            size="40"
            iconLeft={<UserPlus className="size-4" />}
            onClick={() => onOpenCreateAccountSheet('ADD_CONSUMER')}
          />
        </div>
      </FadeInUp>
      <FadeInUp>
        <div className="bg-gradient rounded-12 border-white-10 flex flex-col items-start justify-start gap-6 p-5">
          <ScrollArea className="w-full">
            <table className="w-full border-none">
              <thead>
                <tr>
                  <th className="min-w-[200px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.address')}
                    />
                  </th>
                  <th className="min-w-[100px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.added')}
                    />
                  </th>
                  <th className="min-w-[200px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.last_fulfillment')}
                    />
                  </th>
                  <th className="min-w-[200px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.total_spent')}
                    />
                  </th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {accountDetail?.consumers.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-white-10 ${index === accountDetail?.consumers.length - 1 ? '' : 'border-bottom-white-10'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src={getRandomAvatar()}
                          alt={item.address}
                          className="size-6 rounded-full"
                          width={24}
                          height={24}
                        />
                        <Typography.Body
                          variant="14_regular"
                          text={shortAddress(item.address)}
                          className="text-white-70"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Typography.Body
                          variant="14_regular"
                          text={formatDate(item.createdAt, currentLocale)}
                          className="text-white-70"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <Typography.Body
                        variant="14_regular"
                        text={formatDate(item.lastFulfillment, currentLocale)}
                        className="text-white-70"
                      />
                    </td>
                    <td className="p-4">
                      <Typography.Body
                        variant="14_regular"
                        text={formatNumberWithUnit(formatWithDecimals(item.spendCount))}
                        className="text-white-70"
                      />
                    </td>
                    <td className="p-4">
                      <AppButton
                        text={t('account_detail.remove')}
                        size="40"
                        variant="secondary-gray"
                        className="rounded-12 w-full"
                        onClick={() => onOpenRemoveConsumerModal(item.address)}
                      />
                    </td>
                  </tr>
                ))}
                {!isAccountsLoading && accountDetail?.consumers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4">
                      <Typography.Body
                        variant="14_regular"
                        text={t('account_detail.no_consumers')}
                      />
                    </td>
                  </tr>
                )}

                {isAccountsLoading &&
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index}>
                      <td className="p-4">
                        <Skeleton className="h-6 w-full" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-6 w-full" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-6 w-full" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-6 w-full" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <ScrollBar orientation="horizontal" className="h-2" />
          </ScrollArea>
        </div>
      </FadeInUp>

      <CreateAccountSheet
        stepTo={stepTo}
        open={isOpen}
        onOpenChange={onCloseCreateAccountSheet}
        accIdValue={Number(accountId) || undefined}
        accountBalance={formatWithDecimals(accountDetail?.balance || '0')}
        isAutoGoNext={false}
        onCallBack={onCallBack}
      />

      <RemoveConsumerModal
        open={isOpenRemoveConsumerModal}
        accId={Number(accountId)}
        consumerAddress={consumerAddress}
        onOpenChange={setIsOpenRemoveConsumerModal}
        onCallBack={onCallBackRemoveConsumer}
      />
    </Wrapper>
  );
}
