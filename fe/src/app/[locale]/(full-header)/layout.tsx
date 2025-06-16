import Footer from '@/components/shared-components/layouts/footer';
import Header from '@/components/shared-components/layouts/header';
import { ReactNode, Suspense } from 'react';

export default function FullHeaderLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="mt-[72px] flex flex-1 flex-col gap-4">{children}</div>
        <Footer />
      </div>
    </Suspense>
  );
}
