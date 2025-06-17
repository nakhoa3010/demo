/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { motion } from 'framer-motion';
import Typography from '@/components/shared-components/typography';
import { shortAddress } from '@/lib/utils/format';
import CopyButton from '@/components/shared-components/app-button/copy-button';
import useToast from '@/lib/hooks/use-toast';
import { IADCSItem } from '@/types/adcs-type';
import { useLocalization } from '@/i18n/hooks';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function ADCSItem({ adcs }: { adcs: IADCSItem }) {
  const { t } = useLocalization('common');
  const { toastSuccess } = useToast();

  return (
    <motion.div
      key={`${adcs.name}-${adcs.id}`}
      className="bg-gradient rounded-12 border-white-10 flex flex-col items-start justify-start gap-6 border p-5"
      whileHover={{ borderColor: 'rgba(34, 197, 94, 0.5)', scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-4">
        <div className="border-white-10 bg-white-10 rounded-12 flex items-center justify-center border p-2">
          <img src={adcs.iconUrl} alt={adcs.name} className="size-20 rounded-full" />
        </div>
        <div className="flex flex-col items-start justify-between gap-1">
          <Typography.Headline variant="h6" text={adcs.name} className="font-normal text-wrap" />
          <div className="flex items-center justify-between gap-2">
            <Typography.Caption
              variant="caption_1_regular"
              text={`${shortAddress(adcs.id)} | ${adcs.category}`}
            />
            <CopyButton
              className="size-3"
              onClick={() => {
                navigator.clipboard.writeText(adcs.id);
                toastSuccess(t('address_copied'));
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Typography.Caption variant="caption_1_regular" text={adcs.coreLLM} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-1">
        <Typography.Body variant="14_regular" className="text-white-60" text={adcs.description} />
      </div>

      <div className="bg-white-10 h-[1px] w-full" />

      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex flex-col items-center justify-between gap-2">
          <Typography.Caption variant="caption_1_regular" text={t('adcs.request_count')} />
          <Typography.Caption variant="caption_1_regular" text={`${adcs.requestCount}`} />
        </div>
        <div className="flex flex-col items-center justify-between gap-2">
          <Typography.Caption variant="caption_1_regular" text={t('adcs.input_type')} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="text-white-60 size-4" />
            </TooltipTrigger>
            <TooltipContent>{JSON.stringify(adcs.inputSchema, null, 2)}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-col items-center justify-between gap-2">
          <Typography.Caption variant="caption_1_regular" text={t('adcs.output_type')} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="text-white-60 size-4" />
            </TooltipTrigger>
            <TooltipContent>{JSON.stringify(adcs.outputSchema, null, 2)}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}
