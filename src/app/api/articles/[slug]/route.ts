import { NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(article);
}
