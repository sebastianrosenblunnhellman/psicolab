import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance and reuse it
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to prevent multiple instances during hot-reloading
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = (global as any).prisma;
}

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
    // Don't disconnect in development to maintain connection pool
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
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
    // Don't disconnect in development to maintain connection pool
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const { content_id, content_type } = body;
    
    console.log('Saving content:', { userId: params.userId, content_id, content_type });
    
    // Check if the item already exists to avoid unique constraint violation
    const existingItem = await prisma.saved_content.findFirst({
      where: {
        user_id: params.userId,
        content_id,
        content_type
      }
    });
    
    if (existingItem) {
      console.log('Content already saved:', existingItem);
      return NextResponse.json(existingItem);
    }

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
    // Return more detailed error information
    return NextResponse.json(
      { error: 'Error al guardar contenido', details: String(error) },
      { status: 500 }
    );
  } finally {
    // Don't disconnect in development to maintain connection pool
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}