import { AppButton, AppCard } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { shortAddress } from '@/lib/utils/format';
import { ChevronRight, CloudUpload, SquareUser, Wallet } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const steps = [
  <Wallet key="1" className="size-8 text-green-300" />,
  <CloudUpload key="2" className="size-8 text-green-300" />,
  <SquareUser key="3" className="size-8 text-green-300" />,
];

interface CreateAccountContentProps {
  onDoItLater?: () => void;
}

export default function CreateAccountContent({ onDoItLater }: CreateAccountContentProps) {
  const { t } = useTranslation();
  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={cn(
                  'rounded-12 bg-5 flex w-fit items-center justify-center border p-2',
                  index === 0 && 'border-green-300',
                  index === 1 && 'border-green-800 bg-neutral-900',
                  index === 2 && 'bg-neutral-90 border-green-800',
                )}
              >
                {step}
              </div>
              {index < steps.length - 1 && (
                <div className="h-[2px] w-10 rounded-full bg-green-800" />
              )}
            </div>
          ))}
        </div>
        <SheetTitle />
        <div className="flex flex-col gap-4">
          <Typography.Headline
            variant="h6"
            text={t('create_account_sheet.title')}
            className="text-white-80"
          />
          <Typography.Body
            variant="14_regular"
            className="text-white-80"
            text={t('create_account_sheet.description')}
          />
          <Typography.Caption
            variant="caption_1_regular"
            className="text-white-60"
            text={t('create_account_sheet.as_an_owner')}
          />

          <AppCard className="flex flex-col gap-2">
            <Typography.Body variant="14_regular" text="Owner address" className="text-white-80" />
            <Typography.Body
              variant="14_medium"
              text={shortAddress('0x1234567890abcdef1234567890abcdef12345678')}
              className="text-white-80"
            />
          </AppCard>
        </div>
      </SheetHeader>
      <div className="mt-5 flex flex-col gap-1 px-4">
        <AppButton
          variant="primary"
          text={t('create_account')}
          iconRight={<ChevronRight className="size-6" />}
        />

        <AppButton
          variant="link"
          text={t('create_account_sheet.do_it_later')}
          className="text-white-60 text-sm"
          onClick={onDoItLater}
        />
      </div>
    </>
  );
}
