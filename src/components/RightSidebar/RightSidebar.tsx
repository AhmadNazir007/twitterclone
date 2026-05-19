import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import RightNews from './RightNews';
import Rightdown from './Rightdown';

const RightSidebar = () => {
  return (
    <aside className="sticky top-0 hidden h-screen overflow-y-auto py-4 xl:block">
      <div className="space-y-4">
        <div className="flex h-12 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 shadow-sm">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          <input
            placeholder="Search Pulse"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">What&apos;s happening</h2>
          <RightNews />
          <button className="mt-3 text-sm font-bold text-teal-700 hover:text-teal-800">Show more</button>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Who to follow</h2>
          <Rightdown />
        </section>

        <p className="px-2 text-xs leading-5 text-slate-400">
          Terms ? Privacy ? Cookies ? Ads info ? ? 2026 Pulse
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
