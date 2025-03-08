'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';

interface UserProfile {
  name: string | null;
  last_name: string | null;
  bio: string | null;
  profile_picture_url: string | null;
  location: string | null;
  website: string | null;
}

export default function ProfilePage() {
  const user = useUser();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    last_name: '',
    bio: '',
    profile_picture_url: '',
    location: '',
    website: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${user.id}`);
      if (!response.ok) throw new Error('Error al cargar el perfil');
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError('Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!response.ok) throw new Error('Error al actualizar el perfil');
      alert('Perfil actualizado exitosamente');
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Apellido</label>
          <input
            type="text"
            name="last_name"
            value={profile.last_name || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Biografía</label>
          <textarea
            name="bio"
            value={profile.bio || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL de Imagen de Perfil</label>
          <input
            type="url"
            name="profile_picture_url"
            value={profile.profile_picture_url || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <input
            type="text"
            name="location"
            value={profile.location || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sitio Web</label>
          <input
            type="url"
            name="website"
            value={profile.website || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}