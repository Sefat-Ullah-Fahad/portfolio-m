import { SITE } from '@/lib/site';

export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
