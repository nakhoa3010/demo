import React, { InputHTMLAttributes } from 'react';
import Typography from '../typography';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface IAppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  icon?: string;
  action?: React.ReactNode;
  isRequired?: boolean;
  onIconClick?: () => void;
  className?: string;
  inputClassName?: string;
}

export default function AppInput({
  label,
  error,
  icon,
  action,
  isRequired,
  onIconClick,
  className,
  inputClassName,
  ...props
}: IAppInputProps) {
  const borderColor = error ? 'border-red' : 'border-black/10';
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Typography.Caption variant="caption_1_regular" text={label}>
              {isRequired && <span className="text-red">*</span>}
            </Typography.Caption>
            {isRequired && <span className="text-red">*</span>}
          </div>

          {action && action}
        </div>
      )}
      <div className="relative">
        <Input
          className={cn(
            'place bg-neutral-0 caret-primary-dark h-12 px-4 py-3 text-sm leading-[22px] font-normal placeholder:text-neutral-400 focus:shadow-none',
            borderColor,
            inputClassName,
            error && 'focus-visible:border-red',
          )}
          {...props}
        />
        {icon && (
          <div
            className="absolute top-0 right-4 bottom-0 my-auto size-4 cursor-pointer"
            onClick={onIconClick}
          >
            <Image src={icon} alt="eye" width={24} height={24} />
          </div>
        )}
      </div>
      {error && (
        <Typography.Caption text={error} variant="caption_1_regular" className="text-red" />
      )}
    </div>
  );
}
