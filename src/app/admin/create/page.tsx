'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { createPost, getHashtags, Hashtag } from '@/lib/posts';
import ProtectedRoute from '@/components/ProtectedRoute';
import { nanoid } from 'nanoid';
import dynamic from 'next/dynamic';
import MarkdownEditor from '@/components/MarkdownEditor';

// 동적 import (SSR 비활성화)
// const EditorJs = dynamic(() => import('@/components/EditorJs'), { ssr: false });

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    content: '',
    published: false,
  });

  useEffect(() => {
    const loadHashtags = async () => {
      try {
        const tags = await getHashtags();
        setHashtags(tags);
      } catch (error) {
        console.error('Failed to load hashtags:', error);
      }
    };

    loadHashtags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('User not authenticated');
      
      // Create hash from title using browser's crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(formData.title);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const titleHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 8);
      const slug = `post-${titleHash}-${nanoid(6)}`;
      
      const newPost = {
        ...formData,
        published: true,
        slug,
        author_id: user.id,
      };
      const created = await createPost(newPost, selectedHashtags);
      router.push(`/articles/${created.slug}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHashtagChange = (hashtagId: string) => {
    setSelectedHashtags(prev => {
      if (prev.includes(hashtagId)) {
        return prev.filter(id => id !== hashtagId);
      } else {
        return [...prev, hashtagId];
      }
    });
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Create New Post</h1>
            <p className="text-xl text-gray-300">
              Write and publish your new blog post
            </p>
          </motion.div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-md text-sm mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post excerpt"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">카테고리 선택</option>
                <option value="AI란 무엇인가">AI란 무엇인가</option>
                <option value="머신러닝 기초">머신러닝 기초</option>
                <option value="딥러닝 기초">딥러닝 기초</option>
                <option value="데이터 과학과 AI">데이터 과학과 AI</option>
                <option value="AI 최신 뉴스 및 동향">AI 최신 뉴스 및 동향</option>
                <option value="AI 관련 주요 용어 해설">AI 관련 주요 용어 해설</option>
                <option value="AI 분야별 전문가 인터뷰">AI 분야별 전문가 인터뷰</option>
                <option value="AI 컨퍼런스/세미나 후기">AI 컨퍼런스/세미나 후기</option>
                <option value="LLM의 이해">LLM의 이해</option>
                <option value="주요 LLM 모델 비교 분석">주요 LLM 모델 비교 분석</option>
                <option value="LLM 학습 방법론">LLM 학습 방법론</option>
                <option value="프롬프트 엔지니어링">프롬프트 엔지니어링</option>
                <option value="LLM의 한계와 도전 과제">LLM의 한계와 도전 과제</option>
                <option value="RAG 심층 분석">RAG 심층 분석</option>
                <option value="LLM 기반 에이전트">LLM 기반 에이전트</option>
                <option value="LLM 평가 지표 및 방법">LLM 평가 지표 및 방법</option>
                <option value="오픈소스 LLM 생태계">오픈소스 LLM 생태계</option>
                <option value="LLM 경량화 및 최적화 기술">LLM 경량화 및 최적화 기술</option>
                <option value="LMM의 이해">LMM의 이해</option>
                <option value="LMM의 작동 원리 및 아키텍처">LMM의 작동 원리 및 아키텍처</option>
                <option value="주요 LMM 모델 소개">주요 LMM 모델 소개</option>
                <option value="LMM 학습 데이터셋 및 구축">LMM 학습 데이터셋 및 구축</option>
                <option value="LMM과 LLM의 차이점 및 연관성">LMM과 LLM의 차이점 및 연관성</option>
                <option value="멀티모달 데이터 처리 기술">멀티모달 데이터 처리 기술</option>
                <option value="LMM의 시각 정보 이해">LMM의 시각 정보 이해</option>
                <option value="LMM의 음성/오디오 처리">LMM의 음성/오디오 처리</option>
                <option value="챗봇 및 가상 비서">챗봇 및 가상 비서</option>
                <option value="콘텐츠 생성">콘텐츠 생성</option>
                <option value="코드 생성 및 개발 지원">코드 생성 및 개발 지원</option>
                <option value="이미지 생성 및 편집">이미지 생성 및 편집</option>
                <option value="음성 인식 및 합성">음성 인식 및 합성</option>
                <option value="영상 분석 및 생성">영상 분석 및 생성</option>
                <option value="의료 분야 AI 활용">의료 분야 AI 활용</option>
                <option value="금융 분야 AI 활용">금융 분야 AI 활용</option>
                <option value="교육 분야 AI 활용">교육 분야 AI 활용</option>
                <option value="예술 및 창작 분야 AI">예술 및 창작 분야 AI</option>
                <option value="제조 및 스마트 팩토리">제조 및 스마트 팩토리</option>
                <option value="자율주행 기술과 AI">자율주행 기술과 AI</option>
                <option value="고객 서비스 혁신">고객 서비스 혁신</option>
                <option value="검색 엔진의 미래">검색 엔진의 미래</option>
                <option value="AI 모델 개발 파이프라인">AI 모델 개발 파이프라인</option>
                <option value="MLOps">MLOps</option>
                <option value="AI 개발 도구 및 프레임워크">AI 개발 도구 및 프레임워크</option>
                <option value="클라우드 AI 플랫폼 활용">클라우드 AI 플랫폼 활용</option>
                <option value="AI 모델 배포 및 서빙">AI 모델 배포 및 서빙</option>
                <option value="데이터 전처리 및 증강">데이터 전처리 및 증강</option>
                <option value="AI 반도체 및 하드웨어">AI 반도체 및 하드웨어</option>
                <option value="AI 윤리 및 책임감 있는 AI">AI 윤리 및 책임감 있는 AI</option>
                <option value="AI 편향성 및 공정성 문제">AI 편향성 및 공정성 문제</option>
                <option value="AI 규제 및 법적 문제">AI 규제 및 법적 문제</option>
                <option value="AI와 일자리 변화">AI와 일자리 변화</option>
                <option value="AI 저작권 및 지적 재산권">AI 저작권 및 지적 재산권</option>
                <option value="설명 가능한 AI">설명 가능한 AI</option>
                <option value="AI 보안 및 프라이버시">AI 보안 및 프라이버시</option>
                <option value="AGI를 향한 여정">AGI를 향한 여정</option>
                <option value="AI가 바꿀 미래 사회 모습">AI가 바꿀 미래 사회 모습</option>
                <option value="AI/LLM/LMM 학습 로드맵">AI/LLM/LMM 학습 로드맵</option>
                <option value="추천 논문 및 아티클 리뷰">추천 논문 및 아티클 리뷰</option>
                <option value="유용한 온라인 강의 및 튜토리얼">유용한 온라인 강의 및 튜토리얼</option>
                <option value="AI 관련 도서 추천 및 서평">AI 관련 도서 추천 및 서평</option>
                <option value="국내외 AI 커뮤니티 소개">국내외 AI 커뮤니티 소개</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hashtags
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hashtags.map((hashtag) => (
                  <label
                    key={hashtag.id}
                    className="flex items-center space-x-2 p-3 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedHashtags.includes(hashtag.id)}
                      onChange={() => handleHashtagChange(hashtag.id)}
                      className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-white">{hashtag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content
              </label>
              <div className="bg-white/5 border border-white/10 rounded-md">
                <MarkdownEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-white/20 rounded-md text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 