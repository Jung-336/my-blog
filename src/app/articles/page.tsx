'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getPosts, Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export default function ArticlesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const result = await getPosts(true, currentPage, pageSize);
        setPosts(result.posts);
        setTotalPages(result.totalPages);
      } catch (error) {
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-white mb-12 text-center"
        >
          All Articles
        </motion.h1>

        {isLoading ? (
          <div className="text-center text-white">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="bg-white/5 backdrop-blur-lg rounded-lg overflow-hidden border border-white/10">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-white/10 text-gray-300 font-medium">
                <div className="col-span-1 text-center">No.</div>
                <div className="col-span-7">Title & Excerpt</div>
                <div className="col-span-2 text-center">Category</div>
                <div className="col-span-2 text-center">Date</div>
              </div>

              {/* Table Body */}
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-12 gap-4 p-4 border-t border-white/10 hover:bg-white/5"
                >
                  <div className="col-span-1 text-center text-gray-400">
                    {(currentPage - 1) * pageSize + index + 1}
                  </div>
                  <div className="col-span-7">
                    <Link
                      href={`/articles/${post.slug}`}
                      className="block group"
                    >
                      <h3 className="text-white group-hover:text-blue-400 transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    </Link>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="col-span-2 text-center text-gray-400">
                    {formatDate(post.created_at)}
                  </div>
                </motion.div>
              ))}

              {posts.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No articles found
                </div>
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
          </>
        )}
      </div>
    </div>
  );
} 