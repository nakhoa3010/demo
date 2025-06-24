'use client';

import Image from 'next/image';
import { memo, useState } from 'react';
import { icons, AppIconName } from './constance';

const defaultFallbackSrc = '/placeholder-image.jpg';

interface IconProps {
  iconName: AppIconName;
  size?: number;
  className?: string;
  fallbackSrc?: string;
}

const AppIcon = ({ iconName, size = 20, className, fallbackSrc }: IconProps) => {
  const [imgSrc, setImgSrc] = useState(icons[iconName]);
  return (
    <Image
      src={imgSrc}
      alt={iconName}
      width={size}
      height={size}
      className={className}
      onError={() => {
        setImgSrc(fallbackSrc || defaultFallbackSrc);
      }}
    />
  );
};

export default memo(AppIcon);
