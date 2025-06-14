'use client';
import { useLocalization } from '@/i18n/hooks';
import { cn } from '@/lib/utils';
import React from 'react';

export type FeedType = 'premium' | 'basic';

interface IFeedTypeProps {
  type: FeedType;
}
export default function FeedTypes({ type }: IFeedTypeProps) {
  const { t } = useLocalization('common');

  const variants = {
    premium: 'text-orange-500 border border-orange-600 text-xs',
    basic: 'text-neutral-500 border border-neutral-600 text-xs',
  };

  return (
    <div className={cn('rounded-full px-2 py-1', variants[type])}>{t(`data_feed.${type}`)}</div>
  );
}
