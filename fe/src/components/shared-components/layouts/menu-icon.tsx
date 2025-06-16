import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  useGetIsMobileMenuOpen,
  useSetIsMobileMenuOpen,
} from '@/lib/global-store/use-global-store';

export default function MenuIcon() {
  const { onToggleIsMobileMenuOpen } = useSetIsMobileMenuOpen();
  const isMobileMenuOpen = useGetIsMobileMenuOpen();

  return (
    <div className="size-6 lg:hidden">
      <motion.div
        initial={false}
        animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onClick={() => onToggleIsMobileMenuOpen(!isMobileMenuOpen)}
        className="cursor-pointer"
      >
        <Image
          src={isMobileMenuOpen ? '/icons/close.svg' : '/icons/menu.svg'}
          alt="menu"
          width={24}
          height={24}
        />
      </motion.div>
    </div>
  );
}
