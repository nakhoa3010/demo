import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
export default function QuickSkeleton() {
  return (
    <div className={cn('flex w-[244px] flex-col gap-5 hover:cursor-pointer')}>
      <Skeleton className="rounded-16 relative h-[244px] w-full overflow-hidden" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
