"use client";

import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";

export const JoinButton = ({ communityId }: { communityId: string }) => {
  const membership = useQuery<{ isMember: boolean }>({
    queryKey: ["community", communityId, "membership"],
    queryFn: async () => {
      const res = await fetch(`/api/community/${communityId}/membership`);
      return res.json();
    },
  });

  return (
    <Button
      variant={"community"}
      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      {membership.isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
      {membership.isSuccess && membership.data.isMember ? "Joined" : "Join"}
    </Button>
  );
};
