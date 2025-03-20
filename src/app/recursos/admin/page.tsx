"use client";

import { useState, useEffect } from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import ResourceFilter from '@/components/ResourceFilter';

type Resource = {
  id: string;
  title: string;
  type: string;
  excerpt: string;
  author: string;
  pages?: number;
  cover: string;
  tags: string[];
  link: string;
  language: string;
};

type Category = {
  name: string;
  subcategories: Record<string, {
    name: string;
    resources: Resource[];
  }>;
};

type ResourcesData = {
  categories: Record<string, Category>;
  filters: {
    language: string[];
    type: string[];
  };
};

export default function ResourceAdmin() {
  const [resourcesData, setResourcesData] = useState<ResourcesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Resource & { category: string; subcategory: string }>({
    id: '',
    title: '',
    type: 'libro',
    excerpt: '',
    author: '',
    pages: undefined,
    cover: '',
    tags: [],
    link: '',
    language: 'español',
    category: 'lineaConductual',
    subcategory: 'conductismoRadical',
  });
  
  const [newTag, setNewTag] = useState<string>('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/resources');
        if (!response.ok) {
          throw new Error('Failed to fetch resources data');
        }
        const data = await response.json();
        setResourcesData(data);
      } catch (err) {
        setError('Error loading resources data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pages' ? (value ? parseInt(value) : undefined) : value,
    });
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      if (!formData.id) {
        formData.id = `resource_${Date.now()}`;
      }
      
      const { category, subcategory, ...resourceData } = formData;
      
      const response = await fetch('/api/resources/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          subcategory,
          resource: resourceData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add resource');
      }
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        id: '',
        title: '',
        type: 'libro',
        excerpt: '',
        author: '',
        pages: undefined,
        cover: '',
        tags: [],
        link: '',
        language: 'español',
        category: 'lineaConductual',
        subcategory: 'conductismoRadical',
      });
      
      // Refresh data
      const refreshResponse = await fetch('/api/resources');
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setResourcesData(refreshedData);
      }
    } catch (err) {
      setError('Error adding resource. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !resourcesData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (error && !resourcesData) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Administrador de Recursos</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Recurso</h2>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Recurso agregado exitosamente
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
                <select
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {resourcesData && Object.entries(resourcesData.categories).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Subcategoría</label>
                <select
                  name="subcategory"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  required
                >
                  {resourcesData && formData.category && Object.entries(resourcesData.categories[formData.category].subcategories).map(([key, subcategory]) => (
                    <option key={key} value={key}>{subcategory.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">ID (opcional, se generará automáticamente)</label>
                <input
                  type="text"
                  name="id"
                  placeholder="ID único (dejar en blanco para auto-generar)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.id}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Título</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Título del recurso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
                <select
                  name="type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  {resourcesData?.filters.type.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Idioma</label>
                <select
                  name="language"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.language}
                  onChange={handleInputChange}
                >
                  {resourcesData?.filters.language.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Autor</label>
                <input
                  type="text"
                  name="author"
                  placeholder="Nombre del autor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Páginas (para libros)</label>
                <input
                  type="number"
                  name="pages"
                  placeholder="Número de páginas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.pages || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">URL de la Portada</label>
                <input
                  type="text"
                  name="cover"
                  placeholder="URL de la imagen de portada"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cover}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">URL del Recurso</label>
                <input
                  type="text"
                  name="link"
                  placeholder="URL del recurso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.link}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
                <textarea
                  name="excerpt"
                  placeholder="Breve descripción del recurso"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">Etiquetas</label>
            <div className="flex mb-2">
              <input
                type="text"
                placeholder="Nueva etiqueta"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Añadir
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(tag => (
                <div key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-800 hover:text-red-600 focus:outline-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Recurso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
