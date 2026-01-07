import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string, clientPayload?: string) => {
        const session = await auth();
        if (!session?.user) {
          throw new Error('Unauthorized');
        }

        // Permitir solo imágenes
        // (La validación de tipo de archivo real se hace mejor en el cliente + verificación posterior, 
        // pero aquí podemos restringir extensiones si quisiéramos)
        
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          tokenPayload: JSON.stringify({
            userId: session.user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Aquí podríamos actualizar la DB automáticamente si quisiéramos,
        // pero a veces es mejor dejar que el cliente lo haga tras la subida exitosa
        // para tener control del formulario completo.
        // Por ahora solo logueamos.
        console.log('Upload completed:', blob.url);
        
        try {
            // Opcional: Podríamos validar que el usuario es quien dice ser con el tokenPayload
            // const { userId } = JSON.parse(tokenPayload!);
        } catch (error) {
            console.error('Error parsing token payload', error);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}
