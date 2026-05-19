'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { SparklesIcon } from '@heroicons/react/24/solid';
import type { RootState } from '../../../store';
import LeftMenu from './LeftMenu';
import LogoutButton from '../logout/logoutButton';
import MenuProfile from './MenuProfile';
import AddCategory from '../createcategory/addcategory';

const Sidebar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <aside className="sticky top-0 hidden h-screen flex-col justify-between py-4 lg:flex">
        <div>
          <Link href="/" className="mb-5 flex items-center gap-3 px-3 text-slate-950">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <SparklesIcon className="h-6 w-6" />
            </span>
            <span className="hidden text-lg font-black lg:inline">Pulse</span>
          </Link>
          <LeftMenu />
          <div className="mt-5 px-2">
            {isAuthenticated ? (
              <LogoutButton />
            ) : (
              <Link
                href="/registerform"
                className="flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                Join now
              </Link>
            )}
          </div>
          {isAuthenticated && isAdmin && (
            <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/70 p-3">
              <AddCategory />
            </div>
          )}
        </div>
        {isAuthenticated && <MenuProfile />}
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-10px_28px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <LeftMenu compact />
      </nav>
    </>
  );
};

export default Sidebar;

