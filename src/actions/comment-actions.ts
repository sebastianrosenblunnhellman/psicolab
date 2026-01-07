'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Tipos para el frontend
export type CommentWithUser = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    email: string | null;
    profile: {
        avatarUrl: string | null;
        firstName: string;
        lastName: string;
    } | null;
  };
  parentId: string | null;
  children: CommentWithUser[];
};

export async function getComments(articleSlug: string): Promise<CommentWithUser[]> {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: articleSlug }
    });

    if (!article) return [];

    // Fetch all comments flat, then reconstruct tree in JS (often more efficient than deep recursion in SQL/Prisma include)
    // Actually, for moderate depth, getting all and sorting is fine.
    const comments = await prisma.comment.findMany({
      where: { articleId: article.id },
      include: {
        user: {
            select: {
                email: true,
                profile: {
                    select: {
                        avatarUrl: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        }
      },
      orderBy: { createdAt: 'desc' } // Newest first
    });

    // Helper to build tree
    const buildTree = (comments: any[]) => {
      const map: { [key: string]: any } = {};
      const roots: any[] = [];
      
      // Initialize map
      comments.forEach(c => {
        map[c.id] = { ...c, children: [] };
      });

      // Link children
      comments.forEach(c => {
        if (c.parentId) {
          if (map[c.parentId]) {
            map[c.parentId].children.push(map[c.id]);
          }
        } else {
          roots.push(map[c.id]);
        }
      });
      
      // Sort children by date asc (replies usually chronological)
      const sortChildren = (nodes: any[]) => {
         nodes.forEach(node => {
             node.children.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
             sortChildren(node.children);
         });
      };
      
      sortChildren(roots);
      return roots;
    };

    return buildTree(comments) as CommentWithUser[];

  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function postComment(articleSlug: string, content: string, parentId?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Debes iniciar sesión para comentar" };

  if (!content.trim()) return { error: "El comentario no puede estar vacío" };

  try {
    // 1. Ensure article exists in DB (Lazy Sync like courses/likes)
    // We assume the article exists if we are on its page, but maybe not in DB.
    // However, unlike Likes which sync on button press, Article page usually doesn't create DB entry on load.
    // Let's safe-guard: upsert.
    // Note: We need the title if creating. But we only have slug here.
    // Ideally we pass title too, but if not, we use slug as title fallback or fetch MD.
    // For simplicity, we assume the article was created when the Like button was loaded (it calls getContentLikeStatus which can create?)
    // Actually getContentLikeStatus doesn't create. toggleLike does.
    
    // Let's find first. If not found, we create with slug as title (better than failing).
    let article = await prisma.article.findUnique({ where: { slug: articleSlug } });
    
    if (!article) {
       article = await prisma.article.create({
           data: {
               slug: articleSlug,
               title: articleSlug // Fallback, expected to be updated later or provided
           }
       });
    }

    // 2. Create Comment
    await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        articleId: article.id,
        parentId: parentId || null
      }
    });

    revalidatePath(`/articulos/${articleSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error posting comment:", error);
    return { error: "Error al publicar el comentario" };
  }
}
