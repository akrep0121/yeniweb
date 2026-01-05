'use client';

import Link from 'next/link';
import { marked } from 'marked';

interface KeywordLinkProps {
  content: string;
  currentSlug: string;
  allBlogs: Array<{
    slug: string;
    title: string;
    tags?: string[];
  }>;
}

export default function KeywordLink({ content, currentSlug, allBlogs }: KeywordLinkProps) {
  const getKeywordLinks = () => {
    const keywords: { [key: string]: string } = {};

    allBlogs.forEach(blog => {
      if (blog.slug === currentSlug) return;

      const titleWords = blog.title
        .toLowerCase()
        .replace(/[^\w\sçğıöşü]/gi, '')
        .split(' ')
        .filter(word => word.length > 3);

      titleWords.forEach(word => {
        if (!keywords[word]) {
          keywords[word] = blog.slug;
        }
      });

      if (blog.tags) {
        blog.tags.forEach(tag => {
          if (!keywords[tag]) {
            keywords[tag] = blog.slug;
          }
        });
      }
    });

    return keywords;
  };

  const keywordLinks = getKeywordLinks();
  const linkKeywords = Object.keys(keywordLinks);

  if (linkKeywords.length === 0) {
    const html = marked.parse(content) as string;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const escapedKeywords = linkKeywords.map(keyword =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  const regex = new RegExp(
    `\\b(${escapedKeywords.join('|')})\\b`,
    'gi'
  );

  const parts = content.split(regex);

  return (
    <div>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase().replace(/[^\w\sçğıöşü]/gi, '');
        const linkedSlug = keywordLinks[lowerPart];

        if (linkedSlug && index % 2 === 1) {
          const html = marked.parse(part) as string;
          return (
            <Link
              key={index}
              href={`/blog/${linkedSlug}`}
              className="text-blue-400 hover:text-blue-300 underline font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        const html = marked.parse(part) as string;
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}