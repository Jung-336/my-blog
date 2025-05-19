import { getPosts } from '@/lib/posts';
import ArticlesList from './ArticlesList';
import Script from 'next/script';
import { motion } from 'framer-motion';

export const revalidate = 60; // 1분마다 재검증

interface PageProps {
  searchParams: { page?: string };
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 10;
  const { posts, totalPages } = await getPosts(true, currentPage, pageSize);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
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
            <h1 className="text-4xl font-bold text-white mb-4">All Articles</h1>
            <p className="text-xl text-gray-300">
              Explore our collection of articles about AI and technology
            </p>
          </motion.div>
          <ArticlesList 
            initialPosts={posts} 
            initialTotalPages={totalPages} 
            initialPage={currentPage}
          />
        </div>
      </main>
    </div>
  );
} 