import { generateSEOMetadata } from '@/components/shared-components/metadata';
import { DataFeedHeader, DataFeedListing } from '@/features/data-feed/views';
import { APP_NAME } from '@/lib/constans';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = generateSEOMetadata({
  title: `Data Feed | ${APP_NAME}`,
  description: 'Data Feed',
  keywords: ['Data Feed'],
  canonical: '/data-feed',
});

export default function page() {
  return (
    <>
      <DataFeedHeader />
      <DataFeedListing />
    </>
  );
}
