import {
  BellIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  HashtagIcon,
  ListBulletIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const content: Record<
  string,
  {
    title: string;
    eyebrow: string;
    body: string;
    Icon: typeof HashtagIcon;
  }
> = {
  explore: {
    title: 'Explore trends',
    eyebrow: 'Discover',
    body: 'Trending topics, live search, and category feeds will live here once those backend endpoints are added.',
    Icon: HashtagIcon,
  },
  notifications: {
    title: 'Notifications',
    eyebrow: 'Activity',
    body: 'Socket notifications are already wired. A persisted notification inbox can be connected here next.',
    Icon: BellIcon,
  },
  messages: {
    title: 'Messages',
    eyebrow: 'Inbox',
    body: 'Direct messaging needs conversation and message APIs before this page can become fully live.',
    Icon: ChatBubbleLeftRightIcon,
  },
  bookmarks: {
    title: 'Bookmarks',
    eyebrow: 'Saved',
    body: 'Saved posts can appear here after adding bookmark storage to the backend.',
    Icon: BookmarkIcon,
  },
  lists: {
    title: 'Lists',
    eyebrow: 'Curate',
    body: 'Custom lists and circles can be built here when list membership APIs exist.',
    Icon: ListBulletIcon,
  },
  more: {
    title: 'More tools',
    eyebrow: 'Settings',
    body: 'Account settings, admin tools, and preferences can be grouped here as the app grows.',
    Icon: SparklesIcon,
  },
};

export default function EmptySection({ section }: { section: string }) {
  const page = content[section] ?? content.more;
  const Icon = page.Icon;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">
          {page.eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">{page.title}</h1>
      </header>
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <Icon className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-slate-950">{page.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{page.body}</p>
        </div>
      </div>
    </div>
  );
}
