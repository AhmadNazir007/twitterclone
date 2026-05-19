import LeftSidebar from '@/components/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/RightSidebar/RightSidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 px-3 pb-20 sm:px-4 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-6 lg:pb-0 xl:grid-cols-[244px_minmax(0,640px)_360px]">
      <LeftSidebar />
      <section className="mx-auto min-h-screen w-full max-w-2xl border-x border-slate-200/80 bg-white/86 shadow-sm shadow-slate-200/60 backdrop-blur">
        {children}
      </section>
      <RightSidebar />
    </main>
  );
}
