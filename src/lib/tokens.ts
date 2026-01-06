import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export const generateVerificationToken = async (userId: string) => {
  const token = randomUUID();
  // Set expiration to 24 hours
  const expires = new Date(new Date().getTime() + 24 * 3600 * 1000);

  // Clean up existing tokens for this user
  await prisma.emailVerificationToken.deleteMany({
      where: { userId: userId }
  });

  const verificationToken = await prisma.emailVerificationToken.create({
    data: {
      userId: userId,
      token,
      expiresAt: expires,
    }
  });

  return verificationToken;
};
