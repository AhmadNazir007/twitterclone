'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { loginSuccess } from '../../../store/slices/authSlice';

export const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(loginSuccess({ token: data.access_token, user: data.user }));

      toast.success('Login successful');
      router.push('/');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[1fr_420px]">
        <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
              <SparklesIcon className="h-7 w-7" />
            </span>
            <span className="text-xl font-black">Pulse</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300">Welcome back</p>
            <h1 className="mt-4 max-w-md text-5xl font-black leading-tight">Join the conversation without the clutter.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">A cleaner social feed for posts, replies, notifications, and admin-managed categories.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <SparklesIcon className="h-6 w-6" />
              </span>
              <span className="text-xl font-black text-slate-950">Pulse</span>
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600">Sign in</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Continue to your feed</h2>
          <p className="mt-2 text-sm text-slate-500">Use your email and password to pick up where you left off.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-slate-700">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className={`mt-2 h-12 w-full rounded-2xl border px-4 outline-none ring-teal-500/20 transition focus:ring-4 ${errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-teal-300'}`}
              />
              {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-bold text-slate-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className={`mt-2 h-12 w-full rounded-2xl border px-4 outline-none ring-teal-500/20 transition focus:ring-4 ${errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-teal-300'}`}
              />
              {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-full bg-slate-950 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/registerform" className="font-black text-teal-700 hover:text-teal-800">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

