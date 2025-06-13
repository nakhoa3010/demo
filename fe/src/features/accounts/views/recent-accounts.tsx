/* eslint-disable @next/next/no-img-element */
'use client';
import Typography from '@/components/shared-components/typography';
import Wrapper from '@/components/shared-components/wrapper';
import { useLocalization } from '@/i18n/hooks';
import React from 'react';
import { AccountItem } from '../components';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { formatDate, shortAddress } from '@/lib/utils/format';
import { useLocalizedRoutes } from '@/i18n/hooks';
import Link from 'next/link';
import { envConfig } from '@/lib/configs';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export enum AccountStatus {
  SUCCESS = 'success',
  INPROGRESS = 'inprogress',
}

export interface AccountItem {
  id: number;
  address: string;
  accountLogo: string;
  createdAt: string;
  updatedAt: string;
  status: AccountStatus;
  consumer: number;
  balanceOf: number;
}

const accountItems: AccountItem[] = [
  {
    id: 1,
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    accountLogo: 'https://picsum.photos/200',
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    status: AccountStatus.SUCCESS,
    consumer: 5,
    balanceOf: 1000,
  },
  {
    id: 2,
    address: '0x123f681646d4A755815f9CB19e1aCc0765A999D2',
    accountLogo: 'https://picsum.photos/201',
    createdAt: '2024-03-19T15:30:00Z',
    updatedAt: '2024-03-19T15:30:00Z',
    status: AccountStatus.INPROGRESS,
    consumer: 3,
    balanceOf: 500,
  },
  {
    id: 3,
    address: '0x456f681646d4A755815f9CB19e1aCc0765A999D3',
    accountLogo: 'https://picsum.photos/202',
    createdAt: '2024-03-18T09:15:00Z',
    updatedAt: '2024-03-18T09:15:00Z',
    status: AccountStatus.SUCCESS,
    consumer: 8,
    balanceOf: 2000,
  },
  {
    id: 4,
    address: '0x789f681646d4A755815f9CB19e1aCc0765A999D4',
    accountLogo: 'https://picsum.photos/203',
    createdAt: '2024-03-17T14:20:00Z',
    updatedAt: '2024-03-17T14:20:00Z',
    status: AccountStatus.SUCCESS,
    consumer: 12,
    balanceOf: 3500,
  },
  {
    id: 5,
    address: '0xabc1234567890def1234567890abcdef12345678',
    accountLogo: 'https://picsum.photos/204',
    createdAt: '2024-03-16T11:45:00Z',
    updatedAt: '2024-03-16T11:45:00Z',
    status: AccountStatus.INPROGRESS,
    consumer: 2,
    balanceOf: 750,
  },
  {
    id: 6,
    address: '0xdef4567890abc1234567890abcdef1234567890',
    accountLogo: 'https://picsum.photos/205',
    createdAt: '2024-03-15T16:30:00Z',
    updatedAt: '2024-03-15T16:30:00Z',
    status: AccountStatus.SUCCESS,
    consumer: 15,
    balanceOf: 5000,
  },
  {
    id: 7,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    accountLogo: 'https://picsum.photos/206',
    createdAt: '2024-03-14T09:00:00Z',
    updatedAt: '2024-03-14T09:00:00Z',
    status: AccountStatus.INPROGRESS,
    consumer: 4,
    balanceOf: 1200,
  },
  {
    id: 8,
    address: '0x9876543210fedcba9876543210fedcba98765432',
    accountLogo: 'https://picsum.photos/207',
    createdAt: '2024-03-13T13:15:00Z',
    updatedAt: '2024-03-13T13:15:00Z',
    status: AccountStatus.SUCCESS,
    consumer: 9,
    balanceOf: 2800,
  },
];

export default function RecentAccounts() {
  const { currentLocale } = useLocalizedRoutes();
  const { t } = useLocalization('common');

  const isLoading = false;

  return (
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
              {!isLoading &&
                accountItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-white-10 ${index === accountItems.length - 1 ? '' : 'border-bottom-white-10'}`}
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
                          src={item.accountLogo}
                          alt={item.address}
                          className="size-6 rounded-full"
                        />
                        <Link
                          href={`${envConfig.baseExplorerUrl}address/${item.address}`}
                          target="_blank"
                          className="hover:underline"
                        >
                          <Typography.Body
                            variant="14_regular"
                            text={shortAddress(item.address)}
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
                        text={item.consumer.toString()}
                        className="text-white-70"
                      />
                    </td>
                    <td className="p-4">
                      <Typography.Body
                        variant="14_regular"
                        text={item.balanceOf.toString()}
                        className="text-white-70"
                      />
                    </td>
                  </tr>
                ))}

              {isLoading &&
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
  );
}
