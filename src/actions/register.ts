"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/schemas";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "El email ya está en uso" };
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(user.id);
  await sendVerificationEmail(user.email, verificationToken.token);

  return { success: "Email de confirmación enviado" };
};
