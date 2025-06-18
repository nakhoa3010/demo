import { generateSEOMetadata } from '@/components/shared-components/metadata';
import AccountDetailHeader from '@/features/accounts/views/account-detail-header';
import AccountHistory from '@/features/accounts/views/account-history';
import { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Account Detail',
  description: 'Account Detail',
  keywords: ['account', 'detail', 'account detail'],
  canonical: '/account/[id]',
});

export default function AccountDetailPage() {
  return (
    <>
      <AccountDetailHeader />
      <AccountHistory />
    </>
  );
}
