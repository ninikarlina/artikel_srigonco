import { Article } from './types';
import { prisma } from './prisma';

export async function getArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
  });
  
  return articles.map((article: typeof articles[0]) => ({
    ...article,
    tags: JSON.parse(article.tags),
    publishedAt: article.publishedAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = await prisma.article.findUnique({
    where: { slug },
  });
  
  if (!article) return null;
  
  return {
    ...article,
    tags: JSON.parse(article.tags),
    publishedAt: article.publishedAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export async function getArticleById(id: string): Promise<Article | null> {
  const article = await prisma.article.findUnique({
    where: { id },
  });
  
  if (!article) return null;
  
  return {
    ...article,
    tags: JSON.parse(article.tags),
    publishedAt: article.publishedAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export async function createArticle(
  data: Omit<Article, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>
): Promise<Article> {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const article = await prisma.article.create({
    data: {
      ...data,
      slug,
      tags: JSON.stringify(data.tags),
    },
  });
  
  return {
    ...article,
    tags: JSON.parse(article.tags),
    publishedAt: article.publishedAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export async function updateArticle(
  id: string,
  updates: Partial<Article>
): Promise<Article | null> {
  const slug = updates.title
    ? updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : undefined;
  
  const article = await prisma.article.update({
    where: { id },
    data: {
      ...updates,
      slug,
      tags: updates.tags ? JSON.stringify(updates.tags) : undefined,
    },
  });
  
  return {
    ...article,
    tags: JSON.parse(article.tags),
    publishedAt: article.publishedAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export async function deleteArticle(id: string): Promise<Article | null> {
  try {
    const article = await prisma.article.delete({
      where: { id },
    });
    return {
      ...article,
      tags: JSON.parse(article.tags),
      publishedAt: article.publishedAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}
