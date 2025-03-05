import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const savedContent = await prisma.saved_content.findMany({
      where: {
        user_id: params.userId
      },
      orderBy: {
        saved_at: 'desc'
      }
    });

    return NextResponse.json(savedContent);
  } catch (error) {
    console.error('Error fetching saved content:', error);
    return NextResponse.json(
      { error: 'Error al obtener contenido guardado' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { content_id, content_type } = body;

    await prisma.saved_content.deleteMany({
      where: {
        user_id: params.userId,
        content_id,
        content_type
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing saved content:', error);
    return NextResponse.json(
      { error: 'Error al eliminar contenido guardado' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { content_id, content_type } = body;

    const savedItem = await prisma.saved_content.create({
      data: {
        user_id: params.userId,
        content_id,
        content_type
      },
    });

    return NextResponse.json(savedItem);
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { error: 'Error al guardar contenido' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}