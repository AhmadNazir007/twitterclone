import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { profile } from '../../json/ProfileRight.jsx';
import { IRightDown } from '@/app/types/rightdown';

const Rightdown = () => {
  return (
		<div>
			{profile?.map((curele: IRightDown, index: number) => (
				<div key={index} className='p-2'>
					<div className='flex justify-between'>
						<div className='w-[20%]'>
							<Image src={curele.image} alt='logo' width={49} height={49} />
						</div>

						<div className='flex flex-col w-[50%]'>
							<span className='font-sfcompactM text-h3 font-bold'>
								{curele.name}
							</span>
							<span className='font-sfcompactM text-h3 font-medium text-dark5'>
								{curele.username}
							</span>
						</div>

						<div className='w-[30%]'>
							<Link
								href='/home'
								className='py-1 px-4 text-center font-sfcompactM text-h4 rounded-full text-primary_blue border-2 border-primary_blue'>
								Follow
							</Link>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Rightdown;