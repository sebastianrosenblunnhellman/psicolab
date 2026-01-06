'use client'

import { updateProfile } from "@/actions/profile-actions"
import { useState } from "react"

export default function ProfileForm({ user, userData }: { user: any, userData: any }) {
  const [message, setMessage] = useState('')

  async function clientAction(formData: FormData) {
    setMessage('')
    const res = await updateProfile(formData)
    if (res?.error) setMessage(`Error: ${res.error}`)
    if (res?.success) setMessage(res.success)
  }

  return (
    <form action={clientAction} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        
        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (No editable)</label>
          <div className="mt-1">
            <input
              type="email"
              disabled
              value={user.email || ''}
              className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
          <div className="mt-1">
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={userData?.username || ''}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
           {/* Spacer or other field */}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
          <div className="mt-1">
            <input
              type="text"
              name="firstName"
              id="firstName"
              defaultValue={userData?.firstName || user.name?.split(' ')[0] || ''}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
          <div className="mt-1">
            <input
              type="text"
              name="lastName"
              id="lastName"
              defaultValue={userData?.lastName || ''}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
          <div className="mt-1">
            <select
              id="role"
              name="role"
              defaultValue={userData?.role || 'student'}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            >
              <option value="student">Estudiante</option>
              <option value="graduate">Graduado</option>
              <option value="professional">Profesional</option>
            </select>
          </div>
        </div>
        
        <div className="sm:col-span-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biografía</label>
          <div className="mt-1">
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={userData?.bio || ''}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-end">
        {message && <p className="mr-4 text-sm font-medium text-indigo-600 self-center">{message}</p>}
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  )
}
