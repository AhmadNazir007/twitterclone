import { Suspense } from 'react';
import AppShell from '@/components/AppShell';
import EmptySection from '@/components/EmptySection';
import NotificationsPage from '@/components/NotificationsPage';
import MessagesPage from '@/components/Messages/MessagesPage';

const allowedSections = new Set([
  'explore',
  'notifications',
  'messages',
  'bookmarks',
  'lists',
  'more',
]);

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: requestedSection } = await params;
  const section = allowedSections.has(requestedSection) ? requestedSection : 'more';

  return (
    <AppShell>
      {section === 'notifications' ? (
        <NotificationsPage />
      ) : section === 'messages' ? (
        <Suspense fallback={
          <div className="flex h-[70vh] items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        }>
          <MessagesPage />
        </Suspense>
      ) : (
        <EmptySection section={section} />
      )}
    </AppShell>
  );
}
