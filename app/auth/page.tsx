'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { BookOpenIcon, UserCircleIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface FormData {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
  role?: 'user' | 'admin';
}

const AuthPage = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const isLogin = mode === 'login';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const router = useRouter();
  const { login, register, authToken, isLoading, user } = useAppContext();

  useEffect(() => {
    if (!hasRedirected && authToken && !isLoading && user?.role) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');  // Admin route
      } else {
        router.push('/user');             // User route
      }
      setHasRedirected(true);
    }
  }, [authToken, isLoading, user?.role, hasRedirected, router]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    if (name === 'isAdmin') {
      setFormData(prev => ({
        ...prev,
        role: checked ? 'admin' : 'user',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
      } else {
        if (formData.password !== formData.password_confirmation) {
          toast.error("Passwords don't match!");
          setIsSubmitting(false);
          return;
        }
        await register(
          formData.name!,
          formData.email,
          formData.password,
          formData.password_confirmation!,
          formData.role || 'user'  // Pass role to register
        );
        toast.success('Registered successfully! Please login.');
        router.push('/auth?mode=login');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error?.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpenIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white font-['Montserrat']">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {isLogin ? 'Sign in to access your account' : 'Join our library community'}
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    name="isAdmin"
                    checked={formData.role === 'admin'}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isAdmin" className="block text-sm text-gray-200">
                    Register as Admin
                  </label>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-200 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    minLength={8}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {isSubmitting ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Log In' : 'Register')}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-gray-400">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <a href="/auth?mode=register" className="text-indigo-400 hover:underline">
                  Register
                </a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a href="/auth?mode=login" className="text-indigo-400 hover:underline">
                  Log in
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
