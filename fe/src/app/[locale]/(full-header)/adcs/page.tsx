import { generateSEOMetadata } from '@/components/shared-components/metadata';
import { ADCSHeaderContainer } from '@/features/adcs/views';
import ADCSListing from '@/features/adcs/views/adcs-listing';
import { APP_NAME } from '@/lib/constans';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateSEOMetadata({
  title: `ADCS | ${APP_NAME}`,
  description: 'ADCS',
  keywords: ['ADCS'],
  canonical: '/adcs',
});

export default function ADCSPage() {
  return (
    <>
      <ADCSHeaderContainer />
      <ADCSListing />
    </>
  );
}
