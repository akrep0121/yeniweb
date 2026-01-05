'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';
import SearchBar from '@/components/SearchBar';
import Tags from '@/components/Tags';
import Footer from '@/components/Footer';

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

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    blogs.forEach(blog => {
      if (blog.tags) {
        blog.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let filtered = blogs as any[];
    
    filtered = filtered.sort((a: Blog, b: Blog) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    if (activeTag) {
      filtered = filtered.filter((blog: any) =>
        blog.tags && blog.tags.includes(activeTag)
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((blog: any) =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        (blog.tags && blog.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      );
    }
    
    return filtered;
  }, [blogs, searchQuery, activeTag]);

  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-24 pb-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Blog</h1>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Yatırım, finans ve piyasa analizi üzerine yazılar
          </p>

          <div className="mb-8">
            <SearchBar
              onSearch={setSearchQuery}
              resultCount={filteredBlogs.length}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              {filteredBlogs.length === 0 && (
                <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                  <p className="text-gray-400 text-lg">
                    {searchQuery || activeTag
                      ? `"${searchQuery || activeTag}" ile sonuç bulunamadı`
                      : 'Henüz blog yazısı yok'}
                  </p>
                  {activeTag && (
                    <button
                      onClick={() => setActiveTag('')}
                      className="mt-4 text-blue-500 hover:text-blue-400 font-semibold"
                    >
                      Filtreyi kaldır
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="lg:w-1/4">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-4">
                  Popüler Etiketler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                        activeTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
