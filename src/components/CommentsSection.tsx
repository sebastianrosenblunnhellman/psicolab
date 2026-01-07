import { auth } from '@/auth';
import { getComments } from '@/actions/comment-actions';
import CommentForm from './CommentSystem/CommentForm';
import CommentItem from './CommentSystem/CommentItem';
import { FaComments } from 'react-icons/fa';

interface CommentsSectionProps {
  articleSlug?: string; // Optional because simpler to just pass slug than whole article object often
}

export default async function CommentsSection({ articleSlug }: CommentsSectionProps) {
  // We need to know the current article slug. 
  // In the ArticlePage, we can pass it. 
  // If not passed, we might need another way, but passing is best.
  
  // Note: The previous implementation didn't take props. 
  // We need to update ArticlePage to pass the slug.
  
  if (!articleSlug) return null;

  const session = await auth();
  const comments = await getComments(articleSlug);
  
  // Flatten count for display
  const countComments = (nodes: any[]): number => {
      let count = 0;
      nodes.forEach(node => {
          count += 1 + countComments(node.children || []);
      });
      return count;
  };
  const totalComments = countComments(comments);

  return (
    <section className="mt-16 border-t border-neutral-100 pt-10" id="comments">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
          <FaComments className="text-primary-500" />
          Comentarios
          <span className="text-sm font-bold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-100">
            {totalComments}
          </span>
        </h3>

        {/* Main Comment Form */}
        <div className="bg-neutral-50 rounded-2xl p-6 mb-12 border border-neutral-100">
          {session?.user ? (
            <>
                <h4 className="text-sm font-bold text-neutral-700 mb-4 uppercase tracking-wider">Publicar un comentario</h4>
                <CommentForm 
                    articleSlug={articleSlug} 
                    userImage={session.user.image}
                />
            </>
          ) : (
             <div className="text-center py-6">
                <p className="text-neutral-600 mb-4">Inicia sesión para participar en la conversación.</p>
                <a href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                    Iniciar Sesión
                </a>
             </div>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-8">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                articleSlug={articleSlug}
                currentUser={session?.user}
              />
            ))
          ) : (
            <div className="text-center py-12 text-neutral-400">
                <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}