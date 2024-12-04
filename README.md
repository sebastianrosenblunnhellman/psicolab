# Psi Colab - Blog de Psicología

[Previous content remains the same until "Gestión de Contenido" section...]

## 📝 Gestión de Contenido

### Artículos Destacados

Los artículos destacados que aparecen en la página principal se configuran en `src/config/featured.ts`. Para modificarlos:

```typescript
// src/config/featured.ts
export const featuredArticles = [
  {
    slug: 'nombre-del-articulo',  // URL del artículo
    title: 'Título del Artículo',
    excerpt: 'Breve descripción que aparecerá en la tarjeta',
    image: '/images/featured/imagen.jpg'  // Ruta de la imagen en public/
  },
  // ... más artículos destacados
];
```

Consideraciones importantes:
- Mantener exactamente 4 artículos destacados
- El `slug` debe corresponder a un artículo existente
- Las imágenes deben estar en `public/images/featured/`
- Dimensiones recomendadas para imágenes: 800x600px

[Rest of the README content remains the same...]