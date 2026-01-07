'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUserLikes() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const likes = await prisma.like.findMany({
    where: { userId: session.user.id },
    include: {
      article: true,
      material: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return likes;
}

export async function getContentLikeStatus(slug: string, type: 'article' | 'material' = 'article') {
  const session = await auth();
  if (!session?.user?.id) return { isLiked: false, likesCount: 0 };

  // Check if article/material exists in DB first
  // (We use findFirst because slugs should be unique but our schema defined slug @unique so findUnique is better if we have the ID, 
  // but here we only have slug. Wait, schema says slug is @unique. So findUnique is fine if we use slug as where input... 
  // actually Article where input is unique by id or slug).
  
  let entityId: string | null = null;
  
  if (type === 'article') {
    const article = await prisma.article.findUnique({ where: { slug } });
    entityId = article?.id || null;
  } else {
    const material = await prisma.material.findUnique({ where: { slug } });
    entityId = material?.id || null;
  }

  if (!entityId) return { isLiked: false, likesCount: 0 };

  const like = await prisma.like.findUnique({
    where: type === 'article' 
      ? { userId_articleId: { userId: session.user.id, articleId: entityId } }
      : { userId_materialId: { userId: session.user.id, materialId: entityId } }
  });

  // Optional: Count total likes (if we want to show that)
  // const count = await prisma.like.count({ where: type === 'article' ? { articleId: entityId } : { materialId: entityId } });

  return { isLiked: !!like, likesCount: 0 }; 
}

export async function toggleLike(slug: string, title: string, type: 'article' | 'material' = 'article') {
  const session = await auth();
  if (!session?.user?.id) return { error: "Debes iniciar sesión" };

  try {
    // 1. Ensure Entity Exists
    let entityId: string;

    if (type === 'article') {
      const article = await prisma.article.upsert({
        where: { slug },
        update: {},
        create: { slug, title },
      });
      entityId = article.id;
    } else {
      const material = await prisma.material.upsert({
        where: { slug },
        update: {},
        create: { slug, title },
      });
      entityId = material.id;
    }

    // 2. Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: type === 'article' 
        ? { userId_articleId: { userId: session.user.id, articleId: entityId } }
        : { userId_materialId: { userId: session.user.id, materialId: entityId } }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return { isLiked: false };
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          [type === 'article' ? 'articleId' : 'materialId']: entityId
        }
      });
      return { isLiked: true };
    }
    
    // We don't revalidate path here necessarily because it's client interaction, 
    // but if we showed a counter we might want to.
  } catch (error) {
    console.error("Error toggling like:", error);
    return { error: "Error al procesar tu solicitud" };
  }
}