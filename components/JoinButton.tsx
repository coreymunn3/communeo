"use client";

import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { leaveCommunity } from "@/actions/leaveCommunity";
import { joinCommunity } from "@/actions/joinCommunity";
import { toast } from "sonner";
import { Community } from "@/lib/types";
import { capitalizeEachWord } from "@/lib/utils";

export const JoinButton = ({ community }: { community: Community }) => {
  const queryClient = useQueryClient();
  const membership = useQuery<{ isMember: boolean }>({
    queryKey: ["community", community.id, "membership"],
    queryFn: async () => {
      const res = await fetch(`/api/community/${community.id}/membership`);
      return res.json();
    },
  });

  const handleToggleMembership = async () => {
    if (membership.data?.isMember) {
      await leaveCommunity(community.id);
      queryClient.invalidateQueries({
        queryKey: ["community", community.id, "membership"],
      });
    } else {
      await joinCommunity(community.id);
      queryClient.invalidateQueries({
        queryKey: ["community", community.id, "membership"],
      });
      toast.success(`Welcome to ${capitalizeEachWord(community.name)}`);
    }
  };

  return (
    <Button
      variant={"community"}
      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
      onClick={handleToggleMembership}
    >
      {membership.isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
      {membership.isSuccess && membership.data.isMember ? "Joined" : "Join"}
    </Button>
  );
};
