import React from 'react';
import Image from 'next/image';
import { AppIcons } from '@/app/assets';
import Link from 'next/link';
import MidLayer from '../Middlesec/MidLayer';

const Profile = () => {
	return (
		<>
			<div className=''>
				<div className='border border-dark7 p-4 flex gap-6 items-center'>
					<Image
						src={AppIcons.back_arrow}
						alt='Avatar'
						width={24}
						height={24}
						className=''
					/>
					<div className='flex flex-col'>
						<p className='text-h2 font-sfcompactM font-bold'> Profile </p>
						<p className='text-h6 font-sfcompactT font-medium text-dark5'>
							{' '}
							9 Tweets{' '}
						</p>
					</div>
				</div>

				<div className='border border-dark7 flex flex-col '>
					<div className=''>
						<Image
							src={AppIcons.profile_background}
							alt='Avatar'
							width={600}
							height={200}
						/>
					</div>

					<div className='flex justify-between'>
						<div className='flex flex-col -mt-20 ml-4'>
							<Image
								src={AppIcons.avatar_main}
								alt='Avatar'
								width={139}
								height={139}
								className='border-4 border-black rounded-full '
							/>
							<p className='font-sfcompactM font-bold text-h1 text-black'>
								{' '}
								Davide Biscuso{' '}
							</p>
							<p className='font-sfcompactM text-h3 font-medium text-dark5 '>
								{' '}
								@biscuttu{' '}
							</p>
							<p className='font-sfcompactM text-h3 font-medium mt-2'>
								{' '}
								Product Designer{' '}
							</p>

							<div className='flex gap-2 mt-2'>
								<Image
									src={AppIcons.location}
									alt='Avatar'
									width={19}
									height={19}
								/>
								<p className='font-sfcompactM text-h3 font-medium text-dark5'>
									{' '}
									London{' '}
								</p>

								<Image
									src={AppIcons.calendar}
									alt='Avatar'
									width={19}
									height={19}
								/>
								<p className='font-sfcompactM text-h3 font-medium text-dark5'>
									{' '}
									Joined September 2011{' '}
								</p>
							</div>

							<div className='flex gap-2 mt-2'>
								<p className='font-sfcompactM text-h3 font-bold '> 569 </p>
								<p className='font-sfcompactM text-h3 font-medium text-dark5'>
									{' '}
									Following{' '}
								</p>
								<p className='font-sfcompactM text-h3 font-bold '> 72 </p>
								<p className='font-sfcompactM text-h3 font-medium text-dark5'>
									{' '}
									Followers{' '}
								</p>
							</div>
						</div>

						<div className='m-4'>
							<Link
								href='/profile'
								className='py-[10px] px-[18px] text-center font-sfcompactM text-h4 border border-primary_blue rounded-full text-primary_blue '>
								Edit Profile
							</Link>
						</div>
					</div>

					<div className='flex font-bold font-sfcompactM text-h3 text-dark5 gap-2 '>
						<p className='py-4 w-[20%] px-8 text-primary_blue border-b-primary_blue border-b-2'>
							{' '}
							Tweets{' '}
						</p>
						<p className='py-4 w-[40%] px-8  '> Tweets & replies </p>
						<p className='py-4 w-[20%] px-8  '> Media </p>
						<p className='py-4 w-[20%] px-8 '> Likes </p>
					</div>
				</div>
			</div>

			<MidLayer />
		</>
	);
};

export default Profile;
