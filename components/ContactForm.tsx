'use client';

import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mesajınız başarıyla gönderildi!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="iletisim" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-4">İletişime Geç</h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Yatırım danışmanlığı veya işbirliği için bana ulaşın
        </p>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Ad Soyad
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-posta
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="e-posta@adres.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Mesajınız
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-5 h-5" />
              Mesaj Gönder
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Veya doğrudan sosyal medyadan ulaşabilirsiniz:</p>
            <a
              href="https://twitter.com/soner_yilmz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
            >
              @soner_yilmz
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
