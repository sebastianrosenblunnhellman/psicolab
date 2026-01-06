"use client";
import { useState, useTransition } from "react";
import { register } from "@/actions/register";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    startTransition(() => {
      register({ email, password })
        .then((data) => {
          if (data?.error) setError(data.error);
          if (data?.success) setSuccess(data.success);
        });
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Registro</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
             <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email</label>
                <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required 
                  className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Contraseña</label>
                <input type="password" placeholder="******" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  className="w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
          </div>
          {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-500 p-3 rounded text-sm">{success}</div>}
          <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium">
            {isPending ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
           ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
