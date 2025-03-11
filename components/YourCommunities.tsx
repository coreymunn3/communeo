"use client";

import { Plus, UsersRoundIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect, useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommunityWithSubs } from "@/lib/types";
import { Separator } from "./ui/separator";
import CommunityTab from "./CommunityTab";
import { useAppContext } from "@/context/AppContext";

const YourCommunities = () => {
  const [open, setOpen] = useState(false);
  const { createCommunityOpen, setCreateCommunityOpen } = useAppContext();

  const handleOpenCreateCommunityDialog = () => {
    setCreateCommunityOpen(true);
  };

  // state to manage lists of communities where the user is a leader or just member
  const [leaderCommunities, setLeaderCommunities] = useState<
    CommunityWithSubs[]
  >([]);
  const [memberCommunities, setMemberCommunities] = useState<
    CommunityWithSubs[]
  >([]);

  /**
   * Query to fetch list of communities the user has membership to
   */
  const communitiesQuery = useQuery<CommunityWithSubs[]>({
    queryKey: ["communities", "subscribed"],
    queryFn: async () => {
      const res = await fetch(`api/community`);
      return res.json();
    },
  });

  // this useEffect sorts the list of communities into lists based on the user's role
  useEffect(() => {
    if (communitiesQuery.isSuccess) {
      communitiesQuery.data.forEach((community) => {
        if (community.isFounder || community.isModerator) {
          setLeaderCommunities((prev) => {
            const alreadyInList = prev.includes(community);
            if (alreadyInList) return prev;
            return [...prev, community];
          });
        } else {
          setMemberCommunities((prev) => [...prev, community]);
        }
      });
    }
  }, [communitiesQuery.data]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={"ghost"} disabled={communitiesQuery.isLoading}>
          <UsersRoundIcon className="h-4 w-4" />
          {`Your Communities ${
            communitiesQuery.isSuccess
              ? `(${communitiesQuery.data.length})`
              : ""
          }`}
        </Button>
      </SheetTrigger>

      <SheetContent side={"left"}>
        <p className="font-semibold tracking-wide mb-4">{`Your Communities (${communitiesQuery.data?.length})`}</p>
        <div
          className="p-4 text-sm flex space-x-2 items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 cursor-pointer"
          onClick={handleOpenCreateCommunityDialog}
        >
          <Plus className="h-4 w-4" />
          <span>Create Community</span>
        </div>
        {leaderCommunities.length > 0 && (
          <Fragment>
            <Separator className="my-4" />
            <p className="text-sm tracking-wide font-semibold mb-2">
              Founder/Moderator
            </p>
            <div className="flex flex-col space-y-2">
              {leaderCommunities.map((community) => (
                <CommunityTab community={community} />
              ))}
            </div>
          </Fragment>
        )}
        {memberCommunities.length > 0 && (
          <Fragment>
            <Separator className="my-4" />
            <p className="text-sm tracking-wide font-semibold mb-2">Member</p>
            <div className="flex flex-col space-y-2">
              {memberCommunities.map((community) => (
                <CommunityTab community={community} />
              ))}
            </div>
          </Fragment>
        )}
      </SheetContent>
    </Sheet>
  );
};
export default YourCommunities;
