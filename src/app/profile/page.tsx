import React from 'react'
import LeftSidebar from '@/components/LeftSidebar/LeftSidebar';
import RightSidebar from '@/components/RightSidebar/RightSidebar';
import Profile from '@/components/Profile/Profile';

const page = () => {
	return (
		<main>
			<div className='flex'>
				<div className='w-[30%]'>
					<LeftSidebar />
				</div>
				<div className='w-[40%]'>
					<Profile />
				</div>
				<div className='w-[30%]'>
					<RightSidebar />
				</div>
			</div>
		</main>
	);
};

export default page