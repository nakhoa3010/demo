import React from 'react';
import Wrapper from '@/components/shared-components/wrapper';
import Typography from '@/components/shared-components/typography';
import LogoAnimation from '../components/logo-animation';

const description = `Whether you're a seasoned trader or just starting your crypto journey, MergeMint is your trusted partner every step of the way. Experience the future of crypto trading with MergeMint - where simplicity meets innovation.`;

const HomeMainSection = () => {
  return (
    <Wrapper className="relative flex min-h-[calc(90vh-72px)] flex-col gap-4 py-[135px] lg:justify-center">
      <Typography.Headline
        variant="h1"
        text="Seamless Crypto  Exchange"
        className="text-white-90 font-normal lg:max-w-[651px]"
      />
      <Typography.Body
        variant="14_regular"
        className="text-white-60 max-w-[520px]"
        text={description}
      />

      <LogoAnimation />
    </Wrapper>
  );
};

export default HomeMainSection;
