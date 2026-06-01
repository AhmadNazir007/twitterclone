'use client';

import { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import {
  ArrowPathIcon,
  BellAlertIcon,
  BellIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { getNotifications, type NotificationItem } from '../services/notification.service';

type SocketNotification = {
  message: string;
};

const formatNotificationTime = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return 'Just now';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const unreadCount = notifications.length;

  const loadNotifications = async ({ quiet = false } = {}) => {
    if (quiet) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError('');
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      setError('Unable to load notifications');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL) return undefined;
    if (process.env.NEXT_PUBLIC_ENABLE_SOCKET?.toLowerCase() === 'false') return undefined;

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socket.on('notification', (data: SocketNotification) => {
      setNotifications((current) => [
        {
          id: `live-${Date.now()}`,
          message: data.message,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const headerLabel = useMemo(() => {
    if (isLoading) return 'Syncing';
    return unreadCount === 1 ? '1 recent alert' : `${unreadCount} recent alerts`;
  }, [isLoading, unreadCount]);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Activity</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">Notifications</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">{headerLabel}</p>
          </div>
          <button
            onClick={() => loadNotifications({ quiet: true })}
            disabled={isRefreshing || isLoading}
            className="flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <BellIcon className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-lg font-black text-slate-950">Loading notifications</h2>
          <p className="mt-2 text-sm text-slate-500">Checking your latest app activity.</p>
        </div>
      ) : error ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <BellAlertIcon className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-lg font-black text-slate-950">Notifications unavailable</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{error}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <CheckCircleIcon className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-lg font-black text-slate-950">All quiet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            New post and app activity notifications will appear here.
          </p>
        </div>
      ) : (
        <section className="divide-y divide-slate-200">
          {notifications.map((notification) => (
            <article key={notification.id} className="flex gap-3 bg-white p-4 transition hover:bg-slate-50/80 sm:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <BellIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-6 text-slate-900">{notification.message}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  {formatNotificationTime(notification.createdAt)}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
