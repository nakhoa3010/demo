import React from 'react';
import { cn } from '@/lib/utils';
import Typography from '../typography';
import Image from 'next/image';
interface AppGroupRadioProps {
  className?: string;
  selectedValue: string | number;
  onSelect?: (value: string | number) => void;
  options: {
    label: string;
    value: string | number;
  }[];
}

export default function AppGroupRadio({
  options,
  selectedValue,
  className,
  onSelect,
}: AppGroupRadioProps) {
  return (
    <div className={cn('flex gap-10', className)}>
      {options.map((option) => (
        <div
          key={option.value}
          className="flex cursor-pointer items-center gap-2"
          onClick={() => onSelect?.(option.value)}
        >
          <Image
            src={`/icons/radio-button${option.value === selectedValue ? '-checked' : ''}.svg`}
            alt={option.label}
            width={24}
            height={24}
          />
          <Typography.Body variant="16_regular" text={option.label} />
        </div>
      ))}
    </div>
  );
}
