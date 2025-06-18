'use client';

import { Wrapper } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLocalization, useLocalizedRoutes } from '@/i18n/hooks';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAccountDetail } from '../../hooks/apis';
import { useParams } from 'next/navigation';
import {
  formatDate,
  formatNumberWithUnit,
  formatWithDecimals,
  shortAddress,
} from '@/lib/utils/format';
import { FadeInUp } from '@/components/animations';

export default function AccountHistory() {
  const { t } = useLocalization('common');
  const { currentLocale } = useLocalizedRoutes();
  const params = useParams();
  const accountId = params.id as string;
  const { accountDetail, isLoading: isAccountsLoading } = useGetAccountDetail(accountId);

  return (
    <FadeInUp>
      <Wrapper className="flex flex-col gap-10">
        <div className="mt-20 flex justify-between gap-4">
          <Typography.Headline
            variant="h6"
            className="text-white"
            text={t('account_detail.history')}
          />
        </div>
        <div className="bg-gradient rounded-12 border-white-10 flex flex-col items-start justify-start gap-6 p-5">
          <ScrollArea className="w-full">
            <table className="w-full border-none">
              <thead>
                <tr>
                  <th className="min-w-[100px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.status')}
                    />
                  </th>
                  <th className="min-w-[100px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.time')}
                    />
                  </th>
                  <th className="min-w-[200px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.request')}
                    />
                  </th>
                  <th className="min-w-[200px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.transaction_hash')}
                    />
                  </th>
                  <th className="min-w-[200px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.consumer')}
                    />
                  </th>
                  <th className="min-w-[100px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.amount')}
                    />
                  </th>
                  <th className="min-w-[100px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('account_detail.balance')}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {accountDetail?.history.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-white-10 ${index === accountDetail?.history.length - 1 ? '' : 'border-bottom-white-10'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 rounded-full border border-green-500 py-1">
                        <Typography.Body
                          variant="14_regular"
                          text={item.status}
                          className="text-green-500 capitalize"
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
                        text={item.service}
                        className="text-white-70"
                      />
                    </td>
                    <td className="p-4">
                      <Typography.Body
                        variant="14_regular"
                        text={shortAddress(item.txHash)}
                        className="text-white-70"
                      />
                    </td>
                    <td className="p-4">
                      <Typography.Body variant="14_regular" text={shortAddress(item.consumer)} />
                    </td>
                    <td className="p-4">
                      <Typography.Body
                        variant="14_regular"
                        text={formatNumberWithUnit(formatWithDecimals(item.amount))}
                      />
                    </td>
                    <td className="p-4">
                      <Typography.Body
                        variant="14_regular"
                        text={formatNumberWithUnit(formatWithDecimals(item.balance).toFixed(4))}
                      />
                    </td>
                  </tr>
                ))}

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
      </Wrapper>
    </FadeInUp>
  );
}
