import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Typography from '../typography';

interface Tab {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AppTabsProps {
  tabs: Tab[];
  activeTab: string;
  className?: string;
  layoutId: string;
  onTabClick: (value: string) => void;
}

export default function AppTabs({
  tabs,
  activeTab,
  onTabClick,
  className,
  layoutId,
}: AppTabsProps) {
  return (
    <motion.div className={cn('flex w-fit gap-10 border-b border-neutral-100', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon ? tab.icon : null;
        return (
          <motion.div
            key={tab.value}
            className={cn('relative flex flex-col pb-4')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => onTabClick(tab.value)}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'size-6 text-neutral-500',
                    activeTab === tab.value && 'text-neutral-900',
                  )}
                />
              )}
              <Typography.Headline
                variant="h6-mobile"
                text={tab.label}
                className={cn(
                  'cursor-pointer text-neutral-500 transition-colors duration-300',
                  activeTab === tab.value && 'text-neutral-900',
                )}
              />
            </div>

            {activeTab === tab.value && (
              <motion.div
                className="absolute bottom-[-1px] h-[2px] w-full bg-neutral-900"
                layoutId={`${layoutId}-active-tab`}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
