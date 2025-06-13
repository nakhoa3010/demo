import { cn } from '@/lib/utils';
import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppCard({ children, className }: AppCardProps) {
  return (
    <div
      className={cn('border-white-20 rounded-12 flex-shrink-0 border p-4', className)}
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(153, 153, 153, 0.04) 100%)',
      }}
    >
      {children}
    </div>
  );
}
