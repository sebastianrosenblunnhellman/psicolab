"use server";

import { prisma } from "@/lib/prisma";

export const verifyEmail = async (token: string) => {
  const existingToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return { error: "Token inexistente" };
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();

  if (hasExpired) {
    return { error: "El token ha expirado" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: existingToken.userId },
  });

  if (!existingUser) {
    return { error: "Usuario no encontrado" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: true,
    },
  });

  await prisma.emailVerificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verificado correctamente" };
};
