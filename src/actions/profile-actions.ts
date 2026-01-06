'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
  username: z.string().min(3).or(z.literal('')),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  // const session = await authServer.getSession();
  // if (!session?.user?.id) return { error: "Not authenticated" };
  return { error: "Auth disabled" };

  /*
  const data = {
    username: formData.get("username") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    role: formData.get("role") as string,
    bio: formData.get("bio") as string,
  };

  const validated = profileSchema.safeParse(data);
  if (!validated.success) return { error: "Invalid data" };

  try {
    await prisma.userData.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        userId: session.user.id,
        ...data
      }
    });
    revalidatePath("/profile");
    return { success: "Profile updated" };
  } catch (err) {
    console.error(err);
    return { error: "Failed to update profile" };
  }
  */
}