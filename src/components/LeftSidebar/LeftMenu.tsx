import React from 'react';
import Image from 'next/image';
import { menu } from '../../json/LeftMenu.jsx';
import { ILeftSideBar } from '@/app/types/left.js';

const LeftMenu = () => {
	return (
		<div>
			{menu?.map((item:ILeftSideBar, index) => (
				
			
						<div key={index} className='flex items-center gap-3 w-[255px] h-[60px]'>
							<div className='mx-4'>
								<Image src={item.image} alt='logo' width={30} height={30} />
							</div>

							<div className=''>
								<span className='font-sfcompactM text-h2 font-bold'>
									{' '}
									{item.menu_name}
								</span>
							</div>
						</div>
					
			
			))}
		</div>
	);
};

export default LeftMenu;
