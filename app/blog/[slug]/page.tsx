import Header from '@/components/Header';
import Footer from '@/components/Footer';
import blogs from '@/data/blogs.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) {
    notFound();
  }

  return (
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

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
