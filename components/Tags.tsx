'use client';

import { X } from 'lucide-react';
import Link from 'next/link';

interface TagsProps {
  tags: string[];
  activeTag?: string;
  onTagClick?: (tag: string) => void;
  showRemove?: boolean;
  onRemove?: (tag: string) => void;
  size?: 'small' | 'medium' | 'large';
}

const tagColors = [
  'bg-blue-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-orange-600',
  'bg-pink-600',
  'bg-cyan-600',
  'bg-yellow-600',
  'bg-red-600',
];

export default function Tags({
  tags,
  activeTag,
  onTagClick,
  showRemove = false,
  onRemove,
  size = 'medium'
}: TagsProps) {
  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={tag}
          onClick={() => onTagClick && onTagClick(tag)}
          className={`
            ${getTagColor(index)}
            text-white rounded-full font-semibold
            inline-flex items-center gap-1
            ${onTagClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
            ${activeTag === tag ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
            ${getSizeClass()}
          `}
        >
          #{tag}
          {showRemove && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tag);
              }}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
