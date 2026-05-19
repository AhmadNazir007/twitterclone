'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BellIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  EllipsisHorizontalCircleIcon,
  HashtagIcon,
  HomeIcon,
  ListBulletIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellSolid,
  BookmarkIcon as BookmarkSolid,
  ChatBubbleLeftRightIcon as ChatSolid,
  EllipsisHorizontalCircleIcon as MoreSolid,
  HashtagIcon as HashtagSolid,
  HomeIcon as HomeSolid,
  ListBulletIcon as ListSolid,
  UserCircleIcon as UserSolid,
} from '@heroicons/react/24/solid';
import { menu } from '../../json/LeftMenu.jsx';
import { ILeftSideBar } from '@/app/types/left.js';

const icons = {
  Home: [HomeIcon, HomeSolid],
  Explore: [HashtagIcon, HashtagSolid],
  Notifications: [BellIcon, BellSolid],
  Messages: [ChatBubbleLeftRightIcon, ChatSolid],
  Bookmarks: [BookmarkIcon, BookmarkSolid],
  Lists: [ListBulletIcon, ListSolid],
  Profile: [UserCircleIcon, UserSolid],
  More: [EllipsisHorizontalCircleIcon, MoreSolid],
};

const LeftMenu = ({ compact = false }: { compact?: boolean }) => {
  const pathname = usePathname();

  return (
    <nav className={compact ? 'grid grid-cols-5 gap-1' : 'space-y-1'}>
      {menu?.map((item: ILeftSideBar) => {
        const isActive = pathname === item.href;
        const [OutlineIcon, SolidIcon] = icons[item.menu_name as keyof typeof icons] ?? icons.More;
        const Icon = isActive ? SolidIcon : OutlineIcon;

        return (
          <Link
            href={item.href}
            key={item.id}
            title={item.menu_name}
            className={`group flex items-center gap-3 rounded-full px-3 py-3 text-sm font-semibold transition ${
              compact
                ? 'justify-center'
                : 'justify-start lg:px-4'
            } ${
              isActive
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Icon className="h-6 w-6 shrink-0" />
            {!compact && <span className="hidden lg:inline">{item.menu_name}</span>}
          </Link>
        );
      })}
    </nav>
  );
};

export default LeftMenu;

