'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Tags from '@/components/Tags';
import Comments from '@/components/Comments';
import CommentForm from '@/components/CommentForm';
import SocialShare from '@/components/SocialShare';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Eye } from 'lucide-react';

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

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [commentList, setCommentList] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalViews: 0, blogViews: {} as Record<string, number> });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('=== FETCHING BLOG ===');
        console.log('Slug from params:', params.slug);
        
        const response = await fetch('/api/blogs');
        const blogs = await response.json();
        console.log('All blogs:', blogs);
        console.log('Blogs length:', Array.isArray(blogs) ? blogs.length : 'not array');
        
        if (Array.isArray(blogs)) {
          blogs.forEach((b: Blog, i: number) => {
            console.log(`Blog ${i}:`, {
              id: b.id,
              title: b.title,
              slug: b.slug,
              slugType: typeof b.slug
            });
          });
        }
        
        const foundBlog = blogs.find((b: Blog) => b.slug === params.slug);
        console.log('Found blog:', foundBlog);
        console.log('Found blog ID:', foundBlog?.id);
        console.log('Found blog title:', foundBlog?.title);
        
        setBlog(foundBlog || null);

        if (foundBlog) {
          fetch(`/api/stats?slug=${foundBlog.slug}&action=view`);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch('/api/comments');
        const comments = await response.json();
        setCommentList(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchBlog();
    fetchComments();
    fetchStats();
  }, [params.slug]);

  const handleCommentSubmit = (newComment: any) => {
    const comment = {
      ...newComment,
      id: Date.now().toString(),
      approved: false,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...commentList, comment];
    setCommentList(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Blog yazısı bulunamadı</div>
      </div>
    );
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
              <Eye className="w-4 h-4" />
              <span>{stats.blogViews[blog.slug] || 0} görüntülenme</span>
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
              <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Comments blogId={blog.slug} comments={commentList} />
              <div className="mt-8">
                <CommentForm blogId={blog.slug} onCommentSubmit={handleCommentSubmit} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <SocialShare
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${blog.slug}`}
                  title={blog.title}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
