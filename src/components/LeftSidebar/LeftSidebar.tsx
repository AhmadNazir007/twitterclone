'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; // update path if needed
import { AppIcons } from '@/app/assets';
import LeftMenu from './LeftMenu';
import LogoutButton from '../logout/logoutButton';
import MenuProfile from './MenuProfile';
import AddCategory from '../createcategory/addcategory';

const Sidebar = () => {
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth,
	);

	const isAdmin = user?.role === 'admin';

	console.log('Auth user:', user);

	return (
		<div className='flex flex-col justify-between ml-[88px] fixed h-screen'>
			<div className='my-3 mx-2'>
				<Image
					src={AppIcons.logo}
					alt='logo'
					width={30}
					height={30}
					style={{ backgroundColor: '#fffff' }}
				/>
			</div>

			<LeftMenu />

			<div className='m-4'>
				{!isAuthenticated ? (
					<Link
						href='/registerform'
						className='py-4 px-24 text-center font-sfcompactM text-h4 bg-primary_blue rounded-full text-white'>
						Login/Register
					</Link>
				) : (
					<LogoutButton />
				)}
			</div>

			{isAuthenticated && (isAdmin ? <AddCategory /> : <MenuProfile />)}
		</div>
	);
};

export default Sidebar;
