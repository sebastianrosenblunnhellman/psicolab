'use client';

import { useUser } from "@stackframe/stack";
import { useEffect, useState } from 'react';
import SavedContentCard from '@/components/SavedContentCard';
import SavedContentFilter from '@/components/SavedContentFilter';

interface SavedItem {
  id: number;
  user_id: string;
  content_id: string;
  content_type: string;
  saved_at: string;
}

interface ContentDetails {
  title: string;
  excerpt: string;
  category?: string;
  image?: string;
}

export default function GuardadosPage() {
  const user = useUser();
  const [savedItems, setSavedItems] = useState<Array<SavedItem & Partial<ContentDetails>>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchSavedContent() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`/api/saved-content/${user.id}`);
        if (!response.ok) throw new Error('Error fetching saved content');
        
        const items: SavedItem[] = await response.json();
        
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            try {
              const detailsResponse = await fetch(
                `/api/saved-content-details?content_id=${item.content_id}&content_type=${item.content_type}`
              );
              
              if (detailsResponse.ok) {
                const details = await detailsResponse.json();
                return {
                  ...item,
                  title: details.title,
                  excerpt: details.excerpt,
                  category: details.category || details.tag || 'Sin categoría',
                  image: details.image
                };
              }
              
              return item;
            } catch (error) {
              console.error(`Error fetching details for ${item.content_type} ${item.content_id}:`, error);
              return item;
            }
          })
        );
        
        setSavedItems(itemsWithDetails);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSavedContent();
  }, [user]);

  const handleDeleteSavedContent = async (id: number) => {
    if (!user) return;
    
    try {
      const itemToDelete = savedItems.find(item => item.id === id);
      if (!itemToDelete) return;

    const response = await fetch(`/api/saved-content/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
      content_id: itemToDelete.content_id,
        })
      });

      if (response.ok) {
        // Update state to remove the deleted item
        setSavedItems(prevItems => prevItems.filter(item => item.id !== id));
      } else {
        console.error('Error deleting saved content');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const contentTypes = ['article'];
  const categories: string[] = [...new Set(savedItems.map(item => item.category || undefined))].filter((v): v is string => !!v);

  const filteredItems = savedItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType ? item.content_type === selectedType : true;
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen pt-24">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <SavedContentFilter
            contentTypes={contentTypes}
            categories={categories}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            onTypeChange={setSelectedType}
            onCategoryChange={setSelectedCategory}
          />
        </div>
        
        <div className="md:w-3/4">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Buscar contenido guardado..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Cargando contenido guardado...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {savedItems.length === 0 ? 
                "No tienes contenido guardado aún" : 
                "No hay resultados para los filtros seleccionados"}
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {filteredItems.map((item) => (
                <SavedContentCard
                  key={item.id}
                  id={item.id}
                  content_id={item.content_id}
                  content_type={item.content_type}
                  saved_at={item.saved_at}
                  title={item.title}
                  excerpt={item.excerpt}
                  image={item.image}
                  onDelete={handleDeleteSavedContent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}