"use client";
import { useState, useTransition } from "react";
import { login } from "@/actions/login";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" 
    ? "Email ya registrado con otro proveedor"
    : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    startTransition(() => {
      login({ email, password })
        .then((data) => {
          if (data?.error) setError(data.error);
        });
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
             <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required 
                  className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Contraseña</label>
                <input type="password" placeholder="******" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
          </div>
          {(error || urlError) && <div className="bg-red-50 text-red-500 p-3 rounded text-sm">{error || urlError}</div>}
          <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium">
            {isPending ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
           ¿No tienes cuenta? <Link href="/register" className="text-blue-600 hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
