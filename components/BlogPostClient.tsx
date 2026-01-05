'use client';

import { useEffect, useState } from 'react';
import CommentForm from '@/components/CommentForm';
import SocialShare from '@/components/SocialShare';
import { Eye } from 'lucide-react';

interface BlogPostClientProps {
  blogSlug: string;
  blogTitle: string;
}

interface Stats {
  totalViews: number;
  blogViews: Record<string, number>;
}

export default function BlogPostClient({ blogSlug, blogTitle }: BlogPostClientProps) {
  const [commentList, setCommentList] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({ totalViews: 0, blogViews: {} });

  useEffect(() => {
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

    fetchComments();
    fetchStats();
    fetch(`/api/stats?slug=${blogSlug}&action=view`);
  }, [blogSlug]);

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

  return (
    <>
      <div className="flex items-center gap-6 text-gray-400 mb-8">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>{stats.blogViews[blogSlug] || 0} görüntülenme</span>
        </div>
      </div>

      <div className="lg:col-span-2">
        <CommentForm blogId={blogSlug} onCommentSubmit={handleCommentSubmit} />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <SocialShare
            url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${blogSlug}`}
            title={blogTitle}
          />
        </div>
      </div>
    </>
  );
}