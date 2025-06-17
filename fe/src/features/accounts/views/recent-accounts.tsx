/* eslint-disable @next/next/no-img-element */
'use client';
import Typography from '@/components/shared-components/typography';
import Wrapper from '@/components/shared-components/wrapper';
import { useLocalization } from '@/i18n/hooks';
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { formatDate, formatWithDecimals, shortAddress } from '@/lib/utils/format';
import { useLocalizedRoutes } from '@/i18n/hooks';
import Link from 'next/link';
import { envConfig } from '@/lib/configs';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import useAllAccounts from '../hooks/apis/use-all-accounts';
import { AccountStatus } from '@/types/account-type';
import { FadeInUp } from '@/components/animations';

export default function RecentAccounts() {
  const { currentLocale } = useLocalizedRoutes();
  const { t } = useLocalization('common');

  const { accounts, isAccountsLoading } = useAllAccounts();

  const getRandomAvatar = () => {
    const randomNumber = Math.floor(Math.random() * 15);
    return `/profiles/profile_${randomNumber}.jpg`;
  };

  return (
    <FadeInUp>
      <Wrapper className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography.Headline
            variant="h4"
            text={t('recent_accounts.title')}
            className="text-white-70"
          />
          <Typography.Body
            variant="14_regular"
            text={t('recent_accounts.description')}
            className="text-white-60"
          />
        </div>
        <div className="bg-gradient rounded-12 border-white-10 flex flex-col items-start justify-start gap-6 p-5">
          <ScrollArea className="w-full">
            <table className="w-full border-none">
              <thead>
                <tr>
                  <th className="p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('recent_accounts.status')}
                    />
                  </th>
                  <th className="p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('recent_accounts.address')}
                    />
                  </th>
                  <th className="min-w-[200px] p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('recent_accounts.created_at')}
                    />
                  </th>
                  <th className="p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('recent_accounts.consumer')}
                    />
                  </th>
                  <th className="p-4 text-left">
                    <Typography.Body
                      variant="14_medium"
                      className="text-white-70"
                      text={t('recent_accounts.balance')}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isAccountsLoading &&
                  accounts.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-white-10 ${index === accounts.length - 1 ? '' : 'border-bottom-white-10'}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'flex size-3 items-center justify-center rounded-full bg-red-500',
                              item.status === AccountStatus.SUCCESS && 'bg-green-500',
                            )}
                          ></div>
                          <Typography.Body variant="14_regular" text={item.id.toString()} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={getRandomAvatar()}
                            alt={item.account}
                            className="size-6 rounded-full"
                          />
                          <Link
                            href={`${envConfig.baseExplorerUrl}address/${item.txHash}`}
                            target="_blank"
                            className="hover:underline"
                          >
                            <Typography.Body
                              variant="14_regular"
                              text={shortAddress(item.account)}
                              className="text-white-70"
                            />
                          </Link>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography.Body
                          variant="14_regular"
                          text={formatDate(item.createdAt, currentLocale)}
                          className="text-white-70"
                        />
                      </td>
                      <td className="p-4">
                        <Typography.Body
                          variant="14_regular"
                          text={item.consumer?.toString() || '0'}
                          className="text-white-70"
                        />
                      </td>
                      <td className="p-4">
                        <Typography.Body
                          variant="14_regular"
                          text={formatWithDecimals(item.balance).toString()}
                          className="text-white-70"
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
