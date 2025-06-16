'use client';
import React from 'react';
import {
  useGetIsMobileMenuOpen,
  useSetIsMobileMenuOpen,
} from '@/lib/global-store/use-global-store';
import { motion, AnimatePresence } from 'framer-motion';
import { navigations } from '@/lib/constans';
import Typography from '../typography';
import { useLocalization } from '@/i18n/hooks';
import Link from 'next/link';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

interface MobileNavigateProps {
  hideNavigation?: boolean;
}

export default function MobileNavigate({ hideNavigation }: MobileNavigateProps) {
  const { t } = useLocalization('common');

  const isMobileMenuOpen = useGetIsMobileMenuOpen();

  const { onToggleIsMobileMenuOpen } = useSetIsMobileMenuOpen();

  const handleNavigationClick = () => {
    onToggleIsMobileMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-black-80 fixed inset-0 z-40 flex h-[100vh] w-full flex-col items-center justify-center lg:hidden"
        >
          <div className="mt-12 flex h-full w-full flex-col px-5">
            {hideNavigation && <div className="h-[100px] w-full" />}
            {!hideNavigation && (
              <motion.div
                className="mt-17 mb-[280px] flex flex-col gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {navigations.map((item) => (
                  <motion.div key={item.label} variants={itemVariants}>
                    <Link href={item.path} className="hover_line" onClick={handleNavigationClick}>
                      <Typography.Body
                        text={t(item.label)}
                        className="text-[30px] leading-[48px] font-medium tracking-[-0.6px]"
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
