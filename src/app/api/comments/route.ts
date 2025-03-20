import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch comments for an article
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching comments for article:', articleId);
    
    // Get the comments using correct schema reference
    const comments = await prisma.comments.findMany({
      where: {
        article_id: articleId,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        users_sync: true
      }
    });

    console.log('Found comments:', comments.length);

    // Transform the data to match the client's expected format
    const formattedComments = comments.map(comment => ({
      id: String(comment.id),
      articleId: comment.article_id,
      userId: comment.user_id,
      userName: comment.users_sync?.name || comment.users_sync?.email || 'Usuario',
      content: comment.content,
      createdAt: comment.created_at.toISOString(),
    }));

    return NextResponse.json(formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', details: String(error) },
      { status: 500 }
    );
  }
}

// POST: Create a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId, content, userId, userName } = body;

    console.log('Received comment data:', { articleId, content, userId });

    if (!articleId || !content || !userId) {
      console.error('Missing required fields for comment:', { articleId, content, userId });
      return NextResponse.json(
        { error: 'Missing required fields', received: { articleId, content, userId } },
        { status: 400 }
      );
    }

    // Check if we need to create a user record first
    console.log('Looking for user:', userId);
    let userExists = await prisma.users_sync.findUnique({
      where: { id: userId }
    });

    // If user doesn't exist in the database but we have a user ID from authentication,
    // create a minimal user record to maintain referential integrity
    if (!userExists) {
      console.log('User not found in database, creating minimal record');
      try {
        userExists = await prisma.users_sync.create({
          data: {
            id: userId,
            name: userName || 'Usuario',
            email: null,
            created_at: new Date(),
            updated_at: new Date(),
          }
        });
        console.log('Created minimal user record:', userExists.id);
      } catch (userCreateError) {
        console.error('Failed to create user:', userCreateError);
        // Continue anyway - we'll try to create the comment with the reference
      }
    }

    // Create comment
    console.log('Creating comment for article:', articleId);
    const newComment = await prisma.comments.create({
      data: {
        user_id: userId,
        article_id: articleId,
        content,
        created_at: new Date(),
        updated_at: new Date(),
      }
    });

    console.log('Comment created successfully:', newComment.id);

    // Format the response
    const formattedComment = {
      id: String(newComment.id),
      articleId: newComment.article_id,
      userId: newComment.user_id,
      userName: userName || (userExists?.name || 'Usuario'),
      content: newComment.content,
      createdAt: newComment.created_at.toISOString(),
    };

    return NextResponse.json(formattedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment', details: String(error) },
      { status: 500 }
    );
  }
}
