'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import investments from '@/data/investments.json';
import blogs from '@/data/blogs.json';

interface Investment {
  id: number;
  type: string;
  name: string;
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  category: string;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  author: string;
  readTime: string;
  coverImage: string;
  images: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'blogs'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [investmentList, setInvestmentList] = useState<Investment[]>(investments);
  const [blogList, setBlogList] = useState<Blog[]>(blogs);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');

        console.log('Checking auth, token exists:', !!token);

        if (!token) {
          console.log('No token found, redirecting to admin login');
          router.push('/admin');
          return;
        }

        try {
          const response = await fetch('/api/auth', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          console.log('Auth response status:', response.status);

          if (!response.ok) {
            const data = await response.json();
            console.log('Auth failed:', data);
            localStorage.removeItem('adminToken');
            router.push('/admin');
          } else {
            const data = await response.json();
            console.log('Auth success:', data);
            if (!data.authenticated) {
              console.log('Not authenticated, redirecting');
              localStorage.removeItem('adminToken');
              router.push('/admin');
            }
          }
        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('adminToken');
          router.push('/admin');
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const handleDelete = (id: number, type: 'investment' | 'blog') => {
    if (type === 'investment') {
      setInvestmentList(investmentList.filter((item) => item.id !== id));
    } else {
      setBlogList(blogList.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item: any, type: 'investment' | 'blog') => {
    setIsEditing(true);
    setIsAddingNew(false);
    setEditingItem({ ...item, type });
  };

  const handleAddNewBlog = () => {
    setIsAddingNew(true);
    setIsEditing(true);
    setEditingItem({
      id: Math.max(...blogList.map(b => b.id)) + 1,
      type: 'blog',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Yatırım',
      publishedAt: new Date().toISOString().split('T')[0],
      author: 'Soner Yılmaz',
      readTime: '5 dk',
      coverImage: '',
      images: []
    });
  };

  const handleSave = () => {
    if (isAddingNew) {
      setBlogList([...blogList, editingItem]);
    } else if (editingItem.type === 'investment') {
      setInvestmentList(
        investmentList.map((item) =>
          item.id === editingItem.id ? editingItem : item
        )
      );
    } else {
      setBlogList(
        blogList.map((item) =>
          item.id === editingItem.id ? editingItem : item
        )
      );
    }
    setIsEditing(false);
    setIsAddingNew(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAddingNew(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <Header />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700 sticky top-24">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'overview'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Genel Bakış
                  </button>
                  <button
                    onClick={() => setActiveTab('blogs')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'blogs'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    Blog Yazıları
                  </button>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-6 border border-green-700">
                    <h3 className="text-gray-400 mb-2">Blog Yazısı</h3>
                    <p className="text-3xl font-bold text-white">{blogList.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 border border-purple-700">
                    <h3 className="text-gray-400 mb-2">Kategori</h3>
                    <p className="text-3xl font-bold text-white">3</p>
                  </div>
                </div>
              )}

              {activeTab === 'blogs' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Blog Yazıları</h2>
                    <button
                      onClick={handleAddNewBlog}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Yeni Ekle
                    </button>
                  </div>

                  {blogList.map((blog) => (
                    <div
                      key={blog.id}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white">
                            {blog.category}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-2">{blog.title}</h3>
                          <p className="text-gray-400 mt-2">{blog.excerpt}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(blog.publishedAt).toLocaleDateString('tr-TR')} | {blog.readTime}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(blog, 'blog')}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id, 'blog')}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{isAddingNew ? 'Yeni Blog Yazısı' : 'Düzenle'}</h2>
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="space-y-4">
              {Object.keys(editingItem).map((key) => {
                if (key === 'type' || key === 'id') return null;

                if (key === 'images' && Array.isArray(editingItem[key])) {
                  return (
                    <div key={key}>
                      <label className="block text-gray-400 mb-2 capitalize">İçerik Resimleri (virgülle ayırın)</label>
                      <input
                        type="text"
                        value={editingItem[key].join(', ')}
                        onChange={(e) => {
                          const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url.length > 0);
                          setEditingItem({
                            ...editingItem,
                            [key]: urls
                          });
                        }}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  );
                }

                if (key === 'content') {
                  return (
                    <div key={key}>
                      <label className="block text-gray-400 mb-2 capitalize">{key}</label>
                      <textarea
                        value={editingItem[key]}
                        onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                        rows={8}
                        placeholder="Markdown formatında içerik girin..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none resize-none"
                      />
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <label className="block text-gray-400 mb-2 capitalize">{key}</label>
                    <input
                      type={key === 'currentPrice' || key === 'entryPrice' || key === 'quantity' ? 'number' : 'text'}
                      value={editingItem[key]}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                      placeholder={
                        key === 'coverImage' ? 'https://example.com/cover-image.jpg' :
                        key === 'slug' ? 'blog-yazisi-slug' :
                        key === 'category' ? 'Yatırım' :
                        key === 'readTime' ? '5 dk' :
                        undefined
                      }
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                <Save className="w-5 h-5" />
                Kaydet
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
