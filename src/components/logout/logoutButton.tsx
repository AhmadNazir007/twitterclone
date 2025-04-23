'use client';
import { useRouter } from 'next/navigation';
import { logoutUser } from '../../../utils/logout';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      toast.success('Logged out successfully');
      router.push('/loginform');
    } else {
      toast.error('Failed to log out');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
