'use client';

import { useState } from 'react';
import { Article } from '@/lib/types';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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

      <Input
        label="URL Gambar"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />

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
        <Button type="submit" variant="primary">
          {article ? 'Update Artikel' : 'Buat Artikel'}
        </Button>
      </div>
    </form>
  );
}
