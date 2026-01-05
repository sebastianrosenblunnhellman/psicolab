import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import BlogCard from '@/components/BlogCard';
import AboutSection from '@/components/AboutSection';
import CoursesCarousel from '@/components/CoursesCarousel';
import NewsletterSection from '@/components/NewsletterSection';
import BlogCarousel from '@/components/BlogCarousel';
import { getAllArticles } from '@/utils/articles';

export default async function Home() {
  const articles = await getAllArticles();
  const recentArticles = articles.slice(0, 6);
  // Duplicate articles for carousel effect
  const carouselArticles = [...recentArticles, ...recentArticles, ...recentArticles];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Courses Carousel Section */}
      <CoursesCarousel />

      {/* Recent Articles Section */}
      {recentArticles.length > 0 ? (
        <BlogCarousel articles={carouselArticles} />
      ) : (
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
             <p className="text-neutral-500 py-12">
              No hay artículos disponibles en este momento.
            </p>
          </div>
        </section>
      )}

      {/* About Section */}
      <AboutSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
