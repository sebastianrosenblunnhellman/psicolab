"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Stack auth handler
    router.push("/handler/sign-in");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Iniciando sesión</h2>
          <p className="mt-2 text-sm text-gray-600">
            Redirigiendo al inicio de sesión...
          </p>
          <div className="mt-5">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
          <div className="mt-5">
            <Link href="/" className="text-blue-500 hover:text-blue-700">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}