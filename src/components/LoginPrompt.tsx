'use client';

import { useRouter } from 'next/navigation';

const LoginPrompt = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/loginform');
  };

  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-semibold">Please log in to continue</h2>
      <button
        onClick={handleRedirect}
        className="text-blue-500 underline"
      >
        Go to Login
      </button>
    </div>
  );
};

export default LoginPrompt;
