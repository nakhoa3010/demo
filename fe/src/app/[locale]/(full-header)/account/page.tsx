import { generateSEOMetadata } from '@/components/shared-components/metadata';
import { AccountContainer, RecentAccounts } from '@/features/accounts/views';
import { locales } from '@/i18n/types';
import { Metadata } from 'next';
import React from 'react';

export const generateStaticParams = async () => {
  return locales.map((locale) => ({ locale }));
};

export const metadata: Metadata = generateSEOMetadata({
  title: 'Block Dev - Account',
  description: 'Block Dev - Account',
  keywords: ['Block Dev', 'Account'],
  canonical: '/account',
  imageUrl: '/images/socials/account.png',
});

const AccountPage = () => {
  return (
    <>
      <AccountContainer />
      <RecentAccounts />
    </>
  );
};

export default AccountPage;
