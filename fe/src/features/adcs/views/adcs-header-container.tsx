'use client';

import { Wrapper } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { useLocalization } from '@/i18n/hooks';

export default function ADCSHeaderContainer() {
  const { t } = useLocalization('common');
  return (
    <Wrapper className="flex min-h-[500px] flex-1 flex-col items-center gap-6 py-20 lg:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <Typography.Display text={t('adcs.page_title')} />
        <div className="flex flex-col gap-2">
          <Typography.Body
            variant="16_regular"
            text={t('adcs.page_description')}
            className="text-white-60"
          />
          <Typography.Body
            variant="16_regular"
            text={t(
              'ADCS is a customizable template that structures off-chain inference requests, ensuring data flow between on–chain and off–chain environments.',
            )}
            className="text-white-60"
          />
        </div>
      </div>

      <div className="flex flex-1 justify-end"></div>
    </Wrapper>
  );
}
