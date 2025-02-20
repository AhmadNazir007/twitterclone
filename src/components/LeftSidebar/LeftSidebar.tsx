import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LeftMenu from './LeftMenu'
import MenuProfile from './MenuProfile'
import { AppIcons } from '@/app/assets'

const LeftSidebar = () => {
  return (
    <div className='ml-[88px]'>

      <div className='my-3 mx-2'>
        <Image src={AppIcons.logo} alt="logo" width={30} height={30} style={{backgroundColor:'#fffff'}} />
      </div>
      
       <LeftMenu />

      <div className='m-4'>
        <Link href='/home' className='py-[15px] px-[93px] text-center font-sfcompactM text-h4 bg-primary_blue rounded-full text-white'> Tweet </Link>
      </div>

      <MenuProfile />


    </div>
  )
}

export default LeftSidebar;