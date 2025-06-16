import { locales } from '@/i18n/types';
import { generateSEOMetadata } from '@/components/shared-components/metadata';
import { Metadata } from 'next';
import { HomeMainSection } from '@/features/homes/views';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Block Dev',
  description: 'Block Dev',
  keywords: ['Block Dev'],
  canonical: '/',
  imageUrl: '/images/share.png',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage() {
  return (
    <>
      <HomeMainSection />
    </>
  );
}
