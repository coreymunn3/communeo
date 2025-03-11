"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { CommunityWithSubs } from "@/lib/types";
import { capitalizeEachWord } from "@/lib/utils";
import { Button } from "./ui/button";
import { GavelIcon, TelescopeIcon } from "lucide-react";
import { Fragment } from "react";

const CommunityTab = ({ community }: { community: CommunityWithSubs }) => {
  return (
    <TooltipProvider>
      <div className="p-2 flex items-center justify-between rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
        {/* name and icon */}
        <div className="flex space-x-2 items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={community.icon || ""} />
            <AvatarFallback>{community.slug}</AvatarFallback>
          </Avatar>
          <Link href={`/c/${community.slug}`}>
            <p className="text-sm">{capitalizeEachWord(community.name)}</p>
          </Link>
        </div>
        {/* badges for founder or moderator */}
        <div className="flex space-x-2">
          {community.isFounder && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant={"ghost"}>
                  <TelescopeIcon className="h-4 w-4 text-green-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You founded this community!</p>
              </TooltipContent>
            </Tooltip>
          )}
          {community.isModerator && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant={"ghost"}>
                  <GavelIcon className="h-4 w-4 text-yellow-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You currently moderate this community</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
export default CommunityTab;
