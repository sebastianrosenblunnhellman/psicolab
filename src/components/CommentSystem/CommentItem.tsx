'use client';

import { useState } from 'react';
import { CommentWithUser } from '@/actions/comment-actions';
import Avatar from '../Avatar';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CommentItemProps {
  comment: CommentWithUser;
  articleSlug: string;
  currentUser?: any; // To check if logged in
}

export default function CommentItem({ comment, articleSlug, currentUser }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  // Get display name (Profile First Name + Last Name OR Email)
  const displayName = comment.user.profile 
    ? `${comment.user.profile.firstName} ${comment.user.profile.lastName}`
    : comment.user.email?.split('@')[0] || 'Usuario';

  const avatarUrl = comment.user.profile?.avatarUrl;

  return (
    <div className="flex gap-3 group animate-fadeIn">
      <div className="flex-shrink-0">
        <Avatar src={avatarUrl} alt={displayName} size="sm" />
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="bg-neutral-50/50 rounded-2xl px-4 py-3 border border-neutral-100">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-sm text-neutral-900">{displayName}</span>
            <span className="text-xs text-neutral-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
            </span>
          </div>
          <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-4 mt-1 ml-2">
            {currentUser && (
                <button 
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-xs font-semibold text-neutral-500 hover:text-primary-600 transition-colors"
                >
                    Responder
                </button>
            )}
            {comment.children.length > 0 && (
                 <button 
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
                >
                    {showReplies ? 'Ocultar respuestas' : `Ver ${comment.children.length} respuestas`}
                </button>
            )}
        </div>

        {/* Reply Form */}
        {isReplying && (
            <div className="mt-4 pl-4 border-l-2 border-primary-100">
                <CommentForm 
                    articleSlug={articleSlug} 
                    parentId={comment.id}
                    userImage={currentUser?.image}
                    onSuccess={() => {
                        setIsReplying(false);
                        setShowReplies(true); // Open replies to show new one
                    }}
                    onCancel={() => setIsReplying(false)}
                    autoFocus
                />
            </div>
        )}

        {/* Nested Replies */}
        {showReplies && comment.children.length > 0 && (
            <div className="mt-4 pl-4 space-y-4 border-l-2 border-neutral-100">
                {comment.children.map(child => (
                    <CommentItem 
                        key={child.id} 
                        comment={child} 
                        articleSlug={articleSlug}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
