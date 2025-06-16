import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DataFeedSkeleton() {
  return (
    <div className="border-white-10 rounded-12 bg-gradient flex flex-col gap-4 border p-4">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="rounded-12 h-6 w-20" />
        <div className="flex items-center justify-center gap-1">
          <Skeleton className="size-6" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-1">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton className="h-2 w-10" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Skeleton className="h-2 w-10" />
          <div className="flex items-center justify-between gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        <div className="border-white-20 flex h-full gap-2 border-l" />
        <div className="flex flex-1 flex-col gap-1">
          <Skeleton className="h-2 w-10" />
          <div className="flex items-center justify-between gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
