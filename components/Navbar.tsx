import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import {ModeToggle} from "@/components/ModeToggle"
import { getApiLimitCount } from "@/lib/api-limit";

const Navbar=async()=>{
    const apiLimitCount=await getApiLimitCount();
        return(
        <div className="flex items-center p-4">
            <MobileSidebar apiLimitCount={apiLimitCount} />
            <div className="flex justify-end w-full ">
                <div className="flex px-4">
                <ModeToggle/>
                </div>
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    );
}
export default Navbar