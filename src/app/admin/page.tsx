'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, LogOut, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getCurrentUser, signOut } from '@/lib/auth';
import { getPosts, togglePublish, deletePost, Post } from '@/lib/posts';

export default function Admin() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadPosts();
    }
  }, [isLoggedIn]);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const result = await getPosts(false); // Get unpublished posts
      setPosts(result.posts);
    } catch (error) {
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      setIsLoggedIn(true);
      router.refresh();
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      router.refresh();
    } catch (error) {
      setError('Failed to logout');
    }
  };

  const handlePublish = async (id: string, published: boolean) => {
    try {
      await togglePublish(id, published);
      await loadPosts(); // Reload posts after update
    } catch (error) {
      setError('Failed to update post status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePost(id);
      await loadPosts(); // Reload posts after deletion
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
            <p className="text-xl text-gray-300">
              Manage your blog content
            </p>
          </motion.div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-md text-sm mb-8">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Create New Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Create New Post</h2>
              <Link 
                href="/admin/create"
                className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                New Post
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in to manage your blog
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-white/20 bg-white/10 text-white placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-white/20 bg-white/10 text-white placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 