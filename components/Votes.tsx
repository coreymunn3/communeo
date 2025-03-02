"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useCallback } from "react";
import { CircleArrowDownIcon, CircleArrowUpIcon } from "lucide-react";
import { VoteData } from "@/lib/types";
import { voteOnPost } from "@/actions/voteOnPost";
import { toast } from "sonner";

const Votes = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();

  /**
   * Query to fetch the total votes for the post
   */
  const votesQuery = useQuery<{ score: number }>({
    queryKey: [postId, "score"],
    queryFn: async () => {
      const res = await fetch(`/api/post/${postId}/score`);
      return res.json();
    },
  });

  /**
   * Mutation to vote on the post, up or down
   * when mutation function is fired, we optimistically update the vote totals
   */
  const voteMutation = useMutation({
    mutationFn: (data: VoteData) => voteOnPost(data, postId, null),
    onMutate: async (data) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [postId, "score"] });
      // Snapshot the previous value
      const previousScore = queryClient.getQueryData([postId, "score"]);
      // Optimistically update the score
      queryClient.setQueryData([postId, "score"], (old: { score: number }) => ({
        score: old.score + data.voteValue,
      }));
      // Return the context for rollback on error
      return { previousScore };
    },
    onSuccess: (data) => {
      // re fetch the score now
      queryClient.invalidateQueries({ queryKey: [postId, "score"] });
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update on error
      queryClient.setQueryData([postId, "score"], context?.previousScore);
      console.error("vote failed", error);
      toast.error(error.message);
    },
  });

  const handleUpvote = useCallback(() => {
    voteMutation.mutate({ voteValue: 1 });
  }, [voteMutation]);

  const handleDownvote = useCallback(() => {
    voteMutation.mutate({ voteValue: -1 });
  }, [voteMutation]);

  return (
    <div className="flex bg-slate-100 rounded-full items-center">
      <Button variant={"ghost"} className="p-2" onClick={handleUpvote}>
        <CircleArrowUpIcon className="!w-6 !h-6" />
      </Button>
      <span className="mx-1">
        {votesQuery.isSuccess && votesQuery.data.score}
      </span>
      <Button variant={"ghost"} className="p-2" onClick={handleDownvote}>
        <CircleArrowDownIcon className="!w-6 !h-6" />
      </Button>
    </div>
  );
};
export default Votes;
