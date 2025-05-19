'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getPosts, Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Script from 'next/script';

export const revalidate = 60;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const result = await getPosts(true, 1, 6); // Get first 6 posts
        setPosts(result.posts);
      } catch (error) {
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Google AdSense Ad */}
          <div className="mb-8">
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5290244357086785"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-5290244357086785"
              data-ad-slot="7081915067"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            <Script id="adsbygoogle-init">
              {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">The Future of AI</h2>
            <p className="text-xl text-gray-300">
              Exploring the latest developments in artificial intelligence
            </p>
          </motion.div>
        </motion.div>

        {/* Recent Posts Section */}
        <section className="pt-0 pb-4 px-4 sm:px-6 lg:px-8 -mt-8 relative z-50">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 mb-4 text-center"
            >
              Recent Posts
            </motion.h2>

            {isLoading ? (
              <div className="text-center text-white">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {post.title}
                      </h3>
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
            )}
          </div>
        </section>
      </main>
    </div>
  );
} 