import { Locale } from '@/i18n/types';

//format date to dd-mm-yyyy hh:mm
const getLocale = (locale: Locale) => {
  switch (locale) {
    case 'en':
      return 'en-US';
    case 'vi':
      return 'vi-VN';
    default:
      return 'en-US';
  }
};
export const formatDate = (date: string, locale: Locale) => {
  return new Date(date).toLocaleDateString(getLocale(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const shortAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};
