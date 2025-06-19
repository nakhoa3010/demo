'use client';
import { AppButton, Wrapper } from '@/components/shared-components';
import CopyButton from '@/components/shared-components/app-button/copy-button';
import Typography from '@/components/shared-components/typography';
import { useTranslation } from '@/i18n/client';
import useToast from '@/lib/hooks/use-toast';
import Image from 'next/image';
import React, { useState } from 'react';
import CreateAccountSheet from './create-account-sheet';
import { useAccount } from 'wagmi';
import { cn } from '@/lib/utils';
import { FadeInDown } from '@/components/animations';
import { motion } from 'framer-motion';

const steps = [
  {
    title: 'account.step_prepayment',
    type: 'Prepayment address',
    contractAddress: '0x4CCA81CB680d0EE88Bc6Db3931d648DB36F83f3B',
    icon: '/icons/spin.svg',
  },
  {
    title: 'account.step_request_response',
    type: 'Coordinator address',
    contractAddress: '0xe012c95572096D74966A385b4609cbB5bC376F35',
    icon: '/icons/spin.svg',
  },

  {
    title: 'account.step_vrf',
    type: 'Coordinator address',
    contractAddress: '0x9A2699517c3F9955B64F848e683aaDF4AB7BD54B',
    icon: '/icons/spin.svg',
  },

  {
    title: 'account.step_vrf',
    type: 'KeyHash',
    contractAddress: '0x16f30d078cdb35c573cf70cf7f3c74fdbf420e9671bc4df8f9c58822d0b6cd58',
    icon: '/icons/spin.svg',
  },
];

export default function AccountContainer() {
  const { toastSuccess } = useToast();
  const { address } = useAccount();
  const { t } = useTranslation(['common']);
  const [open, setOpen] = useState(false);
  return (
    <FadeInDown>
      <Wrapper className="min-h-[calc(70vh-72px)] flex-1 flex-col justify-center gap-10 py-10 lg:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-6">
          <Typography.Display
            text={t('account.title')}
            className="max-w-[780px] !text-4xl !leading-[48px]"
          />
          <Typography.Body
            variant="18_regular"
            text={t('account.description')}
            className="text-white-60 max-w-[780px]"
          />

          <div className="flex max-w-[780px] flex-row-reverse gap-4">
            {!address && (
              <div className="flex-1">
                <AppButton
                  variant="secondary-gray"
                  text={t('connect_wallet')}
                  className="text-white-60 border-white-30 hover:text-white-80 w-full border bg-[#262626] uppercase"
                  onClick={() => setOpen(true)}
                />
              </div>
            )}
            <div className="flex-1">
              <AppButton
                variant="primary"
                text={t('create_account')}
                className={cn('w-full uppercase lg:w-fit', !address && 'lg:w-full')}
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-6">
          <div className="grid grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.6 }}
                key={`${step.title}-${index}`}
                className="bg-gradient rounded-12 border-white-10 flex flex-col items-start justify-start gap-6 p-5"
              >
                <div className="border-white-10 bg-white-10 flex items-center justify-center rounded-[24px] border p-4">
                  <Image src={step.icon} alt={step.title} width={24} height={24} />
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
                    text={step.type}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <Typography.Body
                      variant="16_regular"
                      className="!text-white-80 text-sm lg:text-base"
                      text={`${step.contractAddress.slice(0, 8)}...${step.contractAddress.slice(-8)}`}
                    />
                    <CopyButton
                      className="size-4"
                      onClick={() => {
                        navigator.clipboard.writeText(step.contractAddress);
                        toastSuccess(t('address_copied'));
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <CreateAccountSheet open={open} onOpenChange={setOpen} />
      </Wrapper>
    </FadeInDown>
  );
}
