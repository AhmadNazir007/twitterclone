'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setMessage('Category created');
      setName('');
    } else {
      const err = await res.json();
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Admin</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="h-10 w-full rounded-xl border border-teal-200 bg-white px-3 text-sm outline-none ring-teal-500/20 transition focus:ring-4"
      />
      <button
        type="submit"
        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 text-sm font-bold text-white transition hover:bg-teal-700"
      >
        <PlusIcon className="h-4 w-4" />
        Create
      </button>
      {message && <p className="text-xs font-medium text-teal-700">{message}</p>}
    </form>
  );
};

export default AddCategory;

