'use client';

import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef, useEffect } from 'react';
interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  onInView?: () => void;
  className?: string;
}

export default function FadeInUp({ children, delay = 0, onInView, className }: FadeInSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView && onInView) {
      onInView();
    }
  }, [isInView, onInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
