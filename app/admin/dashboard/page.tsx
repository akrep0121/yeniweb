'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnalyticsChart from '@/components/AnalyticsChart';
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface Blog {
  id: string;
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
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

interface Comment {
  id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  createdAt: string;
  approved: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'blogs' | 'comments'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [stats, setStats] = useState({ totalViews: 0, blogViews: {} as Record<string, number> });

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

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const blogs = await response.json();
        setBlogList(blogs);
      } catch (error) {
        console.error('Failed to load blogs:', error);
      }
    };

    const loadComments = async () => {
      try {
        const response = await fetch('/api/comments');
        const comments = await response.json();
        setCommentList(comments);
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    };

    loadBlogs();
    loadComments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const handleDelete = async (id: string, type: 'blog' | 'comment') => {
    console.log('handleDelete called with ID:', id, 'type:', type);

    if (type === 'blog') {
      try {
        const response = await fetch(`/api/blogs?id=${id}`, {
          method: 'DELETE'
        });

        console.log('Delete response status:', response.status);
        const data = await response.json();
        console.log('Delete response data:', data);

        if (response.ok) {
          setBlogList(blogList.filter((item) => item.id !== id));
          alert('Blog başarıyla silindi!');
        } else {
          alert('Silme işlemi başarısız: ' + (data.error || 'Bilinmeyen hata'));
        }
      } catch (error) {
        console.error('Delete blog error:', error);
        alert('Silme işlemi başarısız!');
      }
    } else {
      setCommentList(commentList.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item: any, type: 'blog' | 'comment') => {
    setIsEditing(true);
    setIsAddingNew(false);
    setEditingItem({ ...item, type });
  };

  const handleApproveComment = (commentId: string) => {
    setCommentList(commentList.map(c =>
      c.id === commentId ? { ...c, approved: true } : c
    ));
  };

  const handleRejectComment = (commentId: string) => {
    setCommentList(commentList.filter(c => c.id !== commentId));
  };

  const handleAddNewBlog = () => {
    setIsAddingNew(true);
    setIsEditing(true);
    setEditingItem({
      id: '',
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
      images: [],
      tags: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: []
    });
  };

  const handleSave = async () => {
    if (isAddingNew) {
      try {
        const response = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingItem)
        });

        if (response.ok) {
          const data = await response.json();
          setBlogList([...blogList, data.blog]);
          setIsEditing(false);
          setIsAddingNew(false);
          setEditingItem(null);
        } else {
          alert('Ekleme işlemi başarısız!');
        }
      } catch (error) {
        console.error('Save blog error:', error);
        alert('Kaydetme işlemi başarısız!');
      }
    } else if (editingItem.type === 'blog') {
      try {
        const response = await fetch('/api/blogs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingItem)
        });

        if (response.ok) {
          setBlogList(
            blogList.map((item) =>
              item.id === editingItem.id ? editingItem : item
            )
          );
          setIsEditing(false);
          setIsAddingNew(false);
          setEditingItem(null);
        } else {
          alert('Güncelleme işlemi başarısız!');
        }
      } catch (error) {
        console.error('Save blog error:', error);
        alert('Kaydetme işlemi başarısız!');
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAddingNew(false);
    setEditingItem(null);
  };

  const popularBlogs = Object.entries(stats.blogViews || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const chartData = [
    { name: 'Pzt', views: Math.floor(Math.random() * 100) + 50 },
    { name: 'Sal', views: Math.floor(Math.random() * 100) + 50 },
    { name: 'Çar', views: Math.floor(Math.random() * 100) + 50 },
    { name: 'Per', views: Math.floor(Math.random() * 100) + 50 },
    { name: 'Cum', views: Math.floor(Math.random() * 100) + 50 },
    { name: 'Cmt', views: Math.floor(Math.random() * 100) + 50 },
    { name: 'Paz', views: Math.floor(Math.random() * 100) + 50 },
  ];

  const blogPopularityData = popularBlogs.map(([slug, views]) => {
    const blog = blogList.find(b => b.slug === slug);
    return {
      name: blog?.title?.substring(0, 20) + '...' || 'Unknown',
      views: views
    };
  });

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
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === 'comments'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Yorumlar
                  </button>
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-6 border border-green-700">
                      <h3 className="text-gray-400 mb-2">Toplam Ziyaret</h3>
                      <p className="text-3xl font-bold text-white">{stats.totalViews}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 border border-blue-700">
                      <h3 className="text-gray-400 mb-2">Blog Yazısı</h3>
                      <p className="text-3xl font-bold text-white">{blogList.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 border border-purple-700">
                      <h3 className="text-gray-400 mb-2">Toplam Yorum</h3>
                      <p className="text-3xl font-bold text-white">{commentList.length}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnalyticsChart
                      type="line"
                      data={chartData}
                      dataKey="views"
                      title="Haftalık Ziyaret Grafiği"
                      color="blue"
                    />
                    <AnalyticsChart
                      type="bar"
                      data={blogPopularityData}
                      dataKey="views"
                      title="En Popüler Blog'lar"
                      color="green"
                    />
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
                        <div className="flex-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white">
                            {blog.category}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-2">{blog.title}</h3>
                          <p className="text-gray-400 mt-2">{blog.excerpt}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{new Date(blog.publishedAt).toLocaleDateString('tr-TR')} | {blog.readTime}</span>
                            <span>👁 {stats.blogViews[blog.slug] || 0}</span>
                          </div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {blog.tags.map((tag) => (
                                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
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

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Yorumlar</h2>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Onaylı: {commentList.filter(c => c.approved).length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        Beklemede: {commentList.filter(c => !c.approved).length}
                      </span>
                    </div>
                  </div>

                  {commentList.length === 0 && (
                    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                      <p className="text-gray-400">Henüz yorum yok</p>
                    </div>
                  )}

                  {commentList.map((comment) => {
                    const blog = blogList.find(b => b.slug === comment.blogId);
                    return (
                      <div
                        key={comment.id}
                        className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border ${
                          comment.approved ? 'border-green-700' : 'border-yellow-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {comment.approved ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Clock className="w-5 h-5 text-yellow-600" />
                              )}
                              <span className="font-semibold text-white">{comment.name}</span>
                              <span className="text-sm text-gray-500">{comment.email}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed mb-2">{comment.comment}</p>
                            {blog && (
                              <p className="text-sm text-gray-400">
                                Blog: <span className="text-blue-400">{blog.title}</span>
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {!comment.approved && (
                              <button
                                onClick={() => handleApproveComment(comment.id)}
                                className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
                                title="Onayla"
                              >
                                <CheckCircle className="w-4 h-4 text-white" />
                              </button>
                            )}
                            <button
                              onClick={() => handleRejectComment(comment.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                              title="Sil"
                            >
                              <XCircle className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

                if (key === 'tags' && Array.isArray(editingItem[key])) {
                  return (
                    <div key={key}>
                      <label className="block text-gray-400 mb-2 capitalize">Etiketler (virgülle ayırın)</label>
                      <input
                        type="text"
                        value={editingItem[key].join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
                          setEditingItem({
                            ...editingItem,
                            [key]: tags
                          });
                        }}
                        placeholder="yatırım, strateji, 2024"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  );
                }

                if (key === 'metaKeywords' && Array.isArray(editingItem[key])) {
                  return (
                    <div key={key}>
                      <label className="block text-gray-400 mb-2 capitalize">Meta Keywords (virgülle ayırın)</label>
                      <input
                        type="text"
                        value={editingItem[key].join(', ')}
                        onChange={(e) => {
                          const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0);
                          setEditingItem({
                            ...editingItem,
                            [key]: keywords
                          });
                        }}
                        placeholder="yatırım, finans, blog"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  );
                }

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
                      <label className="block text-gray-400 mb-2 capitalize">İçerik</label>
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
                      type={key === 'readTime' || key === 'publishedAt' || key === 'coverImage' ? 'text' : 'text'}
                      value={editingItem[key]}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          [key]: e.target.value
                        })
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                      placeholder={
                        key === 'coverImage' ? 'https://example.com/cover-image.jpg' :
                        key === 'slug' ? 'blog-yazisi-slug' :
                        key === 'category' ? 'Yatırım' :
                        key === 'readTime' ? '5 dk' :
                        key === 'metaTitle' ? 'Meta Başlığı (override)' :
                        key === 'metaDescription' ? 'Meta Açıklaması' :
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
