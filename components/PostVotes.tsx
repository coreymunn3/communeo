"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { UserVote, VoteData } from "@/lib/types";
import { voteOnPostOrComment } from "@/actions/voteOnPostOrComment";
import { toast } from "sonner";
import VoteControls from "./VoteControls";

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
  const userVoteQuery = useQuery<UserVote>({
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
    mutationFn: (data: VoteData) => voteOnPostOrComment(data, postId, null),
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
        (old: UserVote) => ({
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
        emphasize={true}
      />
    );
  }
};
export default PostVotes;
