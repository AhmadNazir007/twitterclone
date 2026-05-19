'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { RootState } from '../../store/index'
import type { AppDispatch } from '../../store/index';
import { loginSuccess } from '../../store/slices/authSlice';
import { LoginForm } from './auth/LoginForm';

const publicRoutes = new Set(['/loginform', '/registerform']);

export default function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user && !isAuthenticated) {
      try {
        dispatch(loginSuccess({ token, user: JSON.parse(user) }));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setHasMounted(true);
  }, [dispatch, isAuthenticated]);

  if (!hasMounted) return null; // Prevent mismatch between SSR/CSR

  if (publicRoutes.has(pathname)) {
    return <>{children}</>;
  }

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
