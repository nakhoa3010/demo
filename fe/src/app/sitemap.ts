import { MetadataRoute } from 'next';
import { locales } from '@/i18n/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://runx.app';

  // Define your routes - add all your public routes here
  const routes = ['', '/withdraw', '/policy', '/terms-of-service', '/order'];

  // Dynamic routes are typically not included in sitemaps directly
  // For SEO: search engines should discover these pages through links on your site
  // If you want to include examples, uncomment the code below:
  /*
  // Example order IDs - replace with real fetched IDs in production
  const orderIds = ['123', '456', '789'];
  const orderDetailRoutes = orderIds.map(id => `/order/${id}/confirm`);
  */

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and route
  for (const locale of locales) {
    for (const route of routes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    }

    // Uncomment to add dynamic routes to sitemap
    /*
    for (const route of orderDetailRoutes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
    */
  }

  return sitemap;
}
