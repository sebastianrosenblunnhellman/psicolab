'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SocialRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return profile;
}

export type ProfileData = {
  firstName: string;
  lastName: string;
  age?: number;
  country?: string;
  avatarUrl?: string;
  universityAffiliation?: string;
  socialRole: SocialRole;
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
};

export async function updateProfile(data: ProfileData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autenticado" };
  }

  try {
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        ...data,
      },
      create: {
        userId: session.user.id,
        ...data,
      },
    });

    revalidatePath('/profile');
    revalidatePath('/'); // Para actualizar el avatar en el header
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Error al actualizar el perfil" };
  }
}
