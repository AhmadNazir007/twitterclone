import React from "react";
import Image from "next/image";
import { AppIcons } from "@/app/assets";
import RightNews from "./RightNews";
import Rightdown from "./Rightdown";

const RightSidebar = () => {
  return (
    <div className="mr-[97px] ml-[30px]">
     
      <div className="my-[10px]  rounded-full bg-dark7 flex gap-2">

        <div className="my-[10px] mx-[16px]">
          <Image
            src={AppIcons.default_search}
            alt="logo"
            width={19}
            height={19}
          />
        </div>

        <input
          placeholder="Search"
          className="my-[10px] bg-dark7 outline-none"
        />
      </div>

      <div className="bg-dark7 rounded-lg">
        <div className="font-sfcompactM font-bold text-h1 px-4 py-3">
          Whats happening?
        </div>
        <hr></hr>

        <RightNews />    
        
        <div className="font-sfcompactM font-medium text-h4 px-4 py-3 text-primary_blue">
          Show More
        </div>


      </div>

      <div className="bg-dark7 rounded-lg mt-4">
        <div className="font-sfcompactM font-bold text-h1 px-4 py-3">
          Who to Follow
        </div>
        <hr></hr>

          <Rightdown/>

        <hr></hr>

        <hr></hr>
        <div className="font-sfcompactM font-medium text-h4 px-4 py-3 text-primary_blue">
          Show More
        </div>

      </div>
    
      <div className="mt-4">
        <p className="text-h6 font-sfcompactM font-medium text-dark5 ">Terms of Service Privacy Policy Cookie Policy <br></br>
        Ads info More © 2021 Twitter, Inc.</p>
      </div>
      

    </div>
  );
};

export default RightSidebar;
