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

// PUT: Update a comment
export async function PUT(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const body = await request.json();
    const { content, userId } = body;
    const commentId = parseInt(params.commentId);

    if (!content) {
      return NextResponse.json(
        { error: 'Se requiere el contenido del comentario' },
        { status: 400 }
      );
    }

    // Verify the user owns this comment
    const existingComment = await prisma.comments.findUnique({
      where: { id: commentId }
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    if (existingComment.user_id !== userId) {
      return NextResponse.json(
        { error: 'No autorizado para editar este comentario' },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.comments.update({
      where: { id: commentId },
      data: { content }
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el comentario' },
      { status: 500 }
    );
  } finally {
    // Don't disconnect in development to maintain connection pool
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}

// DELETE: Delete a comment
export async function DELETE(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const commentId = parseInt(params.commentId);

    if (!userId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del usuario' },
        { status: 400 }
      );
    }

    // Verify the user owns this comment
    const existingComment = await prisma.comments.findUnique({
      where: { id: commentId }
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    if (existingComment.user_id !== userId) {
      return NextResponse.json(
        { error: 'No autorizado para eliminar este comentario' },
        { status: 403 }
      );
    }

    await prisma.comments.delete({
      where: { id: commentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el comentario' },
      { status: 500 }
    );
  } finally {
    // Don't disconnect in development to maintain connection pool
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}
