'use client';
import { Wrapper } from '@/components/shared-components';
import CopyButton from '@/components/shared-components/app-button/copy-button';
import Typography from '@/components/shared-components/typography';
import { useLocalization } from '@/i18n/hooks';
import useToast from '@/lib/hooks/use-toast';
import { shortAddress } from '@/lib/utils/format';
import { Database, Route } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

const Routes = [
  {
    icon: <Database />,
    title: 'Feed Router',
    description: 'Feed Router address',
    address: '0x653078f0d3a230416a59aa6486466470db0190a2',
  },

  {
    icon: <Route />,
    title: 'Submission Proxy',
    description: 'Submission Proxy address',
    address: '0xcb56b163e545a3870ca04c6ae2401f2405fb29a9',
  },
];

export default function DataFeedHeader() {
  const { t } = useLocalization('common');
  const { toastSuccess } = useToast();
  return (
    <Wrapper className="flex min-h-[500px] flex-1 flex-col items-center gap-6 py-20 lg:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <Typography.Display text={t('data_feed.page_title')} />
        <div className="flex flex-col gap-2">
          <Typography.Body
            variant="16_regular"
            text={t('data_feed.page_description')}
            className="text-white-60"
          />
          <Typography.Body
            variant="16_regular"
            text={t('data_feed.page_description_2')}
            className="text-white-60"
          />
        </div>
      </div>

      <div className="flex flex-1 justify-end">
        <div className="grid grid-cols-2 gap-4">
          {Routes.map((step, index) => (
            <motion.div
              key={`${step.title}-${index}`}
              className="bg-gradient rounded-12 border-white-10 flex flex-col items-start justify-start gap-6 border p-5"
              whileHover={{ borderColor: 'rgba(34, 197, 94, 0.5)', scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="border-white-10 bg-white-10 flex items-center justify-center rounded-[24px] border p-4">
                {step.icon}
              </div>
              <Typography.Headline
                variant="h6"
                text={t(step.title as keyof typeof t)}
                className="font-normal"
              />
              <div className="flex flex-col items-start justify-between gap-1">
                <Typography.Body
                  variant="16_regular"
                  className="text-white-60"
                  text={step.description}
                />
                <div className="flex items-center justify-between gap-2">
                  <Typography.Body
                    variant="16_regular"
                    className="!text-white-80 text-sm lg:text-base"
                    text={shortAddress(step.address)}
                  />
                  <CopyButton
                    className="size-4"
                    onClick={() => {
                      navigator.clipboard.writeText(step.address);
                      toastSuccess(t('address_copied'));
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
