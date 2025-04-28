'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/slices/authSlice'; 

export const LoginForm = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const validate = () => {
    const newErrors = {
      email: '',
      password: ''
    };
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
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(credentials),
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}

			localStorage.setItem('token', data.access_token);
			dispatch(loginSuccess({ token: data.access_token, user: data.user }));

			toast.success('Login successful!');
			router.push('/');
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message || 'Invalid credentials');
			} else {
				toast.error('Invalid credentials');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({ ...prev, [name]: value }));

		// Clear error when user types
		if (errors[name as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold text-center mb-6'>Sign In</h2>

			<div>
				<label
					htmlFor='email'
					className='block text-sm font-medium text-gray-700'>
					Email Address
				</label>
				<input
					type='email'
					id='email'
					name='email'
					value={credentials.email}
					onChange={handleChange}
					className={`mt-1 block w-full px-3 py-2 border ${
						errors.email ? 'border-red-500' : 'border-gray-300'
					} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
					required
				/>
				{errors.email && (
					<p className='mt-1 text-sm text-red-600'>{errors.email}</p>
				)}
			</div>

			{/* Password Field */}
			<div>
				<label
					htmlFor='password'
					className='block text-sm font-medium text-gray-700'>
					Password
				</label>
				<input
					type='password'
					id='password'
					name='password'
					value={credentials.password}
					onChange={handleChange}
					className={`mt-1 block w-full px-3 py-2 border ${
						errors.password ? 'border-red-500' : 'border-gray-300'
					} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
					required
				/>
				{errors.password && (
					<p className='mt-1 text-sm text-red-600'>{errors.password}</p>
				)}
			</div>

			{/* Submit Button */}
			<div>
				<button
					type='submit'
					disabled={isLoading}
					className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
						isLoading ? 'opacity-75 cursor-not-allowed' : ''
					}`}>
					{isLoading ? 'Signing in...' : 'Sign In'}
				</button>
			</div>

			{/* Register Link */}
			<div className='text-center text-sm text-gray-600'>
				Don&rsquo;t have an account?
				<Link
					href='/registerform'
					className='font-medium text-blue-600 hover:text-blue-500'>
					Register here
				</Link>
			</div>
		</form>
	);
};