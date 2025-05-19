import { getPosts } from '@/lib/posts';
import ArticlesList from './ArticlesList';

export const revalidate = 60; // 1분마다 재검증

interface PageProps {
  searchParams: { page?: string };
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 10;
  
  const { posts, totalPages } = await getPosts(true, currentPage, pageSize);

  return (
    <ArticlesList 
      initialPosts={posts} 
      initialTotalPages={totalPages} 
      initialPage={currentPage}
    />
  );
} 