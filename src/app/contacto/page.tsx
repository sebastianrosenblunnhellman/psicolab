'use client';

import NetworkAnimation from '@/components/NetworkAnimation';
import ContactForm from '@/components/contact/ContactForm';

export default function ContactoPage() {
  return (
    <div className="bg-white">
      <section className="relative h-[40vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-6xl font-bold text-blue-500">CONTACTO</h1>
            <p className="text-xl text-gray-600">
              Únete a nuestra comunidad
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-2xl">
        <ContactForm />
      </section>
    </div>
  );
}