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

    // Fetch all comments for the article, include user profile
    const all = await (prisma as any).comments.findMany({
      where: { article_id: articleId },
      orderBy: { created_at: 'asc' },
      include: {
        users_sync: {
          include: { user_profile: true },
        },
      },
    });

    // Group into threads
    const byId: Record<string, any> = {};
    const roots: any[] = [];
    for (const c of all) {
      const base = {
        id: String(c.id),
        articleId: c.article_id,
        userId: c.user_id,
        userName: c.users_sync?.name || (c.users_sync as any)?.email || 'Usuario',
        avatarUrl: (c.users_sync as any)?.user_profile?.profile_picture_url || null,
        content: c.content,
        createdAt: c.created_at.toISOString(),
        updatedAt: c.updated_at.toISOString(),
        parentId: (c as any).parent_id ? String((c as any).parent_id) : null,
        replies: [] as any[],
      };
      byId[base.id] = base;
    }
    // Attach children
    for (const id in byId) {
      const node = byId[id];
      if (node.parentId) {
        const parent = byId[node.parentId];
        if (parent) parent.replies.push(node);
        else roots.push(node); // orphan safety
      } else {
        roots.push(node);
      }
    }
    // Sort: newest threads first, replies oldest first
    roots.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    for (const r of roots) {
      r.replies.sort((a: any, b: any) => (a.createdAt > b.createdAt ? 1 : -1));
    }

    return NextResponse.json(roots);
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
  const { articleId, content, userId, userName, parentId } = body;

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
    // Create comment or reply
  const newComment = await (prisma as any).comments.create({
      data: {
        user_id: userId,
        article_id: articleId,
        content,
    parent_id: parentId ? parseInt(parentId) : null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        users_sync: {
          include: { user_profile: true },
        },
      },
    });

    console.log('Comment created successfully:', newComment.id);

    // Format the response
    const formattedComment = {
      id: String(newComment.id),
      articleId: newComment.article_id,
      userId: newComment.user_id,
      userName: userName || (userExists?.name || 'Usuario'),
      avatarUrl: (newComment as any)?.users_sync?.user_profile?.profile_picture_url || null,
      content: newComment.content,
      createdAt: newComment.created_at.toISOString(),
      updatedAt: newComment.updated_at.toISOString(),
      parentId: parentId ? String(parentId) : null,
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
