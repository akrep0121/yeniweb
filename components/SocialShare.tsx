'use client';

import { useState } from 'react';
import { Share2, Check, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = (platform: string) => {
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-bold text-white">Paylaş</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg transition-all font-semibold"
          title="Twitter/X ile paylaş"
        >
          <Twitter className="w-5 h-5" />
          <span className="hidden sm:inline">X</span>
        </button>

        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 bg-[#4267B2] hover:bg-[#3a5a9c] text-white px-4 py-2 rounded-lg transition-all font-semibold"
          title="Facebook ile paylaş"
        >
          <Facebook className="w-5 h-5" />
          <span className="hidden sm:inline">Facebook</span>
        </button>

        <button
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 bg-[#0077B5] hover:bg-[#006394] text-white px-4 py-2 rounded-lg transition-all font-semibold"
          title="LinkedIn ile paylaş"
        >
          <Linkedin className="w-5 h-5" />
          <span className="hidden sm:inline">LinkedIn</span>
        </button>

        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebc57] text-white px-4 py-2 rounded-lg transition-all font-semibold"
          title="WhatsApp ile paylaş"
        >
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all font-semibold ${
            copied ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
          title="Linki kopyala"
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Link2 className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">
            {copied ? 'Kopyalandı!' : 'Link'}
          </span>
        </button>
      </div>
    </div>
  );
}
