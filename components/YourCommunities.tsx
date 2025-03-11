"use client";

import { UsersRoundIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect, useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommunityWithSubs } from "@/lib/types";
import { Separator } from "./ui/separator";
import CommunityTab from "./CommunityTab";

const YourCommunities = () => {
  const [open, setOpen] = useState(false);
  const [leaderCommunities, setLeaderCommunities] = useState<
    CommunityWithSubs[]
  >([]);
  const [memberCommunities, setMemberCommunities] = useState<
    CommunityWithSubs[]
  >([]);

  console.log(leaderCommunities, memberCommunities);

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
        <p className="font-semibold tracking-wide">{`Your Communities (${communitiesQuery.data?.length})`}</p>
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
