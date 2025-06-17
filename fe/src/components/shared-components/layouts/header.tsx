'use client';
import Typography from '../typography';
import { LanguageSwitcher } from '../language-switcher';
import MenuIcon from './menu-icon';
import MobileNavigate from './mobile-navigate';
import { cn } from '@/lib/utils';
import Wrapper from '../wrapper';
import AppLogo from '../app-logo';
import Link from 'next/link';
import { navigations } from '@/lib/constans';
import { useLocalization, useLocalizedRoutes } from '@/i18n/hooks';
import { usePathname } from 'next/navigation';
import UserInfo from './user-info';
interface HeaderProps {
  hideNavigation?: boolean;
  hideOrderNow?: boolean;
  className?: string;
  wrapperClassName?: string;
}
export default function Header({ hideNavigation, className, wrapperClassName }: HeaderProps) {
  const { t } = useLocalization('common');
  const { currentLocale } = useLocalizedRoutes();
  const pathname = usePathname();

  return (
    <>
      <header
        className={cn('fixed top-0 right-0 left-0 z-50 flex backdrop-blur-sm', wrapperClassName)}
      >
        <Wrapper className={cn('justify-between py-4', className)}>
          <AppLogo />

          <div className="hidden items-center gap-12 lg:flex">
            {navigations.map((nav) => (
              <Link
                href={`/${currentLocale}${nav.path}`}
                target={nav.target}
                key={nav.label}
                className="hover:text-green-300"
              >
                <Typography.Body
                  variant="14_medium"
                  text={t(nav.label)}
                  className={cn(
                    'hover_line !text-white-80 uppercase',
                    pathname.includes(nav.path) && '!text-green-300 underline',
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <UserInfo />
            <MenuIcon />
          </div>
        </Wrapper>
      </header>
      <MobileNavigate hideNavigation={hideNavigation} />
    </>
  );
}
