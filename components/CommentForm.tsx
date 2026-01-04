'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Comment {
  id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  createdAt: string;
  approved: boolean;
}

interface CommentFormProps {
  blogId: string;
  onCommentSubmit: (comment: Omit<Comment, 'id' | 'approved' | 'createdAt'>) => void;
}

export default function CommentForm({ blogId, onCommentSubmit }: CommentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'İsim alanı boş olamaz';
    }
    if (!formData.email.trim()) {
      return 'E-posta alanı boş olamaz';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Geçerli bir e-posta adresi girin';
    }
    if (!formData.comment.trim()) {
      return 'Yorum alanı boş olamaz';
    }
    if (formData.comment.trim().length < 10) {
      return 'Yorum en az 10 karakter olmalı';
    }
    if (formData.comment.trim().length > 500) {
      return 'Yorum en fazla 500 karakter olabilir';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newComment = {
        blogId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        comment: formData.comment.trim()
      };

      onCommentSubmit(newComment);

      setSuccess(true);
      setFormData({ name: '', email: '', comment: '' });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Yorum Yap</h3>

      {success && (
        <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded-lg mb-4">
          Yorumunuz başarıyla gönderildi! Admin onayından sonra görünecek.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">İsim</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            placeholder="Adınız Soyadınız"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">E-posta</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            placeholder="e-posta@adres.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Yorum</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={4}
            maxLength={500}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
            placeholder="Yorumunuzu yazın..."
            disabled={loading}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.comment.length}/500
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Yorum Gönder
            </>
          )}
        </button>
      </form>
    </div>
  );
}
