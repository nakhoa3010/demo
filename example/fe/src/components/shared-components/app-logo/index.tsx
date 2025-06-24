import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constans';

interface AppLogoProps {
  className?: string;
  linkClassName?: string;
}

export default function AppLogo({ className, linkClassName }: AppLogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', linkClassName)}>
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt={APP_NAME}
          width={200}
          height={200}
          className={cn('w-[40px] lg:w-[120px]', className)}
        />
        <h1 className="hidden text-2xl font-bold">{APP_NAME}</h1>
      </div>
    </Link>
  );
}
