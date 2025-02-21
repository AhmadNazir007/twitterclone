import React from 'react'
import Image from 'next/image'
import { AppIcons } from '@/app/assets'
import {profile} from '../../json/ProfileMenu.jsx'

const MenuProfile = () => {
  return (
		<>
			<div className=''>
				<div className='flex items-center gap-3'>
					<Image src={profile.image} alt='logo' width={39} height={39} />

					<div className='flex flex-col'>
						<p className='font-sfcompactM text-h3 font-bold'>
							{' '}
							{profile.name}{' '}
						</p>
						<p className='font-sfcompactM text-h3 font-medium text-dark5'>
							{' '}
							{profile.username}{' '}
						</p>
					</div>

					<Image
						src={AppIcons.ellipses_default}
						alt='logo'
						width={39}
						height={39}
					/>
				</div>
			</div>
		</>
	);
}

export default MenuProfile