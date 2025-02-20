import React from 'react'
import Image from 'next/image'
import {middata} from '../../json/MiddleTweet.jsx'
import { IMiddleSec } from '@/app/types/middle.js'

const MidLayer = () => {
  const data = middata;
  return (
    
    data.map((curele, index) =>(
    
      <div className='flex mt-3 border border-dark7' key={index}>
      <div className='w-[10%]'>
           <Image src={curele.profile_image} width={49} height={49} alt="User1" className='border rounded-full' />
      </div>

      <div className='flex flex-col w-[90%]'>

          <div className='flex gap-2'>
            <p className='font-sfcompactM font-bold text-h4'>{curele.name}</p>
            <p className='font-sfcompactM font-medium text-h4 text-dark5'>{curele.username}</p>
            <p className='font-sfcompactM font-medium text-h4 text-dark5'>{curele.timing}</p>
          </div>

          <p className='font-sfcompactM font-medium text-h4'>Tom is in Big Hurry!</p>
          <Image src={curele.featured_image} width={509} height={247} alt="User1" className='my-2' />
         
{

          <div className='flex justify-around my-1'>
              <div className='flex gap-2 items-center'>
                {curele.comment &&  <Image src={curele.comment?.logo} width={15} height={15} alt="Comment" />}  
                   <p className='text-h6 font-medium font-sfcompactT'> {curele.comment?.count} </p>
               </div>
              <div className='flex gap-2 items-center'> 
              {curele.retweet &&  <Image src={curele.retweet?.logo} width={15} height={15} alt="Retweet" />}
                  <p className='text-h6 font-medium font-sfcompactT'> {curele.retweet?.count} </p>
               </div>
              <div className='flex gap-2 items-center'>
              {curele.likes &&  <Image src={curele.likes?.logo} width={15} height={15} alt="Likes" />}
                   <p className='text-h6 font-medium font-sfcompactT'>{curele.likes?.count} </p>
              </div>
              <div className='flex gap-2 items-center'>
              {curele.share &&  <Image src={curele.share?.logo} width={15} height={15} alt="Share" />}
                   <p className='text-h6 font-medium font-sfcompactT'> {curele.share?.count}</p>
                   </div>
          </div>
}
              <p className='text-h6 font-medium font-sfcompactT text-primary_blue'> Show this tread </p>
      </div>

  </div>


      ))
    
  )
   


  
}

export default MidLayer