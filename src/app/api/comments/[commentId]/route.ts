import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    // no-op
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
    // no-op
  }
}
