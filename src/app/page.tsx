import LeftSidebar from "@/components/LeftSidebar/LeftSidebar";
import MiddleSec from "@/components/Middlesec/MiddleSec";
import RightSidebar from "@/components/RightSidebar/RightSidebar";



export default function Home() {
  return (
   
     <main>
      <div className="flex">
        <div className="w-[30%]">
        <LeftSidebar />
        </div>
        <div className="w-[40%]">
        <MiddleSec />
        </div>
        <div className="w-[30%]">
        <RightSidebar />
        </div>
      </div> 
     </main>
  );
}
