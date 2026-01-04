'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PencilIcon, TrashIcon, PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (!response.ok) {
          router.push('/adminartikelsrigonco/login');
          return;
        }
        setIsAuthenticated(true);
        fetchArticles();
      } catch (error) {
        router.push('/adminartikelsrigonco/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/adminartikelsrigonco/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Delete article
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchArticles();
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Kelola artikel website Desa Srigonco</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleLogout} variant="secondary" size="lg">
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </Button>
              <Link href="/adminartikelsrigonco/artikel/baru">
                <Button variant="primary" size="lg">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Buat Artikel Baru
                </Button>
              </Link>
            </div>
          </div>

          {/* Articles List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat artikel...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-lg mb-4">Belum ada artikel</p>
              <Link href="/adminartikelsrigonco/artikel/baru">
                <Button variant="primary">
                  Buat Artikel Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y-2 divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Penulis
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="font-semibold text-gray-900">{article.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-1 mt-1">{article.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {article.author}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(article.publishedAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/adminartikelsrigonco/artikel/${article.id}/edit`}>
                            <Button
                              variant="secondary"
                              size="sm"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            onClick={() => handleDelete(article.id)}
                            variant="danger"
                            size="sm"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
