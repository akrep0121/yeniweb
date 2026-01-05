'use client';

import Link from 'next/link';
import { marked } from 'marked';
import parse from 'html-react-parser';

interface KeywordLinkProps {
  content: string;
  currentSlug: string;
  allBlogs: Array<{
    slug: string;
    title: string;
    tags?: string[];
  }>;
}

function getKeywordLinks(currentSlug: string, allBlogs: KeywordLinkProps['allBlogs']) {
  const keywords: { [key: string]: string } = {};

  allBlogs.forEach(blog => {
    if (blog.slug === currentSlug) return;

    const titleWords = blog.title
      .toLowerCase()
      .replace(/[^\w\sçğıöşü]/gi, '')
      .split(' ')
      .filter(word => word.length > 4);

    titleWords.forEach(word => {
      if (!keywords[word]) {
        keywords[word] = blog.slug;
      }
    });

    if (blog.tags) {
      blog.tags.forEach(tag => {
        if (!keywords[tag] && tag.length > 3) {
          keywords[tag] = blog.slug;
        }
      });
    }
  });

  return keywords;
}

function replaceWithLinks(html: string, keywordLinks: { [key: string]: string }, currentSlug: string) {
  const keywords = Object.keys(keywordLinks);
  if (keywords.length === 0) return html;

  const escapedKeywords = keywords.map(keyword =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  const regex = new RegExp(
    `\\b(${escapedKeywords.join('|')})\\b`,
    'gi'
  );

  return html.replace(regex, (match, word) => {
    const lowerWord = word.toLowerCase().replace(/[^\w\sçğıöşü]/gi, '');
    const linkedSlug = keywordLinks[lowerWord];

    if (linkedSlug) {
      return `<a href="/blog/${linkedSlug}" class="text-blue-400 hover:text-blue-300 underline font-medium">${word}</a>`;
    }

    return word;
  });
}

export default function KeywordLink({ content, currentSlug, allBlogs }: KeywordLinkProps) {
  const keywordLinks = getKeywordLinks(currentSlug, allBlogs);

  if (Object.keys(keywordLinks).length === 0) {
    const html = marked.parse(content) as string;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const html = marked.parse(content) as string;
  const linkedHtml = replaceWithLinks(html, keywordLinks, currentSlug);

  return <div>{parse(linkedHtml)}</div>;
}