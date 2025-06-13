import { cn } from '@/lib/utils';

interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  text: string;
  variant?: 'caption_1_medium' | 'caption_1_regular';
}

const classNameMap = {
  caption_1_medium: 'text-[12px] font-medium leading-[18px] text-white-60',
  caption_1_regular: 'text-[12px] font-normal leading-[18px] text-white-60',
};

export default function Caption({
  className,
  text,
  variant = 'caption_1_medium',
  ...props
}: CaptionProps) {
  return (
    <span className={cn('text-base font-normal', classNameMap[variant], className)} {...props}>
      {text}
    </span>
  );
}

export { Caption };
