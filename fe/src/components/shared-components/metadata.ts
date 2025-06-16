import { GOOGLE_SITE_VERIFICATION, SiteName, SiteUrl } from '@/lib/constans/app-link';
import { Metadata } from 'next';

interface MetadataProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  url?: string;
  isNoIndex?: boolean;
  canonical: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  type?: 'website' | 'article' | 'book' | 'profile';
  locale?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  imageUrl,
  url,
  isNoIndex = false,
  canonical,
  author = SiteName,
  publishedTime,
  modifiedTime,
  type = 'website',
  locale = 'en_US',
}: MetadataProps): Metadata {
  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    openGraph: {
      title,
      description,
      type,
      locale,
      siteName: SiteName,
      images: imageUrl ? [imageUrl] : [],
      url: url,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
      creator: author,
      site: `@${SiteName}`,
    },
    robots: {
      index: !isNoIndex,
      follow: true,
      googleBot: {
        index: !isNoIndex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical,
    },
    verification: {
      google: GOOGLE_SITE_VERIFICATION,
    },
    category: 'health',
    metadataBase: new URL(SiteUrl),
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
  };
}
