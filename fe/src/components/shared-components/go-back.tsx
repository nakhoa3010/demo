'use client';
import React from 'react';
import Typography from './typography';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocalization } from '@/i18n/hooks';
export default function GoBack() {
  const { t } = useLocalization('common');
  const router = useRouter();
  return (
    <div
      className="flex cursor-pointer items-center gap-2 hover:underline"
      onClick={() => router.back()}
    >
      <div className="size-4">
        <Image src="/icons/chevron-left.svg" alt="arrow-left" width={16} height={16} />
      </div>
      <Typography.Caption variant="caption_1_medium" text={t('back')} />
    </div>
  );
}
