import { Wrapper } from '@/components/shared-components';
import Typography from '@/components/shared-components/typography';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

export default function Header() {
  return (
    <Wrapper>
      <div className="flex w-full items-center justify-between">
        <Typography.Headline text="Flip coin" />

        <ConnectButton />
      </div>
    </Wrapper>
  );
}
