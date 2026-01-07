'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import Avatar from './Avatar';
import { updateProfile, type ProfileData } from '@/actions/profile-actions';
import { SocialRole } from '@prisma/client';

interface ProfileFormProps {
  initialData: any; // Using any to avoid complex Prisma types on client for now, but better to type it
  userEmail: string;
}

export default function ProfileForm({ initialData, userEmail }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData?.avatarUrl || null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    
    // Handle Avatar Upload if a file is selected
    let newAvatarUrl = avatarUrl;
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      try {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/avatar/upload',
        });
        newAvatarUrl = blob.url;
        setAvatarUrl(newAvatarUrl);
      } catch (err) {
        console.error('Upload error:', err);
        setMessage({ type: 'error', text: 'Error al subir la imagen.' });
        setLoading(false);
        return;
      }
    }

    const data: ProfileData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      age: formData.get('age') ? parseInt(formData.get('age') as string) : undefined,
      country: formData.get('country') as string,
      universityAffiliation: formData.get('universityAffiliation') as string,
      socialRole: formData.get('socialRole') as SocialRole,
      bio: formData.get('bio') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      websiteUrl: formData.get('websiteUrl') as string,
      avatarUrl: newAvatarUrl || undefined,
    };

    const result = await updateProfile(data);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
    }
    setLoading(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        
        {/* Profile Header & Avatar */}
        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Información Personal</h3>
            <p className="mt-1 text-sm text-gray-500">
              Esta información será visible en tu perfil público (excepto tu edad).
            </p>
          </div>
          
          <div className="mt-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="group relative cursor-pointer" onClick={handleAvatarClick}>
               <Avatar src={avatarUrl} size="xl" />
               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                 <span className="text-xs font-medium">Cambiar</span>
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={(e) => {
                    if(e.target.files?.[0]) {
                        // Show preview
                        const url = URL.createObjectURL(e.target.files[0]);
                        setAvatarUrl(url);
                    }
                 }}
               />
            </div>
            <div className="flex-1 space-y-4 w-full">
               <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                 <div className="sm:col-span-3">
                   <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
                   <div className="mt-1">
                     <input type="text" name="firstName" id="firstName" required defaultValue={initialData?.firstName}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                   </div>
                 </div>

                 <div className="sm:col-span-3">
                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                   <div className="mt-1">
                     <input type="text" name="lastName" id="lastName" required defaultValue={initialData?.lastName}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                   </div>
                 </div>

                 <div className="sm:col-span-4">
                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                   <div className="mt-1">
                     <input type="email" disabled value={userEmail}
                            className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-gray-500" />
                   </div>
                 </div>

                 <div className="sm:col-span-2">
                   <label htmlFor="age" className="block text-sm font-medium text-gray-700">Edad</label>
                   <div className="mt-1">
                     <input type="number" name="age" id="age" defaultValue={initialData?.age}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                   </div>
                 </div>

                 <div className="sm:col-span-3">
                   <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label>
                   <div className="mt-1">
                     <input type="text" name="country" id="country" defaultValue={initialData?.country}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Academic & Social Role */}
        <div className="pt-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Perfil Académico / Profesional</h3>
            <p className="mt-1 text-sm text-gray-500">
              Cuéntanos un poco más sobre tu rol y trayectoria.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="socialRole" className="block text-sm font-medium text-gray-700">Rol</label>
              <div className="mt-1">
                <select id="socialRole" name="socialRole" defaultValue={initialData?.socialRole || SocialRole.ESTUDIANTE}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
                  <option value={SocialRole.ESTUDIANTE}>Estudiante</option>
                  <option value={SocialRole.PROFESIONAL}>Profesional</option>
                  <option value={SocialRole.ENTUSIASTA}>Entusiasta</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="universityAffiliation" className="block text-sm font-medium text-gray-700">Institución / Universidad</label>
              <div className="mt-1">
                <input type="text" name="universityAffiliation" id="universityAffiliation" defaultValue={initialData?.universityAffiliation}
                       className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biografía</label>
              <div className="mt-1">
                <textarea id="bio" name="bio" rows={3} defaultValue={initialData?.bio}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"></textarea>
              </div>
              <p className="mt-2 text-sm text-gray-500">Escribe una breve descripción sobre ti.</p>
            </div>
            
            <div className="sm:col-span-3">
               <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
               <div className="mt-1">
                 <input type="url" name="linkedinUrl" id="linkedinUrl" defaultValue={initialData?.linkedinUrl} placeholder="https://linkedin.com/in/..."
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
               </div>
            </div>
            
            <div className="sm:col-span-3">
               <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">Sitio Web</label>
               <div className="mt-1">
                 <input type="url" name="websiteUrl" id="websiteUrl" defaultValue={initialData?.websiteUrl} placeholder="https://..."
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
               </div>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-5 pb-10">
        <div className="flex justify-end items-center gap-4">
          {message && (
             <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
             </span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </form>
  );
}
