export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  imageUrl?: string;
  tags: string[];
}

export type ArticleInput = Omit<Article, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>;
