"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // We can inspect error.type or error.cause
      // When we throw Error("EmailNotVerified") in authorize, it wraps in CallbackRouteError
      if (error.type === "CallbackRouteError") {
          // It's hard to distinguish exact cause without inspecting internal properties which might change
          // But usually this means authorize failed (threw)
          // We can try to guess or just say "Login failed"
          return { error: "Error al iniciar sesión. Verifica tu email o credenciales." };
      }
      
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas" };
        default:
          return { error: "Algo salió mal" };
      }
    }
    throw error;
  }
};
