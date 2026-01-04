import { NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/data';
import { del } from '@vercel/blob';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Get current article to check if image is being changed
    const currentArticle = await getArticleById(id);
    if (!currentArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // If image is being updated and old image exists in Blob, delete it
    if (data.imageUrl && currentArticle.imageUrl && 
        data.imageUrl !== currentArticle.imageUrl &&
        currentArticle.imageUrl.includes('vercel-storage.com')) {
      try {
        await del(currentArticle.imageUrl);
      } catch (error) {
        console.error('Failed to delete old image from Blob:', error);
      }
    }
    
    const updated = await updateArticle(id, data);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deletedArticle = await deleteArticle(id);
    
    if (!deletedArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    // Delete associated image from Vercel Blob if it exists
    if (deletedArticle.imageUrl && deletedArticle.imageUrl.includes('vercel-storage.com')) {
      try {
        await del(deletedArticle.imageUrl);
      } catch (error) {
        console.error('Failed to delete image from Blob:', error);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
