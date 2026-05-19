'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { SparklesIcon } from '@heroicons/react/24/solid';

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    adminToken: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.role === 'admin' && !formData.adminToken) {
      newErrors.adminToken = 'Admin token is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          adminToken: formData.role === 'admin' ? formData.adminToken : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      toast.success('Registration successful. Please sign in.');
      router.push('/loginform');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/40 sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <SparklesIcon className="h-6 w-6" />
          </span>
          <span className="text-xl font-black text-slate-950">Pulse</span>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600">Create account</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">Start posting today</h2>
        <p className="mt-2 text-sm text-slate-500">Create a user account, or use your admin secret to register as an admin.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="text-sm font-bold text-slate-700">Full name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-2 h-12 w-full rounded-2xl border px-4 outline-none ring-teal-500/20 transition focus:ring-4 ${errors.name ? 'border-rose-400' : 'border-slate-200 focus:border-teal-300'}`}
            />
            {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-bold text-slate-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              className={`mt-2 h-12 w-full rounded-2xl border px-4 outline-none ring-teal-500/20 transition focus:ring-4 ${errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-teal-300'}`}
            />
            {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span>
              <span className="block text-sm font-bold text-slate-800">Register as admin</span>
              <span className="block text-xs text-slate-500">Requires your backend ADMIN_SECRET</span>
            </span>
            <input
              type="checkbox"
              checked={formData.role === 'admin'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.checked ? 'admin' : 'user',
                  adminToken: '',
                }))
              }
              className="h-5 w-5 accent-teal-600"
            />
          </label>

          {formData.role === 'admin' && (
            <div>
              <label htmlFor="adminToken" className="text-sm font-bold text-slate-700">Admin token</label>
              <input
                type="password"
                id="adminToken"
                name="adminToken"
                value={formData.adminToken}
                onChange={handleChange}
                className={`mt-2 h-12 w-full rounded-2xl border px-4 outline-none ring-teal-500/20 transition focus:ring-4 ${errors.adminToken ? 'border-rose-400' : 'border-slate-200 focus:border-teal-300'}`}
              />
              {errors.adminToken && <p className="mt-1 text-sm text-rose-600">{errors.adminToken}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-full bg-slate-950 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/loginform" className="font-black text-teal-700 hover:text-teal-800">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterForm;

