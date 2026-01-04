import Header from '@/components/Header';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';
import blogs from '@/data/blogs.json';

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-24 pb-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Blog</h1>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Yatırım, finans ve piyasa analizi üzerine yazılar
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
