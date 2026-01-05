'use client';

import BlogCard from './BlogCard';

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

interface RelatedPostsProps {
  currentBlog: Blog;
  allBlogs: Blog[];
}

export default function RelatedPosts({ currentBlog, allBlogs }: RelatedPostsProps) {
  const getRelatedPosts = () => {
    const related = allBlogs
      .filter(blog => blog.slug !== currentBlog.slug)
      .map(blog => {
        let score = 0;

        if (blog.category === currentBlog.category) {
          score += 3;
        }

        if (blog.tags && currentBlog.tags) {
          const matchingTags = blog.tags.filter(tag =>
            currentBlog.tags?.includes(tag)
          );
          score += matchingTags.length * 2;
        }

        const titleWords = currentBlog.title.toLowerCase().split(' ');
        const blogTitleWords = blog.title.toLowerCase().split(' ');
        const matchingWords = titleWords.filter(word =>
          blogTitleWords.includes(word) && word.length > 3
        );
        score += matchingWords.length;

        return { ...blog, score };
      })
      .filter(blog => blog.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return related;
  };

  const relatedPosts = getRelatedPosts();

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6">
        İlgili Yazılar
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedPosts.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}