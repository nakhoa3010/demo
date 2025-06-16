'use client';
import Typography from '@/components/shared-components/typography';
import React, { useState } from 'react';
import Link from 'next/link';
import { wait } from '@/lib/utils/index';
import { Skeleton } from '@/components/ui/skeleton';
import { AppTabs } from '@/components/shared-components';

const tabs = [
  {
    label: 'domestic_cities',
    value: 'domestic_cities',
  },
  {
    label: 'international_cities',
    value: 'international_cities',
  },
  {
    label: 'regions',
    value: 'regions',
  },
  {
    label: 'countries',
    value: 'countries',
  },
  {
    label: 'places_to_stay',
    value: 'places_to_stay',
  },
];

const fakeData = [
  ['Vung Tau hotels', 'Nha Trang hotels', 'Quy Nhon hotels', 'Cat Ba hotels', 'Tuy Hoa hotels'],
  ['Long Hai hotels', 'Vinh Hy hotels', 'Bao Loc hotels', 'Mai Chau hotels', 'Thanh Hoa hotels'],
  ['Da Nang hotels', 'Hue hotels', 'Phan Thiet hotels', 'Can Tho hotels', 'Cua Lo hotels'],
  ['Phong Nha hotels', 'Ha Giang hotels', 'Tay Ninh hotels', 'Quan Lan hotels', 'Ha Tien hotels'],
  ['Da Lat hotels', 'Hoi An hotels', 'Phu Quoc hotels', 'Quan Lan hotels', 'Ha Tien hotels'],
];

export default function InspirationTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onTabClick = async (value: string) => {
    setActiveTab(value);
    setIsLoading(true);
    await wait(2000);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <AppTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={onTabClick}
        layoutId="inspiration-tabs"
      />

      <div className="flex min-h-[100px] w-full">
        {!isLoading &&
          fakeData.map((item, index) => (
            <div key={index} className="flex min-h-2 flex-1 flex-col gap-4">
              {item.map((item) => (
                <Link href="#" key={item}>
                  <Typography.Body variant="16_regular" text={item} />
                </Link>
              ))}
            </div>
          ))}

        {isLoading &&
          fakeData.map((item, index) => (
            <div key={index} className="flex min-h-2 flex-1 flex-col gap-4">
              {item.map((item) => (
                <Skeleton key={item} className="h-6 w-[90%] rounded-md bg-neutral-50" />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
