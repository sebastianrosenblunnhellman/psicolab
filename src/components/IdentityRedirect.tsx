'use client';

import { useEffect } from 'react';

export default function IdentityRedirect() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && (hash.includes('invite_token=') || hash.includes('recovery_token='))) {
        // Redirigir a /admin conservando el hash para que el widget lo capture
        window.location.href = `/admin/${hash}`;
      }
    }
  }, []);

  return null; // Este componente no renderiza nada visualmente
}
