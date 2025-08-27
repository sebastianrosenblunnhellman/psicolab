// Lightweight wrapper to reuse the new threaded comments UI
import ClientCommentWrapper from './ClientCommentWrapper';

interface CommentsProps {
  articleId: string;
}

export default function Comments({ articleId }: CommentsProps) {
  return (
    <section className="mt-12 bg-gray-50 p-4 sm:p-6 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Comentarios</h2>
      <ClientCommentWrapper articleId={articleId} />
    </section>
  );
}
