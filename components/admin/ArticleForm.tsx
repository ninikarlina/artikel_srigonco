'use client';

import { useState, useRef } from 'react';
import { Article } from '@/lib/types';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ArticleFormProps {
  article?: Article;
  onSubmit: (data: Omit<Article, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ArticleForm({ article, onSubmit, onCancel }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    author: article?.author || '',
    imageUrl: article?.imageUrl || '',
    tags: article?.tags.join(', ') || '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Judul Artikel"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Masukkan judul artikel"
        required
      />

      <Input
        label="Ringkasan"
        name="excerpt"
        value={formData.excerpt}
        onChange={handleChange}
        placeholder="Ringkasan singkat artikel"
        required
      />

      <Textarea
        label="Konten Artikel (Markdown)"
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Tulis konten artikel menggunakan format Markdown..."
        rows={12}
        required
      />

      <Input
        label="Penulis"
        name="author"
        value={formData.author}
        onChange={handleChange}
        placeholder="Nama penulis"
        required
      />

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Gambar Artikel
        </label>
        
        {formData.imageUrl ? (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
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
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">
              {isUploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPEG, PNG, GIF, WebP (Maks. 5MB)
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

      <Input
        label="Tags (pisahkan dengan koma)"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="wisata, budaya, desa"
      />

      <div className="flex justify-end space-x-3 pt-4 border-t-2 border-gray-200">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary" disabled={isUploading}>
          {article ? 'Update Artikel' : 'Buat Artikel'}
        </Button>
      </div>
    </form>
  );
}

