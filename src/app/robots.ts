import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/upload/', '/admin/'],
      },
    ],
    sitemap: 'https://hanroro-fansite.vercel.app/sitemap.xml',
  };
}
