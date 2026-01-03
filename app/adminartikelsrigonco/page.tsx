'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchArticles();
  }, []);

  // Create article
  const handleCreate = async (data: Omit<Article, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await fetchArticles();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  // Update article
  const handleUpdate = async (data: Omit<Article, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>) => {
    if (!editingArticle) return;
    
    try {
      const response = await fetch(`/api/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await fetchArticles();
        setIsModalOpen(false);
        setEditingArticle(null);
      }
    } catch (error) {
      console.error('Error updating article:', error);
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

  const openCreateModal = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

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
            <Button onClick={openCreateModal} variant="primary" size="lg">
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Artikel Baru
            </Button>
          </div>

          {/* Articles List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat artikel...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-lg mb-4">Belum ada artikel</p>
              <Button onClick={openCreateModal} variant="primary">
                Buat Artikel Pertama
              </Button>
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
                          <Button
                            onClick={() => openEditModal(article)}
                            variant="secondary"
                            size="sm"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
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

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingArticle ? 'Edit Artikel' : 'Buat Artikel Baru'}
        >
          <ArticleForm
            article={editingArticle || undefined}
            onSubmit={editingArticle ? handleUpdate : handleCreate}
            onCancel={closeModal}
          />
        </Modal>
      </main>
      <Footer />
    </>
  );
}
