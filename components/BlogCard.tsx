'use client';

import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    publishedAt: string;
    readTime: string;
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all h-full flex flex-col">
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
    </Link>
  );
}
