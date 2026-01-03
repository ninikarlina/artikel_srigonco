import { Article } from './types';

// Mock data - dalam production, gunakan database
export let articles: Article[] = [
  {
    id: '1',
    title: 'Mengenal Desa Srigonco: Permata Tersembunyi di Jawa Tengah',
    slug: 'mengenal-desa-srigonco',
    excerpt: 'Desa Srigonco adalah sebuah desa yang kaya akan budaya dan tradisi lokal yang masih terjaga hingga saat ini.',
    content: `
# Mengenal Desa Srigonco

Desa Srigonco merupakan salah satu desa yang terletak di Jawa Tengah dengan keindahan alam yang memukau. Desa ini memiliki berbagai potensi wisata dan budaya yang menarik untuk dikunjungi.

## Keunikan Desa Srigonco

Desa Srigonco memiliki beberapa keunikan yang membedakannya dengan desa lain:

1. **Tradisi Lokal**: Masih mempertahankan berbagai tradisi dan adat istiadat
2. **Keindahan Alam**: Pemandangan persawahan dan perbukitan yang asri
3. **Masyarakat yang Ramah**: Penduduk yang sangat ramah terhadap wisatawan

## Potensi Wisata

Desa ini memiliki berbagai potensi wisata yang dapat dikembangkan, seperti wisata alam, wisata budaya, dan wisata kuliner khas daerah.
    `,
    author: 'Tim KKN Kelompok 3',
    publishedAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1464983308776-8eb7bb67bc82?w=800',
    tags: ['wisata', 'budaya', 'desa']
  },
  {
    id: '2',
    title: 'Potensi UMKM di Desa Srigonco',
    slug: 'potensi-umkm-desa-srigonco',
    excerpt: 'Berbagai usaha mikro, kecil, dan menengah di Desa Srigonco menunjukkan potensi ekonomi yang menjanjikan.',
    content: `
# Potensi UMKM di Desa Srigonco

UMKM (Usaha Mikro, Kecil, dan Menengah) menjadi tulang punggung perekonomian Desa Srigonco. Berbagai produk lokal dihasilkan oleh masyarakat dengan kualitas yang tidak kalah dengan produk luar.

## Jenis UMKM yang Berkembang

1. **Kerajinan Tangan**: Anyaman bambu dan produk lokal lainnya
2. **Kuliner**: Makanan khas daerah yang lezat
3. **Pertanian**: Produk hasil bumi yang berkualitas

Mari dukung UMKM lokal untuk kemajuan ekonomi desa!
    `,
    author: 'Tim KKN Kelompok 3',
    publishedAt: '2026-01-02T14:30:00Z',
    updatedAt: '2026-01-02T14:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
    tags: ['umkm', 'ekonomi', 'wirausaha']
  }
];

export function getArticles(): Article[] {
  return articles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

export function getArticleById(id: string): Article | undefined {
  return articles.find(article => article.id === id);
}

export function createArticle(article: Omit<Article, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>): Article {
  const now = new Date().toISOString();
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const newArticle: Article = {
    ...article,
    id: Date.now().toString(),
    slug,
    publishedAt: now,
    updatedAt: now,
  };
  
  articles.push(newArticle);
  return newArticle;
}

export function updateArticle(id: string, updates: Partial<Article>): Article | null {
  const index = articles.findIndex(article => article.id === id);
  if (index === -1) return null;
  
  const slug = updates.title
    ? updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : articles[index].slug;
  
  articles[index] = {
    ...articles[index],
    ...updates,
    slug,
    updatedAt: new Date().toISOString(),
  };
  
  return articles[index];
}

export function deleteArticle(id: string): boolean {
  const index = articles.findIndex(article => article.id === id);
  if (index === -1) return false;
  
  articles.splice(index, 1);
  return true;
}
