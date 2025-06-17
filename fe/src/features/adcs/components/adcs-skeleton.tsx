import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function ADCSSkeleton() {
  return (
    <div className="bg-gradient rounded-12 border-white-10 flex w-full flex-col items-start justify-start gap-6 border p-5">
      <div className="flex items-center gap-4">
        <div className="border-white-10 bg-white-10 rounded-12 flex items-center justify-center border p-1">
          <Skeleton className="size-20 rounded-full" />
        </div>
        <div className="flex w-full flex-col items-start justify-between gap-1">
          <Skeleton className="h-4 w-full font-normal text-wrap" />
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-2 w-20" />
            <Skeleton className="h-2 w-20" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-2 w-20" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-1">
        <Skeleton className="h-2 w-20" />
      </div>

      <div className="bg-white-10 h-[1px] w-20" />

      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-col items-center justify-between gap-2">
          <Skeleton className="h-2 w-20" />
          <Skeleton className="h-2 w-20" />
        </div>
        <div className="flex flex-col items-center justify-between gap-2">
          <Skeleton className="h-2 w-20" />
          <Skeleton className="h-2 w-20" />
        </div>
        <div className="flex flex-col items-center justify-between gap-2">
          <Skeleton className="h-2 w-20" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
    </div>
  );
}
