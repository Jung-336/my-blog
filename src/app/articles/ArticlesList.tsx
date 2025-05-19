'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { deletePost, Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
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
  const [totalPages] = useState(initialTotalPages);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePost(id);
      router.refresh(); // 서버 컴포넌트 새로고침
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    router.push(`/articles?page=${page}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">All Articles</h1>
          <p className="text-xl text-gray-300">
            Explore all published articles
          </p>
        </motion.div>

        <div className="grid gap-8">
          {posts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                    <span>{formatDate(post.created_at)}</span>
                    <span>•</span>
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    <Link href={`/articles/${post.slug}`} className="hover:text-blue-400 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-300">{post.excerpt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5 text-white" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-md"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
          {posts.length === 0 && (
            <p className="text-gray-400 text-center py-8">No articles found</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/5 text-white rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/5 text-white rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 