'use client';

import { useEffect, useState } from 'react';
import { createTestPosts, createBulkTestPosts } from '@/lib/posts';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleCreateTestPosts = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createTestPosts();
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create test posts');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBulkTestPosts = async () => {
    setIsBulkLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createBulkTestPosts();
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create bulk test posts');
      console.error(error);
    } finally {
      setIsBulkLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Setup</h1>

          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-300 mb-6">
              You need to be logged in to create test posts. Please log in first.
            </p>

            <Link
              href="/admin"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Setup</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Create Sample Posts</h2>
            <p className="text-gray-300 mb-6">
              This will create three sample posts in your database. Use this to test the basic blog functionality.
            </p>

            <button
              onClick={handleCreateTestPosts}
              disabled={isLoading || isBulkLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Sample Posts'}
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Create Bulk Test Posts</h2>
            <p className="text-gray-300 mb-6">
              This will create 100 test posts with varied content across different categories. Use this to test pagination and filtering.
            </p>

            <button
              onClick={handleCreateBulkTestPosts}
              disabled={isLoading || isBulkLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBulkLoading ? 'Creating...' : 'Create 100 Test Posts'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 text-red-500">{error}</div>
        )}

        {success && (
          <div className="mt-8 text-green-500">
            Posts created successfully! You can now view them on the home page or articles page.
          </div>
        )}
      </div>
    </div>
  );
} 