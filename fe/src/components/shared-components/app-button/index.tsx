import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

type AppButtonVariant =
  | 'primary'
  | 'black'
  | 'secondary-gray'
  | 'tertiary-gray'
  | 'link'
  | 'link-gray';

type AppButtonSize = '56' | '48' | '40';
interface IAppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  variant?: AppButtonVariant;
  isLoading?: boolean;
  size?: AppButtonSize;
  labelClassName?: string;
  onClick?: () => void;
}

const variantStyles = {
  primary:
    'bg-transparent border border-green-300 text-green-300 hover:bg-transparent hover:text-green-500 disabled:border-green-500 disabled:text-green-500',
  black: 'bg-neutral-900 text-neutral-0 hover:bg-neutral-800  disabled:opacity-20',

  'secondary-gray':
    'bg-transparent border border-white-30 text-white-60 hover:text-white-60 hover:bg-transparent hover:border-white-60 disabled:border-white-30 disabled:text-white-60',
  'tertiary-gray':
    'bg-neutral-50 text-neutral-900 hover:text-neutral-600 disabled:bg-black-40 hover:bg-neutral-50',
  link: 'bg-transparent shadow-none text-green-300 hover:text-green-500 hover:bg-transparent hover:underline',
  'link-gray':
    'text-neutral-900 underline bg-transparent hover:text-neutral-600 hover:bg-transparent',
};

const sizeStyles = {
  '56': 'h-14 flex gap-3 text-base font-medium leading-6 px-6',
  '48': 'h-12 flex gap-3 text-sm font-medium leading-[22px] px-6',
  '40': 'h-10 flex gap-2 text-sm font-medium leading-[22px] px-4',
};

export default function AppButton({
  text,
  iconLeft,
  iconRight,
  variant = 'primary',
  className,
  size = '56',
  onClick,
  ...props
}: IAppButtonProps) {
  return (
    <Button
      className={cn(
        'rounded-12 flex cursor-pointer items-center shadow-none hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {iconLeft}
      {text}
      {iconRight}
    </Button>
  );
}
