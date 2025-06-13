import { cn } from '@/lib/utils';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { WRAPPER_WIDTH } from '@/lib/constans';

interface CarouselWrapperProps {
  className?: string;
  items: React.ReactNode[];
  itemSize?: string;
  itemKey: string[];
}

export default function CarouselWrapper({ items, itemKey, className }: CarouselWrapperProps) {
  const position = WRAPPER_WIDTH / 2;
  return (
    <Carousel
      className={cn('relative w-full', className)}
      style={{ paddingLeft: `calc(50% - ${position}px)` }}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem className={cn('basis-1/ pl-5')} key={itemKey[index]}>
            {item}
          </CarouselItem>
        ))}
      </CarouselContent>

      <div
        className="absolute top-5 z-20 flex -translate-y-1/2 gap-2"
        style={{ right: `calc(50% - ${position}px)` }}
      >
        <CarouselPrevious className="relative top-0 left-0 size-10 translate-y-0 cursor-pointer rounded-full border-none bg-neutral-50 shadow-none" />
        <CarouselNext className="relative top-0 right-0 size-10 translate-y-0 cursor-pointer rounded-full border-none bg-neutral-50 shadow-none" />
      </div>
    </Carousel>
  );
}
