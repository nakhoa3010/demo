/* eslint-disable @next/next/no-img-element */
'use client';
import { Wrapper } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import React, { useMemo, useState } from 'react';
import FeedTypes, { FeedType } from '../components/feed-type';
import { Search } from 'lucide-react';
import { useLocalization } from '@/i18n/hooks';
import CopyButton from '@/components/shared-components/app-button/copy-button';
import useToast from '@/lib/hooks/use-toast';
import { Input } from '@/components/ui/input';
import DataFeedSkeleton from '../components/data-feed-skeleton';
import { useAllDataFeedQuery } from '../hooks/apis';
import { formatNumberWithUnit, formatWithDecimals, shortAddress } from '@/lib/utils/format';

export default function DataFeedListing() {
  const { t } = useLocalization('common');
  const { toastSuccess } = useToast();
  const [keySearch, setKeySearch] = useState('');

  const { feedsData, isLoadingDataFeed } = useAllDataFeedQuery();

  const dataRender = useMemo(() => {
    return feedsData?.filter((item) => item.name.includes(keySearch)) || [];
  }, [keySearch, feedsData]);

  return (
    <Wrapper className="flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography.Headline variant="h6" text="Data Feed" />
        <div className="flex items-center gap-2">
          <div className="relative min-w-3xs">
            <Input
              className="border-white-10 bg-white-10 text-white-60 py-4 placeholder:text-[10px] focus-visible:ring-1 focus-visible:ring-green-600"
              placeholder={t('data_feed.search_placeholder')}
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
            />
            <Search className="text-white-60 absolute top-1/2 right-2 size-4 -translate-y-1/2" />
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {isLoadingDataFeed &&
          Array.from({ length: 12 }).map((_, index) => <DataFeedSkeleton key={index} />)}
        {!isLoadingDataFeed &&
          dataRender.map((item, index) => (
            <div
              key={`data-feed-${item.address}-${index}`}
              className="border-white-10 rounded-12 bg-gradient flex flex-col gap-4 border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <FeedTypes type={item.type as FeedType} />
                <div className="flex items-center justify-center gap-1">
                  <img
                    src={item.iconUrl}
                    alt={item.chainName}
                    width={16}
                    height={16}
                    className="size-4 rounded-full"
                  />
                  <Typography.Body
                    variant="14_regular"
                    text={item.chainName}
                    className="text-white-60"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-1">
                <Typography.Body variant="16_regular" text={item.name} className="text-white-80" />
                <Typography.Body
                  variant="18_regular"
                  text={formatNumberWithUnit(formatWithDecimals(item.lastedPrice, item.decimals))}
                  className="text-white-90"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Typography.Body
                  variant="14_regular"
                  text={t('data_feed.total_market_cap')}
                  className="text-white-60"
                />
                <Typography.Body
                  variant="18_regular"
                  text={formatNumberWithUnit(item.marketCap)}
                  className="text-white-90"
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <Typography.Caption
                    variant="caption_1_regular"
                    text={t('data_feed.address')}
                    className="text-white-60"
                  />
                  <div className="border-white-20 flex h-[1px] w-full gap-2 border-l" />

                  <div className="flex items-center gap-2">
                    <Typography.Body variant="16_regular" text={shortAddress(item.address)} />
                    <CopyButton
                      imgClassName="size-3"
                      onClick={() => {
                        navigator.clipboard.writeText(item.address);
                        toastSuccess(t('address_copied'));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Wrapper>
  );
}
