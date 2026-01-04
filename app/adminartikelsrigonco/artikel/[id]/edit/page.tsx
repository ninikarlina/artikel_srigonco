'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/lib/types';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowLeftIcon,
  EyeIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    imageUrl: '',
    tags: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check authentication and fetch article
  useEffect(() => {
    const init = async () => {
      try {
        // Check auth
        const authResponse = await fetch('/api/auth/check');
        if (!authResponse.ok) {
          router.push('/adminartikelsrigonco/login');
          return;
        }
        setIsAuthenticated(true);

        // Fetch article
        const articleResponse = await fetch(`/api/articles/${id}`);
        if (!articleResponse.ok) {
          router.push('/adminartikelsrigonco');
          return;
        }
        
        const article: Article = await articleResponse.json();
        setFormData({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          author: article.author,
          imageUrl: article.imageUrl || '',
          tags: article.tags.join(', '),
        });
      } catch (error) {
        console.error('Error:', error);
        router.push('/adminartikelsrigonco');
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      });
      
      if (response.ok) {
        router.push('/adminartikelsrigonco');
      }
    } catch (error) {
      console.error('Error updating article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData(prev => ({
        ...prev,
        imageUrl: data.imageUrl,
      }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: '',
    }));
  };

  if (!isAuthenticated || isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Memuat artikel...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/adminartikelsrigonco')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">Edit Artikel</h1>
                <p className="text-sm md:text-base text-gray-600 mt-1">Perbarui konten artikel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Editor
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-5 w-5 mr-2" />
                    Preview
                  </>
                )}
              </Button>
            </div>
          </div>

          {showPreview ? (
            /* Preview Mode */
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              {formData.imageUrl && (
                <div className="w-full h-80 overflow-hidden border-b-2 border-gray-200">
                  <img 
                    src={formData.imageUrl} 
                    alt={formData.title || 'Preview'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-8">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                  {formData.title || 'Judul Artikel'}
                </h1>
                <p className="text-gray-600 mb-4">{formData.author || 'Penulis'}</p>
                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {formData.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm font-medium border border-blue-600 text-blue-600 rounded-md"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="prose prose-sm md:prose-lg max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      a: ({ href, children }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >{formData.content || '*Konten artikel akan muncul di sini...*'}</ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            /* Editor Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <Input
                      label="Judul Artikel"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Masukkan judul artikel yang menarik"
                      required
                    />
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <Textarea
                      label="Ringkasan Artikel"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      placeholder="Tulis ringkasan singkat yang menggambarkan isi artikel..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Konten Artikel (Markdown)
                    </label>
                    <div className="text-xs text-gray-500 mb-3">
                      Gunakan format Markdown: **tebal**, *miring*, # Heading, - list, [link](url)
                    </div>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Tulis konten artikel di sini..."
                      rows={20}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Publish Card */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Publikasi</h3>
                    <div className="space-y-4">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full"
                        disabled={isSubmitting || isUploading}
                      >
                        {isSubmitting ? 'Menyimpan...' : 'Update Artikel'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => router.push('/adminartikelsrigonco')}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <Input
                      label="Penulis"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Nama penulis"
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <Input
                      label="Tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="wisata, budaya, desa"
                    />
                    <p className="text-xs text-gray-500 mt-2">Pisahkan dengan koma</p>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Gambar Artikel
                    </label>
                    
                    {formData.imageUrl ? (
                      <div className="relative">
                        <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image
                            src={formData.imageUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                      >
                        <PhotoIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 font-medium">
                          {isUploading ? 'Mengupload...' : 'Upload gambar'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Maks. 5MB
                        </p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
