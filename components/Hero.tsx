'use client';

import { ArrowRight, Github, Twitter } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Merhaba, Ben <span className="text-blue-500">Soner Yılmaz</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Profesyonel Yatırımcı & Finans Uzmanı
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
          Hisse senedi, kripto para ve emtia yatırımları konusunda 10 yılı aşkın tecrübemle
          finansal piyasalarda uzmanlık sunuyorum.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#portfolyo"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
          >
            Portfolyom <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="/blog"
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
          >
            Blog Yazılarım
          </a>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <a
            href="https://twitter.com/soner_yilmz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/akrep0121"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
