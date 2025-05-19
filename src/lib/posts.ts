import { supabase } from './supabase';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  slug: string;
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
  hashtags?: Hashtag[];
}

export interface Hashtag {
  id: string;
  name: string;
  created_at: string;
}

const categories = [
  'AI란 무엇인가',
  '머신러닝 기초',
  '딥러닝 기초',
  '데이터 과학과 AI',
  'AI 최신 뉴스 및 동향',
  'AI 관련 주요 용어 해설',
  'AI 분야별 전문가 인터뷰',
  'AI 컨퍼런스/세미나 후기',
  'LLM의 이해',
  '주요 LLM 모델 비교 분석',
  'LLM 학습 방법론',
  '프롬프트 엔지니어링',
  'LLM의 한계와 도전 과제',
  'RAG 심층 분석',
  'LLM 기반 에이전트',
  'LLM 평가 지표 및 방법',
  '오픈소스 LLM 생태계',
  'LLM 경량화 및 최적화 기술',
  'LMM의 이해',
  'LMM의 작동 원리 및 아키텍처',
  '주요 LMM 모델 소개',
  'LMM 학습 데이터셋 및 구축',
  'LMM과 LLM의 차이점 및 연관성',
  '멀티모달 데이터 처리 기술',
  'LMM의 시각 정보 이해',
  'LMM의 음성/오디오 처리',
  '챗봇 및 가상 비서',
  '콘텐츠 생성',
  '코드 생성 및 개발 지원',
  '이미지 생성 및 편집',
  '음성 인식 및 합성',
  '영상 분석 및 생성',
  '의료 분야 AI 활용',
  '금융 분야 AI 활용',
  '교육 분야 AI 활용',
  '예술 및 창작 분야 AI',
  '제조 및 스마트 팩토리',
  '자율주행 기술과 AI',
  '고객 서비스 혁신',
  '검색 엔진의 미래',
  'AI 모델 개발 파이프라인',
  'MLOps',
  'AI 개발 도구 및 프레임워크',
  '클라우드 AI 플랫폼 활용',
  'AI 모델 배포 및 서빙',
  '데이터 전처리 및 증강',
  'AI 반도체 및 하드웨어',
  'AI 윤리 및 책임감 있는 AI',
  'AI 편향성 및 공정성 문제',
  'AI 규제 및 법적 문제',
  'AI와 일자리 변화',
  'AI 저작권 및 지적 재산권',
  '설명 가능한 AI',
  'AI 보안 및 프라이버시',
  'AGI를 향한 여정',
  'AI가 바꿀 미래 사회 모습',
  'AI/LLM/LMM 학습 로드맵',
  '추천 논문 및 아티클 리뷰',
  '유용한 온라인 강의 및 튜토리얼',
  'AI 관련 도서 추천 및 서평',
  '국내외 AI 커뮤니티 소개'
];

const generateTestPosts = (authorId: string) => {
  const posts = [];
  const baseDate = new Date();
  
  for (let i = 0; i < 100; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i); // Each post is one day older than the previous
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const title = `${category} Trends in ${2024 - Math.floor(Math.random() * 5)}: A Comprehensive Guide`;
    const slug = `${category.toLowerCase()}-trends-${2024 - Math.floor(Math.random() * 5)}-${i + 1}`;
    
    posts.push({
      title,
      excerpt: `Exploring the latest developments and future prospects in ${category.toLowerCase()}. This comprehensive guide covers everything you need to know about the current state and future of ${category.toLowerCase()}.`,
      content: `
        <h2>Introduction</h2>
        <p>The field of ${category.toLowerCase()} is evolving at an unprecedented pace. In this article, we'll explore the latest trends and developments that are shaping the future of this exciting domain.</p>
        
        <h2>Current State</h2>
        <p>As we move through 2024, ${category.toLowerCase()} continues to transform industries and create new opportunities. Let's examine the key factors driving this transformation.</p>
        
        <h2>Key Trends</h2>
        <ul>
          <li>Trend 1: Innovation in ${category.toLowerCase()}</li>
          <li>Trend 2: Emerging technologies</li>
          <li>Trend 3: Industry applications</li>
          <li>Trend 4: Future predictions</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>The future of ${category.toLowerCase()} looks promising, with numerous opportunities for growth and innovation. Stay tuned for more updates on this exciting field.</p>
      `,
      category,
      slug,
      published: true,
      author_id: authorId,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    });
  }
  
  return posts;
};

