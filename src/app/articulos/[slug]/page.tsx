import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import ArticleMeta from '@/components/ArticleMeta';
import RelatedArticles from '@/components/RelatedArticles';
import TableOfContents from '@/components/TableOfContents';
import { getAllArticles, getArticleBySlug } from '@/utils/articles';
import NetworkAnimation from '@/components/NetworkAnimation';
import ArticleActions from '@/components/ArticleActions';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug, ['content']);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <article className="article-container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">{article.title}</h1>
          <div className="flex flex-wrap items-center text-gray-600 mb-6 md:mb-8 space-x-2 md:space-x-4">
            <span>{new Date(article.date).toLocaleDateString()}</span>
            <span>•</span>
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.readTime} min de lectura</span>
            {/* Bookmark functionality removed */}
          </div>
          
          {/* Interactive features removed */}
          
          {/* Server-rendered content */}
          {article.content && (
            <div className="article-content prose prose-lg max-w-none mt-8" 
                 dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
          
          {/* Comments removed */}
        </article>
      </div>
    </div>
  );
}
