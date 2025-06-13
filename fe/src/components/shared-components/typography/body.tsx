import { cn } from '@/lib/utils';

interface BodyProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  text: string;
  variant?:
    | '24_regular'
    | '20_regular'
    | '18_medium'
    | '18_regular'
    | '16_regular'
    | '14_medium'
    | '14_regular'
    | '12_medium'
    | '12_regular'
    | '10_medium'
    | '10_regular';
}

const classNameMap = {
  '24_regular': 'text-2xl leading-8 font-normal',
  '20_regular': 'text-[20px] leading-7 font-normal',
  '18_medium': 'text-lg leading-6 font-medium',
  '18_regular': 'text-lg leading-6 font-normal',
  '16_regular': 'text-base leading-6 font-normal',
  '14_medium': 'text-sm leading-5 font-medium',
  '14_regular': 'text-sm leading-5 font-normal',
  '12_medium': 'text-xs leading-4 font-medium',
  '12_regular': 'text-xs leading-4 font-normal',
  '10_medium': 'text-xs leading-4 font-medium',
  '10_regular': 'text-xs leading-4 font-normal',
};

export default function Body({ className, text, variant = '24_regular', ...props }: BodyProps) {
  return (
    <span className={cn(classNameMap[variant], className)} {...props}>
      {text}
    </span>
  );
}

export { Body };
