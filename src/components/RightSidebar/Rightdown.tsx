import Image from 'next/image';
import Link from 'next/link';
import { profile } from '../../json/ProfileRight.jsx';
import { IRightDown } from '@/app/types/rightdown';

const Rightdown = () => {
  return (
    <div className="mt-3 space-y-3">
      {profile?.map((item: IRightDown) => (
        <div key={item.id} className="flex items-center gap-3">
          <Image src={item.image} alt={item.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-950">{item.name}</p>
            <p className="truncate text-xs text-slate-500">{item.username}</p>
          </div>
          <Link href="/profile" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800">
            Follow
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Rightdown;
