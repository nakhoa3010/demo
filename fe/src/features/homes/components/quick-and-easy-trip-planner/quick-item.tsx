import React from 'react';
import AppImage from '@/components/shared-components/app-image';
import Typography from '@/components/shared-components/typography';
import Link from 'next/link';
export interface IQuickItem {
  id: number;
  name: string;
  location: string;
  image: string;
}

interface IQuickItemProps {
  item: IQuickItem;
}

export default function QuickItem({ item }: IQuickItemProps) {
  const { name, location, image } = item;
  return (
    <Link href="#">
      <div className="flex w-[244px] flex-col gap-5 hover:cursor-pointer">
        <div className="rounded-16 relative h-[244px] w-full overflow-hidden bg-red-200">
          <AppImage
            src={image}
            className="rounded-16 w-full object-cover transition-all duration-1000 hover:scale-110"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Typography.Headline variant="h6" text={name} />
          <Typography.Body variant="14_regular" text={location} className="text-gray-600" />
        </div>
      </div>
    </Link>
  );
}
