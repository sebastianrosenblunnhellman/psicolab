"use client";

import { useState, useEffect } from 'react';
import ResourceFilter from '@/components/ResourceFilter';

type DictionaryData = {
  categories: Record<string, {
    name: string;
    subcategories: Record<string, {
      name: string;
    }>;
  }>;
  filters: {
    language: string[];
    type: string[];
  };
};

type ResourceFormData = {
  title: string;
  type: string;
  author: string;
  excerpt: string;
  tags: string[];
  categories: string;
  subcategories: string;
  language: string;
  image: string;
  link: string;
  pages?: number;
  fileName: string;
};

export default function ResourceAdmin() {
  const [dictionaryData, setDictionaryData] = useState<DictionaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    type: '',
    author: '',
    excerpt: '',
    tags: [],
    categories: '',
    subcategories: '',
    language: '',
    image: '',
    link: '',
    pages: undefined,
    fileName: '',
  });
  
  const [newTag, setNewTag] = useState<string>('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching dictionary data...");
        const response = await fetch('/api/dictionary');
        
        if (!response.ok) {
          console.error(`Dictionary API returned status: ${response.status}`);
          throw new Error(`Failed to fetch dictionary data: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Dictionary data received:", data);
        
        if (!data.categories || !data.filters) {
          console.error("Dictionary data is missing required properties:", data);
          throw new Error("Dictionary data format is invalid");
        }
        
        setDictionaryData(data);
        
        // Initialize form with first available values
        if (data && data.categories && Object.keys(data.categories).length > 0) {
          const firstCategory = Object.keys(data.categories)[0];
          const firstSubcategory = Object.keys(data.categories[firstCategory].subcategories)[0];
          
          setFormData(prev => ({
            ...prev,
            type: data.filters.type[0] || '',
            language: data.filters.language[0] || '',
            categories: firstCategory,
            subcategories: firstSubcategory,
          }));
        }
      } catch (err) {
        console.error("Error loading dictionary:", err);
        setError('Error loading dictionary data. Please check the console for details.');
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
  
  const createMarkdownContent = () => {
    // Format tags as a YAML array
    const tagsStr = formData.tags.length > 0 
      ? `[${formData.tags.map(tag => `"${tag}"`).join(', ')}]` 
      : '[]';
    
    // Get category and subcategory names
    const categoryName = dictionaryData?.categories[formData.categories]?.name || formData.categories;
    const subcategoryName = dictionaryData?.categories[formData.categories]?.subcategories[formData.subcategories]?.name || formData.subcategories;
    
    // Create frontmatter
    const frontMatter = [
      '---',
      `title: "${formData.title}"`,
      `type: "${formData.type}"`,
      `author: "${formData.author}"`,
      `excerpt: "${formData.excerpt}"`,
      `tags: ${tagsStr}`,
      `categories: "${categoryName}"`,
      `subcategories: "${subcategoryName}"`,
      `language: "${formData.language}"`,
      `image: "${formData.image}"`,
      `link: "${formData.link}"`,
      formData.pages ? `pages: ${formData.pages}` : null,
      '---',
      '',
      formData.excerpt // Add excerpt as content
    ].filter(Boolean).join('\n');
    
    return frontMatter;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      // Generate filename if not provided
      const fileName = formData.fileName.trim() || 
        `${formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}-${Date.now()}.md`;
      
      // Create markdown content
      const markdownContent = createMarkdownContent();
      
      const response = await fetch('/api/resources/upload-markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          content: markdownContent,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload resource');
      }
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        type: dictionaryData?.filters.type[0] || '',
        author: '',
        excerpt: '',
        tags: [],
        categories: formData.categories, // Keep the selected category
        subcategories: formData.subcategories, // Keep the selected subcategory
        language: dictionaryData?.filters.language[0] || '',
        image: '',
        link: '',
        pages: undefined,
        fileName: '',
      });
    } catch (err) {
      setError('Error adding resource. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !dictionaryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="mb-4 text-lg">Cargando datos del diccionario...</p>
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error && !dictionaryData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div>
              <h3 className="font-bold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
              <p className="mt-2">Asegúrate de que el archivo dictionary.json existe y está correctamente formateado.</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Administrador de Recursos</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Recurso (Markdown)</h2>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Recurso agregado exitosamente en formato Markdown
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
                  name="categories"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.categories}
                  onChange={handleInputChange}
                  required
                >
                  {dictionaryData && Object.entries(dictionaryData.categories).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Subcategoría</label>
                <select
                  name="subcategories"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.subcategories}
                  onChange={handleInputChange}
                  required
                >
                  {dictionaryData && formData.categories && Object.entries(dictionaryData.categories[formData.categories].subcategories).map(([key, subcategory]) => (
                    <option key={key} value={key}>{subcategory.name}</option>
                  ))}
                </select>
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
                <label className="block text-gray-700 font-semibold mb-2">Nombre del archivo (opcional)</label>
                <input
                  type="text"
                  name="fileName"
                  placeholder="archivo.md (se generará automáticamente si se deja vacío)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.fileName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tipo</label>
                <select
                  name="type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  {dictionaryData?.filters.type.map(type => (
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
                  required
                >
                  <option value="">Seleccione un idioma</option>
                  {dictionaryData?.filters.language.map(lang => (
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
                <label className="block text-gray-700 font-semibold mb-2">Páginas (para libros, opcional)</label>
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
                <label className="block text-gray-700 font-semibold mb-2">URL de la Imagen</label>
                <input
                  type="text"
                  name="image"
                  placeholder="/images/miniatura.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">URL del Recurso</label>
                <input
                  type="text"
                  name="link"
                  placeholder="https://example.com/recurso.pdf"
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
              {loading ? 'Guardando...' : 'Guardar Recurso (Markdown)'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Vista Previa del Markdown</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap">
          {createMarkdownContent()}
        </pre>
      </div>
    </div>
  );
}
