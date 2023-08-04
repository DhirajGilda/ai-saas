"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNT } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface FreeCountProps{
    apiLimitCounter:number,
}

export const FreeCount=({
    apiLimitCounter=0
}:FreeCountProps)=>{
    const proModal=useProModal();
    const [mounted,setMounted]=useState(false);

    useEffect(()=>{
        setMounted(true);
    },[])

    if(!mounted){
        return null;
    }
    return(
        <div className="px-3">
            <Card className="bg-y-10 border-0  bg-white dark:bg-gray-900">
                <CardContent className="py-4">
                    <div className="text-center text-sm text-black dark:text-white mb-4 space-y-2">
                        <p>
                            {apiLimitCounter} / {MAX_FREE_COUNT} Free Generations
                        </p>
                        <Progress
                         className="h-3"
                         value={(apiLimitCounter/MAX_FREE_COUNT)*100}
                        />
                    <Button onClick={proModal.onOpen} className="w-full " variant="premiumdark"  >
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 dark:fill-white fill-black "/>
                    </Button>
                    </div>
                </CardContent>

            </Card>
        </div>
    )
}