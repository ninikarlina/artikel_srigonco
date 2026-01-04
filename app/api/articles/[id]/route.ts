import { NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/data';
import { unlink } from 'fs/promises';
import path from 'path';

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
    
    // Delete associated image file if it exists
    if (deletedArticle.imageUrl && deletedArticle.imageUrl.startsWith('/images/articles/')) {
      try {
        const filename = deletedArticle.imageUrl.split('/').pop();
        if (filename) {
          const filePath = path.join(process.cwd(), 'public', 'images', 'articles', filename);
          await unlink(filePath);
        }
      } catch (fileError) {
        // Log error but don't fail the request if image deletion fails
        console.error('Failed to delete image file:', fileError);
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
