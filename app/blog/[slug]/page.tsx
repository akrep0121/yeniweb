import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tags from '@/components/Tags';
import Comments from '@/components/Comments';
import BlogPostClient from '@/components/BlogPostClient';
import RelatedPosts from '@/components/RelatedPosts';
import KeywordLink from '@/components/KeywordLink';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { marked } from 'marked';
import { getBlogBySlug, getComments, getBlogs } from '@/lib/firebase';
import type { Metadata } from 'next';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  author: string;
  readTime: string;
  coverImage: string;
  images: string[];
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

interface PageProps {
  params: {
    slug: string;
  };
}

async function getBlogData(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const blog = await getBlogBySlug(decodedSlug);
  return blog;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const blog = await getBlogData(params.slug);

  if (!blog) {
    return {
      title: 'Blog Yazısı Bulunamadı',
      description: 'Blog yazısı bulunamadı',
    };
  }

  const title = blog.metaTitle || `${blog.title} | Soner Yılmaz`;
  const description = blog.metaDescription || blog.excerpt || `${blog.title} - Yatırım, finans ve piyasa analizi üzerine yazı`;

  return {
    title: title,
    description: description,
    keywords: blog.metaKeywords?.join(', '),
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      publishedTime: blog.publishedAt,
      authors: [blog.author],
      images: blog.coverImage ? [blog.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const blog = await getBlogData(params.slug);
  const comments = await getComments();
  const allBlogs = await getBlogs();

  if (!blog) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.content?.substring(0, 160),
    image: blog.coverImage,
    author: {
      '@type': 'Person',
      name: blog.author,
      url: 'https://yeniweb.vercel.app'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Soner Yılmaz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yeniweb.vercel.app/logo.png'
      }
    },
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yeniweb.vercel.app/blog/${blog.slug}`
    },
    keywords: blog.metaKeywords?.join(', ') || blog.tags?.join(', ') || '',
    articleSection: blog.category
  };

  const contentHtml = marked.parse(blog.content || '') as string;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        <Header />

      <article className="pt-24 pb-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Blog'a Dön
          </Link>

          {blog.coverImage && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <div className="mb-8">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white font-semibold">
              {blog.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{blog.title}</h1>

          <div className="flex items-center gap-6 text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.publishedAt).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{blog.author}</span>
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8">
              <Tags
                tags={blog.tags}
                size="medium"
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <KeywordLink
                content={blog.content || ''}
                currentSlug={blog.slug}
                allBlogs={allBlogs}
              />
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <RelatedPosts currentBlog={blog} allBlogs={allBlogs} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <Comments blogId={blog.slug} comments={comments} />
              <div className="mt-8">
                <BlogPostClient blogSlug={blog.slug} blogTitle={blog.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}