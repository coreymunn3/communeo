"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { UserVote, VoteData } from "@/lib/types";
import { voteOnPostOrComment } from "@/actions/voteOnPostOrComment";
import { toast } from "sonner";
import VoteControls from "./VoteControls";

const CommentVotes = ({ commentId }: { commentId: string }) => {
  const queryClient = useQueryClient();

  /**
   * Query to fetch the total votes for the comment
   */
  const totalVotesQuery = useQuery<{ score: number }>({
    queryKey: ["comment", commentId, "score"],
    queryFn: async () => {
      const res = await fetch(`/api/comment/${commentId}/score`);
      return res.json();
    },
  });

  /**
   * Query to fetch the user's vote on this post
   */
  const userVoteQuery = useQuery<UserVote>({
    queryKey: ["comment", commentId, "user-vote"],
    queryFn: async () => {
      const res = await fetch(`/api/comment/${commentId}/userVote`);
      return res.json();
    },
  });

  /**
   * This function handles the complexity of optimistically updating the score of the thing the user is voting on
   * depending on the current vote and the intended vote, the optimistic change could be any numnber of outcomes
   * @param currentUserVote the current vote value the user has made
   * @param voteValue the intended next vote the user wants to make
   * @returns void; sets query data
   */
  const optimisticallyUpdateScore = (
    currentUserVote: number,
    voteValue: number
  ) => {
    // case 1: user has upvoted, pressing upvote again to undo: 1 => 0
    if (currentUserVote > 0 && voteValue > 0) {
      return queryClient.setQueryData(
        ["comment", commentId, "score"],
        (old: { score: number }) => ({
          score: old.score - voteValue,
        })
      );
    }
    // case 2: user has upvoted, wants to downvote instead 1 => -1
    if (currentUserVote > 0 && voteValue < 0) {
      return queryClient.setQueryData(
        ["comment", commentId, "score"],
        (old: { score: number }) => ({
          score: old.score + 2 * voteValue,
        })
      );
    }
    // case 3: user has downvoted, pressing downvote again to undo: -1 => 0
    if (currentUserVote < 0 && voteValue < 0) {
      return queryClient.setQueryData(
        ["comment", commentId, "score"],
        (old: { score: number }) => ({
          score: old.score - voteValue,
        })
      );
    }
    // case 4: user has downvoted, wants to upvote instead -1 => 1
    if (currentUserVote < 0 && voteValue > 0) {
      return queryClient.setQueryData(
        ["comment", commentId, "score"],
        (old: { score: number }) => ({
          score: old.score + 2 * voteValue,
        })
      );
    }
    // case 5: user vote is 0 (has not yet voted)
    return queryClient.setQueryData(
      ["comment", commentId, "score"],
      (old: { score: number }) => ({
        score: old.score + voteValue,
      })
    );
  };

  /**
   * Mutation to vote on the post, up or down
   * when mutation function is fired, we optimistically update the vote totals
   */
  const voteMutation = useMutation({
    mutationFn: (data: VoteData) => voteOnPostOrComment(data, null, commentId),
    onMutate: async (data) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["comment", commentId, "score"],
      });
      await queryClient.cancelQueries({
        queryKey: ["comment", commentId, "user-vote"],
      });
      // Snapshot the previous value
      const previousScore = queryClient.getQueryData([
        "comment",
        commentId,
        "score",
      ]);
      const previousUserVote = queryClient.getQueryData([
        "comment",
        commentId,
        "user-vote",
      ]);
      // Optimistically update the score
      optimisticallyUpdateScore(userVoteQuery.data?.value || 0, data.voteValue);
      // Return the context for rollback on error
      return { previousScore, previousUserVote };
    },
    onSuccess: (data) => {
      // re fetch the score now
      queryClient.invalidateQueries({ queryKey: ["comment", commentId] });
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update on error
      queryClient.setQueryData(
        ["comment", commentId, "score"],
        context?.previousScore
      );
      queryClient.setQueryData(
        ["comment", commentId, "user-vote"],
        context?.previousUserVote
      );
      console.error("vote failed", error);
      toast.error(error.message);
    },
  });

  const handleUpvote = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      voteMutation.mutate({ voteValue: 1 });
    },
    [voteMutation]
  );

  const handleDownvote = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      voteMutation.mutate({ voteValue: -1 });
    },
    [voteMutation]
  );

  if (userVoteQuery.isSuccess && totalVotesQuery.isSuccess) {
    return (
      <VoteControls
        userVoteValue={userVoteQuery.data.value}
        totalVoteValue={totalVotesQuery.data.score}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
      />
    );
  }
};
export default CommentVotes;
