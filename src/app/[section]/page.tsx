import AppShell from '@/components/AppShell';
import EmptySection from '@/components/EmptySection';

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
      <EmptySection section={section} />
    </AppShell>
  );
}
