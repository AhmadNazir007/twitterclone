import React from 'react'
import Image from "next/image";
import {rightsidebar} from '../../json/RightSidebar.jsx'
import { IRightSideBar } from '@/app/types/right.js';

const RightNews = () => {
  return (
    
    rightsidebar?.map((curele:IRightSideBar, index)=> (
        <>
        <div className="flex" key={index}>
       <div className="flex flex-col gap-3 ml-[15px] w-[70%]">
       <div className="flex gap-2">
        <span className="font-sfcompactT text-h5 font-medium text-dark5">
          {" "}
          {curele.catageory1} {" "}
        </span>
        <span className="font-sfcompactT text-h5 font-medium text-dark5">
          {" "}
          {curele.timing}{" "}
        </span>
      </div>


        <p className="font-sfcompactM text-h4 font-bold">
          {" "}
         {curele.title}
        </p>
    

   
        <p className="text-dark5 font-sfcompactT text-h5 font-medium">
         
          {curele.trend}
          <span className="text-primary_blue">{curele['#hastag']}</span>{" "}
        </p>
    
    </div>

    <div className="mt-6 mx-2">
      <Image src={curele.image} alt="logo" width={71} height={69} />
    </div>
  </div>
  <hr></hr>
        </>

    ))
    
    
  )

}

export default RightNews