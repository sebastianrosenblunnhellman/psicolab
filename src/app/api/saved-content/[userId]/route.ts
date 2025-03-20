import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch saved content for a user
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log('Fetching saved content for user:', params.userId);
    
    // Ensure user exists
    const user = await prisma.users_sync.findUnique({
      where: { id: params.userId }
    });

    if (!user) {
      console.log('User not found, creating minimal record');
      // Create minimal user record if not exists
      try {
        await prisma.users_sync.create({
          data: {
            id: params.userId,
            name: 'Usuario',
            created_at: new Date(),
            updated_at: new Date(),
          }
        });
        console.log('Created minimal user record');
      } catch (error) {
        console.error('Failed to create user:', error);
        // Continue anyway
      }
    }
    
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
      { error: 'Error al obtener contenido guardado', details: String(error) },
      { status: 500 }
    );
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
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { content_id, content_type } = body;
    
    console.log('Saving content:', { userId: params.userId, content_id, content_type });
    
    // Ensure user exists
    const user = await prisma.users_sync.findUnique({
      where: { id: params.userId }
    });

    if (!user) {
      console.log('User not found, creating minimal record');
      // Create minimal user record if not exists
      try {
        await prisma.users_sync.create({
          data: {
            id: params.userId,
            name: 'Usuario',
            created_at: new Date(),
            updated_at: new Date(),
          }
        });
        console.log('Created minimal user record');
      } catch (error) {
        console.error('Failed to create user:', error);
        // Continue anyway
      }
    }
    
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
    return NextResponse.json(
      { error: 'Error al guardar contenido', details: String(error) },
      { status: 500 }
    );
  }
}