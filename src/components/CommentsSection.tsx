'use client';

import { useState } from 'react';
import { FaUser, FaPaperPlane } from 'react-icons/fa';

export default function CommentsSection() {
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  // Mock existing comments
  const mockComments = [
    {
      id: 1,
      author: 'Lucía Fernández',
      date: 'hace 2 días',
      content: 'Excelente artículo. Muy clara la explicación sobre los principios fundamentales. Me gustaría saber más sobre las aplicaciones clínicas mencionadas.',
      avatar: null
    },
    {
      id: 2,
      author: 'Marcos R.',
      date: 'hace 1 semana',
      content: 'Gran aporte para la comunidad. La rigurosidad científica es lo que hace falta en estos temas.',
      avatar: null
    }
  ];

  return (
    <section className="mt-16 border-t border-neutral-100 pt-10">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-neutral-900 mb-8 flex items-center gap-2">
          Comentarios
          <span className="text-sm font-medium bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
            {mockComments.length}
          </span>
        </h3>

        {/* Comment Form Mockup */}
        <div className="bg-neutral-50 rounded-2xl p-6 mb-12">
          <h4 className="text-lg font-semibold text-neutral-900 mb-4 text-center">Deja un comentario</h4>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 mb-1">Comentario</label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white resize-none"
                placeholder="Escribe tu comentario aquí..."
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-soft hover:shadow-soft-lg"
              >
                Publicar comentario
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </form>
        </div>

        {/* Comments List Mockup */}
        <div className="space-y-8">
          {mockComments.map((c) => (
            <div key={c.id} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <FaUser />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-bold text-neutral-900">{c.author}</h5>
                  <span className="text-xs text-neutral-500">{c.date}</span>
                </div>
                <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-soft">
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {c.content}
                  </p>
                </div>
                <button className="text-xs font-semibold text-primary-600 mt-2 hover:text-primary-700 ml-2">
                  Responder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
