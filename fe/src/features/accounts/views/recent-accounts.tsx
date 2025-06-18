/* eslint-disable @next/next/no-img-element */
'use client';
import Typography from '@/components/shared-components/typography';
import Wrapper from '@/components/shared-components/wrapper';
import { useLocalization } from '@/i18n/hooks';
import React, { useMemo, useState } from 'react';
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
import { useAccount } from 'wagmi';
import { Check, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getRandomAvatar } from '../helpers';

export default function RecentAccounts() {
  const { currentLocale } = useLocalizedRoutes();
  const { address } = useAccount();
  const { t } = useLocalization('common');

  const [isCreatedByMe, setIsCreatedByMe] = useState(false);

  const { accounts, isAccountsLoading } = useAllAccounts();

  const accountsFiltered = useMemo(() => {
    if (isCreatedByMe && address) {
      const addressLower = address.toLowerCase();
      return accounts.filter((item) => item.owner === addressLower);
    }
    return accounts;
  }, [accounts, isCreatedByMe, address]);

  const isHasCreatedByMe = useMemo(() => {
    if (!address) return false;
    const isCreatedByMe = accounts.some((item) => item.owner === address.toLowerCase());
    return isCreatedByMe;
  }, [accounts, address]);

  return (
    <FadeInUp>
      <Wrapper className="flex flex-col gap-4">
        <div className="flex justify-between">
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

          {address && (
            <div className="flex cursor-pointer items-center gap-2">
              <div
                className={cn(
                  'flex size-4 items-center justify-center rounded-[5px] border border-green-500',
                )}
                onClick={() => setIsCreatedByMe(!isCreatedByMe)}
              >
                {isCreatedByMe && <Check className="h-3 w-3 text-green-500" />}
              </div>
              <Typography.Caption
                text={t('recent_accounts.created_by_me')}
                className="text-green-500"
              />
            </div>
          )}
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
                  {isHasCreatedByMe && <th className="w-[50px] p-4"></th>}
                </tr>
              </thead>
              <tbody>
                {!isAccountsLoading &&
                  accountsFiltered.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-white-10 ${index === accountsFiltered.length - 1 ? '' : 'border-bottom-white-10'}`}
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
                            href={`${envConfig.baseExplorerUrl}address/${item.account}`}
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
                          text={item.consumerCount.toString()}
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
                      {isHasCreatedByMe && item.owner === address?.toLowerCase() && (
                        <td className="p-4">
                          <Link href={`/${currentLocale}/account/${item.id}`}>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex size-6 cursor-pointer items-center justify-center rounded-[5px] border border-green-500 p-1">
                                  <ChevronRight className="size-4 text-green-500" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <Typography.Caption
                                  text={t('recent_accounts.view_detail')}
                                  className="text-white-70"
                                />
                              </TooltipContent>
                            </Tooltip>
                          </Link>
                        </td>
                      )}
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
