export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  duration: string;
  level: string;
  rating: number;
  students: number;
  status: 'available' | 'coming_soon' | 'in_progress';
  slug: string;
  category: string;
}

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Introducción al Análisis de la Conducta',
    description: 'Aprende los principios fundamentales del análisis experimental del comportamiento y sus aplicaciones.',
    image: '/images/articles/A_C_C/miniatura.png', // Placeholder
    instructor: 'Dr. Sebastián G.',
    duration: '12 horas',
    level: 'Principiante',
    rating: 4.8,
    students: 124,
    status: 'coming_soon',
    slug: 'intro-analisis-conducta',
    category: 'Análisis de Conducta'
  },
  {
    id: '2',
    title: 'Terapias de Tercera Generación',
    description: 'Explora ACT, FAP y DBT desde una perspectiva científica y clínica.',
    image: '/images/articles/T_C_L/miniatura.png', // Placeholder
    instructor: 'Lic. María F.',
    duration: '20 horas',
    level: 'Intermedio',
    rating: 4.9,
    students: 85,
    status: 'coming_soon',
    slug: 'terapias-tercera-generacion',
    category: 'Clínica'
  },
  {
    id: '3',
    title: 'Metodología de la Investigación en Psicología',
    description: 'Domina el diseño experimental y el análisis de datos para tus investigaciones.',
    image: '/images/articles/T_R_T_M/miniatura.png', // Placeholder
    instructor: 'Dr. Carlos R.',
    duration: '15 horas',
    level: 'Avanzado',
    rating: 4.7,
    students: 210,
    status: 'coming_soon',
    slug: 'metodologia-investigacion',
    category: 'Investigación'
  },
  {
    id: '4',
    title: 'Psicología Cognitiva Aplicada',
    description: 'Entiende los procesos mentales y su aplicación en terapia y educación.',
    image: '/images/articles/A_C_C/miniatura.png', // Placeholder reuse
    instructor: 'Dra. Ana M.',
    duration: '18 horas',
    level: 'Intermedio',
    rating: 4.6,
    students: 150,
    status: 'coming_soon',
    slug: 'psicologia-cognitiva',
    category: 'Cognitiva'
  },
  {
    id: '5',
    title: 'Neurociencia para Psicólogos',
    description: 'Bases biológicas de la conducta humana y trastornos mentales.',
    image: '/images/articles/T_R_T_M/miniatura.png', // Placeholder reuse
    instructor: 'Dr. Roberto L.',
    duration: '25 horas',
    level: 'Avanzado',
    rating: 4.9,
    students: 300,
    status: 'coming_soon',
    slug: 'neurociencia-psicologos',
    category: 'Neurociencia'
  },
  {
    id: '6',
    title: 'Estadística con R para Ciencias Sociales',
    description: 'Herramientas prácticas para el análisis de datos en psicología.',
    image: '/images/articles/T_C_L/miniatura.png', // Placeholder reuse
    instructor: 'Lic. Sofia P.',
    duration: '10 horas',
    level: 'Intermedio',
    rating: 4.5,
    students: 90,
    status: 'coming_soon',
    slug: 'estadistica-r',
    category: 'Metodología'
  }
];