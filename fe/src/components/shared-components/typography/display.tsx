import { cn } from '@/lib/utils';

interface DisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  text: string;
}

export default function Display({ className, text, ...props }: DisplayProps) {
  return (
    <span
      className={cn(
        'text-5xl leading-[58px] font-medium tracking-[0px] text-white lg:text-7xl lg:leading-[80px]',
        className,
      )}
      {...props}
    >
      {text}
    </span>
  );
}

export { Display };
