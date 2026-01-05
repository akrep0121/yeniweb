import { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/firebase';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getBlogs();

  const blogUrls = blogs.map((blog: any) => ({
    url: `https://soneryilmaz.vercel.app/blog/${blog.slug}`,
    lastModified: new Date(blog.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://sonerylmaz.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://sonerylmaz.vercel.app/blog',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...blogUrls,
    {
      url: 'https://sonerylmaz.vercel.app/#iletisim',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];
}
