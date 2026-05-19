'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUser } from '../../../utils/logout';
import type { AppDispatch } from '../../../store';
import { logout } from '../../../store/slices/authSlice';

const LogoutButton = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      dispatch(logout());
      toast.success('Logged out successfully');
      router.push('/loginform');
    } else {
      toast.error('Failed to log out');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      <span className="hidden lg:inline">Logout</span>
    </button>
  );
};

export default LogoutButton;

