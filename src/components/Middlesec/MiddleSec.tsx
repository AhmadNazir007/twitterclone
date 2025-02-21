import React from 'react'
import Image from "next/image";
import {mid} from '../../json/MidSec.jsx'
import { AppIcons } from "@/app/assets";
import Link from 'next/link.js';
import MidLayer from './MidLayer'

const MiddleSec = () => {
	return (
		<div className=''>
			<div className='border border-dark7 p-4 flex justify-between'>
				<p className='text-h2 font-sfcompactM font-bold'> {mid.name} </p>
				<Image src={mid.image} alt='top tweet' width={23} height={21} />
			</div>

			<div className='border border-dark7'>
				<div className='my-[10px] mx-[15px]'>
					<div className='flex items-center'>
						<Image
							src={AppIcons.avatar_medium}
							alt='Avatar'
							width={49}
							height={49}
						/>
						<input placeholder='Whats Happening?' className='ml-3' />
					</div>

					<div className='flex mt-4'>
						<div className='flex gap-2 ml-14'>
							<Image src={AppIcons.media} alt='Avatar' width={24} height={24} />
							<Image src={AppIcons.gif} alt='Avatar' width={24} height={24} />
							<Image src={AppIcons.poll} alt='Avatar' width={24} height={24} />
							<Image src={AppIcons.emoji} alt='Avatar' width={24} height={24} />
							<Image
								src={AppIcons.schedule}
								alt='Avatar'
								width={24}
								height={24}
							/>
						</div>

						<div className='ml-64'>
							<Link
								href='/home'
								className='py-2 px-4 text-center font-sfcompactM text-h4 bg-primary_blue rounded-full text-white'>
								{' '}
								Tweet{' '}
							</Link>
						</div>
					</div>
				</div>
			</div>

			<MidLayer />
		</div>
	);
};

export default MiddleSec;