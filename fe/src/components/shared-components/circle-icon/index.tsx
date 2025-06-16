import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ICircleIconProps {
  icon: string;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}
export default function CircleIcon({ icon, className, iconClassName, onClick }: ICircleIconProps) {
  return (
    <div
      className={cn(
        'avatar bg-neutral-0 flex size-10 cursor-pointer items-center justify-center rounded-full',
        className,
      )}
      onClick={onClick}
    >
      <Image src={icon} alt="icon" width={20} height={20} className={cn('size-5', iconClassName)} />
    </div>
  );
}
