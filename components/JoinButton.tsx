"use client";

import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { leaveCommunity } from "@/actions/leaveCommunity";
import { joinCommunity } from "@/actions/joinCommunity";
import { toast } from "sonner";
import { Community, CommunityMembership } from "@/lib/types";
import { capitalizeEachWord } from "@/lib/utils";
import { Fragment, useState } from "react";

interface DialogContent {
  title: string;
  description: string;
  footer: React.ReactNode;
}

export const JoinButton = ({ community }: { community: Community }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContent>();

  // query to get the user's membership status and if they are moderator/founder
  const membership = useQuery<CommunityMembership>({
    queryKey: ["community", community.id, "membership"],
    queryFn: async () => {
      const res = await fetch(`/api/community/${community.id}/membership`);
      return res.json();
    },
  });

  const createDialogContent = (content: DialogContent) => {
    setDialogContent(content);
    setOpen(true);
  };

  const handleJoin = async () => {
    await joinCommunity(community.id);
    queryClient.invalidateQueries({
      queryKey: ["community", community.id, "membership"],
    });
    return toast.success(`Welcome to ${capitalizeEachWord(community.name)}`);
  };

  const handleLeave = async () => {
    await leaveCommunity(community.id);
    queryClient.invalidateQueries({
      queryKey: ["community", community.id, "membership"],
    });
    return;
  };

  /**
   * If the user is a member, they leave the community by removing their membership status
   * If the user is not a memeber, they join the community
   * If the user is a Moderator, a dialog opens prompting the user to re-assign moderation to another member before they are allowed to leave
   * because all communities must have a moderator
   * If the user is a Founder, they are asked are you sure?
   */
  const handleToggleMembership = async () => {
    if (membership.data?.isModerator) {
      return createDialogContent({
        title: "Please re-assign moderation before leaving",
        description:
          "You are currently the moderator of this community. It is Communeo's policy for each community to have a moderator, so before leaving, re-assign moderation duties to another user/",
        // TO DO - build the moderation center and moderator controls
        footer: <Button>Visit Moderation Center</Button>,
      });
    }
    if (membership.data?.isFounder) {
      return createDialogContent({
        title: "Are you sure?",
        description:
          "You are the original founding member of this community. Are you sure you wish to leave?",
        footer: (
          <div className="flex items-center justify-center">
            <Button onClick={() => setOpen(false)} variant={"outline"}>
              No, Cancel
            </Button>
            <Button onClick={handleLeave}>Yes, I'm sure</Button>
          </div>
        ),
      });
    }
    if (membership.data?.isMember) {
      await handleLeave();
    } else {
      await handleJoin();
    }
  };

  if (membership.isSuccess) {
    return (
      <Fragment>
        <Button
          variant={"community"}
          className={` border-none ${
            membership.data.isMember
              ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              : "bg-primary/70 hover:bg-primary/80"
          } `}
          onClick={handleToggleMembership}
        >
          {membership.isLoading && (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          )}
          {membership.data.isMember ? "Joined" : "Join"}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          {dialogContent?.title &&
            dialogContent?.description &&
            dialogContent?.footer && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dialogContent.title}</DialogTitle>
                  <DialogDescription>
                    {dialogContent.description}
                  </DialogDescription>
                  <DialogFooter>{dialogContent.footer}</DialogFooter>
                </DialogHeader>
              </DialogContent>
            )}
        </Dialog>
      </Fragment>
    );
  }
};
