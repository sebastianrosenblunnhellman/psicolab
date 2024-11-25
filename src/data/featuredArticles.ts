interface FeaturedArticle {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
}

export const featuredArticles: FeaturedArticle[] = [
  {
    slug: 'analisis-de-la-conducta',
    title: 'Análisis de la Conducta',
    excerpt: 'Descubre los fundamentos del análisis conductual y su aplicación práctica.',
    image: '/images/featured/conductual.jpg'
  },
  {
    slug: 'neurociencia-cognitiva',
    title: 'Neurociencia Cognitiva',
    excerpt: 'Explorando la relación entre el cerebro y los procesos mentales.',
    image: '/images/featured/neurociencia.jpg'
  },
  {
    slug: 'psicologia-social',
    title: 'Psicología Social',
    excerpt: 'Entendiendo cómo las personas interactúan y se influencian mutuamente.',
    image: '/images/featured/social.jpg'
  },
  {
    slug: 'desarrollo-humano',
    title: 'Desarrollo Humano',
    excerpt: 'Las etapas del desarrollo y su impacto en la personalidad.',
    image: '/images/featured/desarrollo.jpg'
  }
];
