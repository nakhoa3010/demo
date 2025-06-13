'use client';
import React, { useState } from 'react';
import QuickItem from './quick-item';
import { CarouselWrapper } from '@/components/shared-components/app-carousel';
import Typography from '@/components/shared-components/typography';
import Wrapper from '@/components/shared-components/wrapper';
import { AppTabs } from '@/components/shared-components';
import { Beach, Flag, FlowerLotus, Food, HeartCouple } from '@/assets/icons';
import { wait } from '@/lib/utils/index';
import QuickSkeleton from './quick-skeleton';
export const fakeData = [
  {
    id: 1,
    name: 'Driftwood',
    location: 'Georgia, United States',
    image: '/images/mocks/quicks/1.png',
  },
  {
    id: 2,
    name: 'Pfeiffer',
    location: 'California, United States',
    image: '/images/mocks/quicks/2.png',
  },
  {
    id: 3,
    name: 'South Beach',
    location: 'Miami, Florida, United States',
    image: '/images/mocks/quicks/3.png',
  },
  {
    id: 4,
    name: 'Folly',
    location: 'South Carolina, United States',
    image: '/images/mocks/quicks/4.png',
  },
  {
    id: 5,
    name: 'Kill Devil Hills',
    location: 'North, United States',
    image: '/images/mocks/quicks/5.png',
  },
  {
    id: 6,
    name: 'Siesta Key',
    location: 'Florida, United States',
    image: '/images/mocks/quicks/6.png',
  },
  {
    id: 7,
    name: 'Gulf Shores',
    location: 'Alabama, United States',
    image: '/images/mocks/quicks/7.png',
  },

  {
    id: 8,
    name: 'Driftwood',
    location: 'Georgia, United States',
    image: '/images/mocks/quicks/1.png',
  },
  {
    id: 9,
    name: 'Pfeiffer',
    location: 'California, United States',
    image: '/images/mocks/quicks/2.png',
  },
  {
    id: 10,
    name: 'South Beach',
    location: 'Miami, Florida, United States',
    image: '/images/mocks/quicks/3.png',
  },
  {
    id: 11,
    name: 'Folly',
    location: 'South Carolina, United States',
    image: '/images/mocks/quicks/4.png',
  },
  {
    id: 12,
    name: 'Kill Devil Hills',
    location: 'North, United States',
    image: '/images/mocks/quicks/5.png',
  },
  {
    id: 13,
    name: 'Siesta Key',
    location: 'Florida, United States',
    image: '/images/mocks/quicks/6.png',
  },
  {
    id: 14,
    name: 'Gulf Shores',
    location: 'Alabama, United States',
    image: '/images/mocks/quicks/7.png',
  },
];

const tabs = [
  {
    label: 'beach',
    value: 'beach',
    icon: Beach,
  },
  {
    label: 'out_doors',
    value: 'out_doors',
    icon: Flag,
  },
  {
    label: 'relax',
    value: 'relax',
    icon: FlowerLotus,
  },
  {
    label: 'romance',
    value: 'romance',
    icon: HeartCouple,
  },
  {
    label: 'food',
    value: 'food',
    icon: Food,
  },
];

export default function QuickAndEasyTripPlanner() {
  const [activeTab, setActiveTab] = useState('beach');
  const [isLoading, setIsLoading] = useState(false);

  const onTabClick = async (value: string) => {
    setActiveTab(value);
    setIsLoading(true);
    await wait(2000);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <Wrapper className="relative flex flex-col gap-4">
        <Typography.Headline text="Quick and Easy Trip Planner" />
        <Typography.Body
          variant="16_regular"
          text="Pick a vibe and explore the top destinations."
          className="text-neutral-700"
        />

        <AppTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={onTabClick}
          className="mt-10"
          layoutId="quick-and-easy-trip-planner"
        />
      </Wrapper>
      <CarouselWrapper
        className="-mt-20 pt-20"
        items={fakeData.map((destination) =>
          isLoading ? (
            <QuickSkeleton key={destination.id} />
          ) : (
            <QuickItem key={destination.id} item={destination} />
          ),
        )}
        itemKey={fakeData.map((destination) => destination.id.toString())}
      />
    </div>
  );
}
