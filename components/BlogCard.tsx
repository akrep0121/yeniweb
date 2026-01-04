'use client';

import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    publishedAt: string;
    readTime: string;
    coverImage?: string;
    tags?: string[];
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all h-full flex flex-col">
        {blog.coverImage && (
          <div className="h-48 overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white font-semibold">
              {blog.category}
            </span>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.publishedAt).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-3">{blog.title}</h3>
          <p className="text-gray-400 text-sm mb-4 flex-grow">{blog.excerpt}</p>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {blog.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime} okuma</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500 text-sm font-semibold">
              Devamı <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
