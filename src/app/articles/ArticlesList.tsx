'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { deletePost, Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Edit, Trash2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ArticlesListProps {
  initialPosts: Post[];
  initialTotalPages: number;
  initialPage: number;
}

export default function ArticlesList({ initialPosts, initialTotalPages, initialPage }: ArticlesListProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
      router.refresh();
    } catch (error) {
      console.error('Failed to delete post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts?page=${newPage}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      
      setPosts(data.posts);
      setCurrentPage(newPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-500">{error}</div></div>;

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-400">
        No articles found.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">All Articles</h1>
          <p className="text-xl text-gray-300">Explore all published articles</p>
        </motion.div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-lg rounded-lg overflow-hidden border border-white/10"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span>{formatDate(post.created_at)}</span>
                    <span>•</span>
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/articles/${post.slug}`}
                    className="inline-flex items-center text-blue-500 hover:text-blue-400"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 