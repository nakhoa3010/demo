import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ICopyButtonProps {
  onClick?: () => void;
  className?: string;
  imgClassName?: string;
}
export default function CopyButton({ onClick, className, imgClassName }: ICopyButtonProps) {
  return (
    <motion.div
      className={cn('cursor-pointer', className)}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
    >
      <Image src="/icons/copy.svg" alt="copy" width={24} height={24} className={imgClassName} />
    </motion.div>
  );
}
