import React from 'react';
import { cn } from '@/lib/utils';
export default function AppContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto flex min-h-screen w-full max-w-[1728px] flex-col pb-20 lg:px-10',
        className,
      )}
    >
      {children}
    </div>
  );
}
