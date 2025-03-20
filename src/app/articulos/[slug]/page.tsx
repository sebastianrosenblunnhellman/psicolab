import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import ArticleMeta from '@/components/ArticleMeta';
import RelatedArticles from '@/components/RelatedArticles';
import TableOfContents from '@/components/TableOfContents';
import SaveButton from '@/components/SaveButton';
import { useUser } from '@stackframe/stack';
import ClientCommentWrapper from '@/components/ClientCommentWrapper'; // Import ClientCommentWrapper component
import { getAllArticles, getArticleBySlug } from '@/utils/articles';
import NetworkAnimation from '@/components/NetworkAnimation';
import ArticleActions from '@/components/ArticleActions';
import ArticleClientWrapper from '@/components/ArticleClientWrapper';

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
      <div className="container mx-auto px-4 py-16">
        <article className="article-container">
          <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
          <div className="flex items-center text-gray-600 mb-8 space-x-4">
            <span>{new Date(article.date).toLocaleDateString()}</span>
            <span>•</span>
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.readTime} min de lectura</span>
          </div>
          
          {/* Client component for interactive features */}
          <ArticleClientWrapper article={article} />
          
          {/* Server-rendered content - Fix for dangerouslySetInnerHTML */}
          {article.content && (
            <div className="article-content prose prose-lg max-w-none mt-8" 
                 dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
          
          {/* Add the comments section */}
          <div className="mt-16">
            <h2 id="comments-heading" className="text-2xl font-bold mb-8">Comentarios</h2>
            <ClientCommentWrapper articleId={article.slug} />
          </div>
        </article>
      </div>
    </div>
  );
}
