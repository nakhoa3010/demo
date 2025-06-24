import { cn } from '@/lib/utils';
import React from 'react';

export default function Wrapper({
  children,
  className,
  wrapperClassName,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  id?: string;
}) {
  return (
    <div className={cn('w-full bg-transparent', wrapperClassName)}>
      <div id={id} className={cn('mx-auto flex w-full px-4 lg:px-0', `max-w-[1200px]`, className)}>
        {children}
      </div>
    </div>
  );
}
