"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreatePostForm from "./CreatePostForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Community, CommunityWithSubs } from "@/lib/types";

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreatePostDialog = ({ open, onClose }: CreatePostDialogProps) => {
  const { slug } = useParams();
  const [selectedCommunityId, setSelectedCommunityId] = useState<
    string | undefined
  >(undefined);

  /**
   * When this dialog is open
   * 1) is has a slug - automatically choose community, get community datsa from slug, render form
   * 2) no slug - get a list of communities, user choose community, get community data from slug, render form
   */

  const handleClose = () => {
    onClose();
  };

  // get community from slug after community has been selected
  const selectedCommunityFull = useQuery<Community>({
    queryKey: ["community", selectedCommunityId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/${selectedCommunityId}`
      );
      return res.json();
    },
    enabled: Boolean(selectedCommunityId),
  });
  console.log("community id", selectedCommunityId, "slug", slug);
  console.log("full data", selectedCommunityFull.data);

  // get a list of communities that the user can post in
  const userCommunities = useQuery<CommunityWithSubs[]>({
    queryKey: ["communities", "subscribed"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community`
      );
      return res.json();
    },
  });

  /**
   * This useEffect automatically selects the selectedCommunity to one the user
   * is subscribed to, matching the slug, if it exists
   */
  useEffect(() => {
    if (slug && userCommunities.isSuccess) {
      const automaticallySelectedCommunityId = userCommunities.data.find(
        (community) => community.slug === slug
      );
      if (automaticallySelectedCommunityId) {
        setSelectedCommunityId(automaticallySelectedCommunityId.id);
      }
    }
  }, [userCommunities.data, slug]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-screen overflow-scroll">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col space-y-2">
              {userCommunities.isSuccess && (
                <div className="flex flex-col space-y-2">
                  <p className="mt-4">
                    Please select a community for this post
                  </p>
                  <Select
                    onValueChange={(id) => setSelectedCommunityId(id)}
                    defaultValue={selectedCommunityId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Community" />
                    </SelectTrigger>
                    <SelectContent>
                      {userCommunities.isSuccess &&
                        userCommunities.data.map((community) => (
                          // TO DO Also render the community Icon!
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedCommunityId && selectedCommunityFull.isSuccess && (
                <CreatePostForm
                  redirectOnSuccess={`/c/${selectedCommunityFull.data.slug}`}
                  onSuccess={handleClose}
                  onCancel={handleClose}
                  community={selectedCommunityFull.data}
                />
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
