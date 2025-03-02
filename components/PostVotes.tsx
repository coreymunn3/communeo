"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useCallback } from "react";
import { CircleArrowDownIcon, CircleArrowUpIcon } from "lucide-react";
import { UserPostVote, VoteData } from "@/lib/types";
import { voteOnPost } from "@/actions/voteOnPost";
import { toast } from "sonner";
import UpvoteDownvoteButton from "./UpvoteDownvoteButton";

const PostVotes = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();

  /**
   * Query to fetch the total votes for the post
   */
  const totalVotesQuery = useQuery<{ score: number }>({
    queryKey: ["post", postId, "score"],
    queryFn: async () => {
      const res = await fetch(`/api/post/${postId}/score`);
      return res.json();
    },
  });

  /**
   * Query to fetch the user's vote on this post
   */
  const userVoteQuery = useQuery<UserPostVote>({
    queryKey: ["post", postId, "user-vote"],
    queryFn: async () => {
      const res = await fetch(`/api/post/${postId}/userVote`);
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
      await queryClient.cancelQueries({ queryKey: ["post", postId, "score"] });
      await queryClient.cancelQueries({
        queryKey: ["post", postId, "user-vote"],
      });
      // Snapshot the previous value
      const previousScore = queryClient.getQueryData(["post", postId, "score"]);
      const previousUserVote = queryClient.getQueryData([
        "post",
        postId,
        "user-vote",
      ]);
      // Optimistically update the score
      queryClient.setQueryData(
        ["post", postId, "score"],
        (old: { score: number }) => ({
          score: old.score + data.voteValue,
        })
      );
      // Optimistically update the user-vote
      queryClient.setQueryData(
        ["post", postId, "user-vote"],
        (old: UserPostVote) => ({
          ...old,
          value: data.voteValue,
        })
      );
      // Return the context for rollback on error
      return { previousScore, previousUserVote };
    },
    onSuccess: (data) => {
      // re fetch the score now
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update on error
      queryClient.setQueryData(
        ["post", postId, "score"],
        context?.previousScore
      );
      queryClient.setQueryData(
        ["post", postId, "user-vote"],
        context?.previousUserVote
      );
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
    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-full items-center">
      {userVoteQuery.isSuccess && (
        <UpvoteDownvoteButton
          type="upvote"
          isActive={userVoteQuery.data.value > 0}
          onClick={handleUpvote}
        />
      )}
      <span className="mx-1">
        {totalVotesQuery.isSuccess && totalVotesQuery.data.score}
      </span>
      {userVoteQuery.isSuccess && (
        <UpvoteDownvoteButton
          type="downvote"
          isActive={userVoteQuery.data.value < 0}
          onClick={handleDownvote}
        />
      )}
    </div>
  );
};
export default PostVotes;
