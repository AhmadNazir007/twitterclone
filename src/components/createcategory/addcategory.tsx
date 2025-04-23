"use client"
import { useState } from 'react';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Replace with your token logic

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setMessage('Category created successfully');
      setName('');
    } else {
      const err = await res.json();
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        className="border px-2 py-2 rounded w-1/2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Category
      </button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
};

export default AddCategory;
