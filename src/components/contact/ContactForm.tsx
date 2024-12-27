'use client';

import { useState } from 'react';
import FormField from './FormField';
import { ContactFormData, SUBJECT_OPTIONS } from '@/types/contact';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        id="name"
        label="Nombre"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <FormField
        id="subject"
        label="Asunto"
        type="select"
        value={formData.subject}
        onChange={handleChange}
        required
        options={SUBJECT_OPTIONS}
      />
      
      <FormField
        id="message"
        label="Mensaje"
        type="textarea"
        value={formData.message}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="w-full py-3 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
      >
        Enviar mensaje
      </button>
    </form>
  );
}