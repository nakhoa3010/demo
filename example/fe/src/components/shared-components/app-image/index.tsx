'use client';
import { cn } from '@/lib/utils';
import { memo, useState } from 'react';

const defaultFallbackSrc = '/placeholder-image.jpg';

interface IAppImageProps {
  src: string;
  size?: number;
  className?: string;
  fallbackSrc?: string;
}

const AppImage = ({ src, size = 200, className, fallbackSrc }: IAppImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc || defaultFallbackSrc);
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={src}
      width={size}
      height={size}
      className={cn('object-cover', className)}
      loading="lazy"
      onError={handleError}
    />
  );
};

export default memo(AppImage);
