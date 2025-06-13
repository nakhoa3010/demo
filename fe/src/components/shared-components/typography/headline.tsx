import { cn } from '@/lib/utils';

interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  text: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h6-mobile';
}

export default function Headline({ className, text, variant = 'h3', ...props }: HeadlineProps) {
  const classNameMap = {
    h1: 'text-[40px] leading-[48px] font-medium tracking-[0px] text-white lg:text-[56px] lg:leading-[64px]',
    h2: 'text-[32px] leading-[40px] font-medium tracking-[0px] text-white lg:text-[48px] lg:leading-[56px]',
    h3: 'text-2xl leading-8 font-medium tracking-[0px] text-white lg:text-[40px] lg:leading-[48px]',
    h4: 'text-[20px] leading-[28px] font-medium tracking-[0px] text-white lg:text-[32px] lg:leading-[40px]',
    h5: 'text-[18px] leading-[24px] font-medium tracking-[0px] text-white lg:text-[24px] lg:leading-[32px]',
    h6: 'text-[16px] leading-[24px] font-medium tracking-[0px] text-white lg:text-[20px] lg:leading-[28px]',
    'h6-mobile': 'text-[16px] leading-[24px] font-medium tracking-[0px] text-white',
  };

  const Component = variant.includes('mobile') ? 'span' : 'h6';

  return (
    <Component className={cn(classNameMap[variant], className)} {...props}>
      {text}
    </Component>
  );
}

export { Headline };