export async function createBulkTestPosts() {
  // First, get the current user's ID
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('No authenticated user found');
  }

  const testPosts = generateTestPosts(user.id);

  // Insert posts in batches of 10 to avoid hitting limits
  const batchSize = 10;
  const results = [];
  
  for (let i = 0; i < testPosts.length; i += batchSize) {
    const batch = testPosts.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('posts')
      .insert(batch)
      .select();

    if (error) {
      console.error('Error creating test posts batch:', error);
      throw error;
    }

    results.push(...(data || []));
    console.log(`Created batch ${i / batchSize + 1} of ${Math.ceil(testPosts.length / batchSize)}`);
  }

  console.log('Created all test posts:', results.length);
  return results;
}

export async function createTestPosts() {
  // First, get the current user's ID
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('No authenticated user found');
  }

  const testPosts = [
    {
      title: 'The Future of AI: A New Era of Innovation',
      excerpt: 'Exploring the latest developments in artificial intelligence and their impact on our future.',
      content: '<p>This is a test post about AI and its future implications.</p>',
      category: 'AI',
      slug: 'future-of-ai',
      published: true,
      author_id: user.id,
    },
    {
      title: 'Building Multi-Agent Systems',
      excerpt: 'A deep dive into creating intelligent systems that work together to solve complex problems.',
      content: '<p>This is a test post about multi-agent systems.</p>',
      category: 'Technology',
      slug: 'multi-agent-systems',
      published: true,
      author_id: user.id,
    },
    {
      title: 'The Rise of LLMs',
      excerpt: 'Understanding how Large Language Models are transforming the way we interact with technology.',
      content: '<p>This is a test post about Large Language Models.</p>',
      category: 'AI',
      slug: 'rise-of-llms',
      published: true,
      author_id: user.id,
    },
  ];

  const { data, error } = await supabase
    .from('posts')
    .insert(testPosts)
    .select();

  if (error) {
    console.error('Error creating test posts:', error);
    throw error;
  }

  console.log('Created test posts:', data);
  return data;
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>, hashtagIds: string[] = []) {
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert([post])
    .select()
    .single();

  if (postError) {
    throw postError;
  }

  if (hashtagIds.length > 0) {
    const { error: hashtagError } = await supabase
      .from('posts_hashtags')
      .insert(
        hashtagIds.map(hashtagId => ({
          post_id: postData.id,
          hashtag_id: hashtagId
        }))
      );

    if (hashtagError) {
      throw hashtagError;
    }
  }

  return postData;
}

export async function updatePost(id: string, post: Partial<Post>) {
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function getPost(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getAdjacentPosts(currentPost: Post) {
  // Get all published posts ordered by creation date
  const { data: allPosts, error: allPostsError } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (allPostsError) {
    throw allPostsError;
  }

  // Find current post index
  const currentIndex = allPosts.findIndex(post => post.id === currentPost.id);
  
  // Get previous and next posts
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return {
    prevPost,
    nextPost
  };
}

export async function getPosts(published: boolean = true, page: number = 1, pageSize: number = 10) {
  console.log('Fetching posts with published status:', published);
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('published', published)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  console.log('Fetched posts:', data);
  return {
    posts: data,
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize)
  };
}

export async function togglePublish(id: string, published: boolean) {
  const { data, error } = await supabase
    .from('posts')
    .update({ published })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getHashtags(): Promise<Hashtag[]> {
  const { data, error } = await supabase
    .from('hashtags')
    .select('*')
    .order('name');

  if (error) {
    throw error;
  }

  return data;
}

export async function getPostWithHashtags(slug: string) {
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (postError) {
    throw postError;
  }

  const { data: hashtags, error: hashtagError } = await supabase
    .from('posts_hashtags')
    .select('hashtag_id, hashtags(*)')
    .eq('post_id', post.id);

  if (hashtagError) {
    throw hashtagError;
  }

  return {
    ...post,
    hashtags: hashtags.map(h => h.hashtags)
  };
} 