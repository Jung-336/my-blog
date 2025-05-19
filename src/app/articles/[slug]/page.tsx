'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { getPost, getAdjacentPosts, Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { nanoid } from 'nanoid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, List, ChevronFirst, ChevronLast } from 'lucide-react';
import Link from 'next/link';
import { Components } from 'react-markdown';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [prevPost, setPrevPost] = useState<Post | null>(null);
  const [nextPost, setNextPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const slug = params.slug as string;
        const postData = await getPost(slug);
        setPost(postData);
        
        // Get adjacent posts
        const { prevPost, nextPost } = await getAdjacentPosts(postData);
        setPrevPost(prevPost);
        setNextPost(nextPost);
      } catch (error) {
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPost();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Article not found'}</div>
      </div>
    );
  }

  const components: Components = {
    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2" {...props} />,
    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
    li: ({ node, ...props }) => <li className="mb-2" {...props} />,
    a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300" {...props} />,
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !match ? (
        <code className="bg-white/10 px-1 py-0.5 rounded" {...props}>{children}</code>
      ) : (
        <code className="block bg-white/10 p-4 rounded-lg mb-4 overflow-x-auto" {...props}>{children}</code>
      );
    },
    pre: ({ node, ...props }) => <pre className="mb-4" {...props} />,
    blockquote: ({ node, ...props }) => 
      <blockquote className="border-l-4 border-gray-600 pl-4 italic my-4" {...props} />,
    img: ({ node, ...props }) => 
      <img className="max-w-full h-auto rounded-lg my-4" {...props} />,
  };

  return (
    <article className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span>{formatDate(post.created_at)}</span>
            <span>•</span>
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>
          <p className="text-xl text-gray-300">{post.excerpt}</p>
        </header>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={components}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/articles"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-md hover:bg-white/10 transition-colors"
            >
              <List className="w-5 h-5" />
              <span>목록으로</span>
            </Link>

            <div className="flex items-center gap-2">
              {prevPost && (
                <Link
                  href={`/articles/${prevPost.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-md hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>이전글 ({prevPost.title})</span>
                </Link>
              )}
              {nextPost && (
                <Link
                  href={`/articles/${nextPost.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-md hover:bg-white/10 transition-colors"
                >
                  <span>다음글 ({nextPost.title})</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </article>
  );
} 