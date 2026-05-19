import Image from 'next/image';
import { rightsidebar } from '../../json/RightSidebar.jsx';
import { IRightSideBar } from '@/app/types/right.js';

const RightNews = () => {
  return (
    <div className="mt-3 divide-y divide-slate-100">
      {rightsidebar?.map((item: IRightSideBar) => (
        <article key={item.id} className="flex gap-3 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-400">
              {item.catageory1} ? {item.timing}
            </p>
            <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-5 text-slate-950">{item.title}</h3>
            <p className="mt-2 text-xs text-slate-500">
              {item.trend} <span className="font-bold text-teal-700">{item['#hastag']}</span>
            </p>
          </div>
          <Image src={item.image} alt="Trending story" width={72} height={72} className="h-16 w-16 rounded-2xl object-cover" />
        </article>
      ))}
    </div>
  );
};

export default RightNews;
