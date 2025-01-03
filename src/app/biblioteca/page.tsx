import NetworkAnimation from '@/components/NetworkAnimation';
import BooksList from '@/components/BooksList';
import { getAllBooks } from '@/utils/books';

export const metadata = {
  title: 'Biblioteca | Psi Colab',
  description: 'Explora nuestra colección de libros de psicología recomendados.',
};

export default async function BibliotecaPage() {
  const books = await getAllBooks();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-6xl font-bold text-blue-500">BIBLIOTECA</h1>
            <p className="text-xl text-gray-600">
              Recursos académicos seleccionados
            </p>
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div className="container mx-auto px-4 py-16">
        <BooksList initialBooks={books} />
      </div>
    </div>
  );
}
