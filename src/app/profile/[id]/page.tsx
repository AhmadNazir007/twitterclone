import AppShell from '@/components/AppShell';
import Profile from '@/components/Profile/Profile';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <Profile profileUserId={id} />
    </AppShell>
  );
}
