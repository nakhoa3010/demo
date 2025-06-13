import { NextRequest, NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from './i18n/types';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.includes('/api/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check if pathname contains supported locale
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameLocale) return;

  // If no locale, determine locale from headers
  let locale = defaultLocale;

  // Determine locale from request headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  try {
    const languages = new Negotiator({
      headers: negotiatorHeaders,
    }).languages();
    locale = matchLocale(languages, locales, defaultLocale);
  } catch (e) {
    console.error('Error matching locale:', e);
  }

  // Redirect to same pathname with locale added, preserving query parameters
  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${search}`, request.url),
  );

  // Add locale to response headers
  response.headers.set('x-locale', locale);

  return response;
}

// Apply middleware for frontend routing
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
