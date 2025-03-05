'use client';

import { useUser } from "@stackframe/stack";
import { useEffect, useState } from 'react';

export default function GuardadosPage() {
  const user = useUser();
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/saved-content/${user.id}`)
        .then(res => res.json())
        .then(data => setSavedItems(data));
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen pt-24">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Contenidos Guardados</h1>
      
      {savedItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No tienes contenido guardado aún
        </div>
      ) : (
        <div className="grid gap-4">
          {savedItems.map((item) => (
            <div 
              key={item.id}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-lg">{item.content_type}</h3>
              <p className="text-gray-600 mt-1">ID del contenido: {item.content_id}</p>
              <time className="text-sm text-gray-400">
                Guardado el: {new Date(item.saved_at).toLocaleDateString()}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}