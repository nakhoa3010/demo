import { locales } from '@/i18n/types';
import { generateSEOMetadata } from '@/components/shared-components/metadata';
import { Metadata } from 'next';
import { HomeMainSection } from '@/features/homes/views';
import { redirect } from 'next/navigation';
import { APP_NAME } from '@/lib/constans';

export const metadata: Metadata = generateSEOMetadata({
  title: APP_NAME,
  description: APP_NAME,
  keywords: [APP_NAME],
  canonical: '/',
  imageUrl: '/images/share.png',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage() {
  redirect('/vi/account');

  return (
    <>
      <HomeMainSection />
    </>
  );
}
