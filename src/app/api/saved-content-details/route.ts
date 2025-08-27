import { NextResponse } from 'next/server';
import { getArticleBySlug } from '@/utils/articles';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('content_id');
  const contentType = searchParams.get('content_type');

    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: 'Se requiere content_id y content_type' },
        { status: 400 }
      );
    }

    let contentDetails = null;

    if (contentType !== 'article') {
      return NextResponse.json(
        { error: 'Solo se permite tipo de contenido article' },
        { status: 400 }
      );
    }

    contentDetails = await getArticleBySlug(contentId);

    if (!contentDetails) {
      return NextResponse.json(
        { error: 'Contenido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(contentDetails);
  } catch (error) {
    console.error('Error fetching content details:', error);
    return NextResponse.json(
      { error: 'Error al obtener detalles del contenido' },
      { status: 500 }
    );
  }
}