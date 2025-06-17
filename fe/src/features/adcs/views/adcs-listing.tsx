'use client';

import { Wrapper } from '@/components/shared-components';
import { useAllADCSQuery } from '@/features/adcs/hooks/apis';
import React from 'react';
import ADCSItem from '../components/adcs-item';
import ADCSSkeleton from '../components/adcs-skeleton';

export default function ADCSListing() {
  const { adcsData, isLoadingADCS } = useAllADCSQuery();

  return (
    <Wrapper>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!isLoadingADCS && adcsData?.map((adcs) => <ADCSItem key={adcs.id} adcs={adcs} />)}
        {isLoadingADCS &&
          Array.from({ length: 10 }).map((_, index) => <ADCSSkeleton key={index} />)}
      </div>
    </Wrapper>
  );
}
