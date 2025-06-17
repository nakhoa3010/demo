'use client';
import Link from 'next/link';
import Typography from '../typography';
import Wrapper from '../wrapper';
import AppLogo from '../app-logo';
import { LanguageSwitcher } from '../language-switcher';
import { APP_NAME, AppLinks, navigations } from '@/lib/constans';
import { Facebook, Instagram, Twitter, Linkedin } from '@/assets/icons';
import { useLocalization, useLocalizedRoutes } from '@/i18n/hooks';

const socials = [
  {
    icon: Facebook,
    url: AppLinks.socials.facebook,
  },
  {
    icon: Instagram,
    url: AppLinks.socials.instagram,
  },
  {
    icon: Twitter,
    url: AppLinks.socials.twitter,
  },
  {
    icon: Linkedin,
    url: AppLinks.socials.linkedin,
  },
];

export default function Footer() {
  const { t } = useLocalization('common');
  const { currentLocale } = useLocalizedRoutes();
  return (
    <div
      className="bg-gradient-bg border-neutral-05 border-white-05 mt-32 flex flex-col rounded-t-[16px] border-t"
      style={{
        background:
          'linear-gradient(180deg, rgba(253, 26, 26, 0.07) 0%, rgba(153, 153, 153, 0.07) 100%)',
      }}
    >
      <Wrapper className="flex min-h-1 flex-col justify-between pt-20 lg:flex-row">
        <div className="flex flex-1 flex-col gap-10">
          <AppLogo />
        </div>
        <div className="mt-8 flex flex-1 flex-col gap-8 lg:mt-0 lg:flex-row">
          {navigations.map((nav, index) => (
            <Link
              href={`/${currentLocale}${nav.path}`}
              target={nav.target}
              key={`${nav.label}-${index}`}
            >
              <Typography.Headline
                variant="h6-mobile"
                text={t(nav.label)}
                className="hover_line !text-white-60 uppercase"
              />
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-1 justify-center gap-4 lg:mt-0 lg:flex-row lg:justify-end lg:gap-4">
          {socials.map((social) => (
            <Link href={social.url} target="_blank" key={social.icon}>
              {social.icon && <social.icon className="hover:text-white-60 h-6 w-6 text-white" />}
            </Link>
          ))}
        </div>
      </Wrapper>
      <Wrapper className="flex flex-col">
        <div className="bg-white-10 mt-4 h-[1px] w-full lg:mt-16" />
        <div className="flex justify-between py-8">
          <Typography.Body
            variant="12_regular"
            className="text-neutral-500"
            text={`© Copyright 2025. ${APP_NAME}`}
          />

          <div className="flex gap-8">
            <LanguageSwitcher />
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
