import Wrapper from '@/components/shared-components/wrapper';
import Typography from '@/components/shared-components/typography';
import React from 'react';
import InspirationTabs from './inspiration-tabs';

export default function InspirationForFutureGetaways() {
  return (
    <Wrapper className="flex flex-col gap-10 pb-20">
      <Typography.Headline variant="h2" text="inspiration_for_future_getaways" />
      <InspirationTabs />
    </Wrapper>
  );
}
