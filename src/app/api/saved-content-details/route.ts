import { NextResponse } from 'next/server';
import { getArticleBySlug } from '@/utils/articles';
import { getCourseBySlug } from '@/utils/courses';
import { getResourceBySlug } from '@/utils/resources';

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

    switch (contentType) {
      case 'article':
        contentDetails = await getArticleBySlug(contentId);
        break;
      case 'course':
        contentDetails = await getCourseBySlug(contentId);
        break;
      case 'resource':
        contentDetails = await getResourceBySlug(contentId);
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de contenido no válido' },
          { status: 400 }
        );
    }

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