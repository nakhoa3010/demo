'use client';

import { useLocalization } from '@/i18n/hooks';
import { Locale, languageNames } from '@/i18n/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import Image from 'next/image';
import Typography from './typography';
import AppIcon from './icons';
export function LanguageSwitcher() {
  const { currentLocale, switchLocale } = useLocalization();
  const { t } = useLocalization('common');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 px-4 py-2">
          <AppIcon iconName="language" />
          <Typography.Body
            variant="14_medium"
            className="text-white-60"
            text={languageNames[currentLocale]}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-none">
        {Object.entries(languageNames).map(([code, name]) => {
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => switchLocale(code as Locale)}
              className="flex cursor-pointer justify-between"
            >
              <Typography.Caption text={t(name.toLowerCase())} className="cursor-pointer" />
              {currentLocale === code && (
                <Image src="/icons/check.svg" alt="check" width={12} height={12} />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
