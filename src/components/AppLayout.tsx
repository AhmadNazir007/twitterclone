'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '../../store/index'
import { LoginForm } from './auth/LoginForm';

export default function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // Prevent mismatch between SSR/CSR

  return (
    <>
      {isAuthenticated ? (
        <>
          {children}
        </>
      ) : (
        <LoginForm />
      )}
    </>
  );
}
