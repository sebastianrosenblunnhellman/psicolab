import { verifyEmail } from "@/actions/verify-email";
import Link from "next/link";

export default async function VerifyEmailPage(props: {
  searchParams: Promise<{ token: string }>;
}) {
  const searchParams = await props.searchParams;
  const { token } = searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
         <div className="bg-white p-8 rounded shadow text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
            <p>Token no encontrado</p>
            <Link href="/login" className="text-blue-500 mt-4 block hover:underline">Ir al Login</Link>
         </div>
      </div>
    );
  }

  const result = await verifyEmail(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
       <div className="bg-white p-8 rounded shadow text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Verificación de Email</h1>
          
          {result.error && (
            <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
              {result.error}
            </div>
          )}
          
          {result.success && (
             <div className="bg-green-50 text-green-600 p-4 rounded mb-4">
               {result.success}
             </div>
          )}
          
          <Link href="/login" className="text-white bg-blue-600 py-2 px-4 rounded block hover:bg-blue-700 transition-colors">
            Ir al Login
          </Link>
       </div>
    </div>
  );
}
