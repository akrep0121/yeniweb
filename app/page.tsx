'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import InvestmentCard from '@/components/InvestmentCard';
import BlogCard from '@/components/BlogCard';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import investments from '@/data/investments.json';
import blogs from '@/data/blogs.json';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
        if (isAdminLoggedIn === 'true') {
          router.push('/admin/dashboard');
        } else {
          router.push('/admin');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      <section id="portfolyo" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Yatırım Portfolyom</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Hisse senetleri, kripto paralar ve emtialar çeşitlendirilmiş portfolyo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Son Blog Yazıları</h2>
              <p className="text-gray-400">Yatırım ve finans dünyasından güncel içerikler</p>
            </div>
            <a
              href="/blog"
              className="hidden md:block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Tüm Yazılar →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <a
              href="/blog"
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Tüm Yazılar →
            </a>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </div>
  );
}
