"use server";

import { prisma } from "@/lib/prisma";
import { VoteData } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { getDbUser } from "./getDbUser";

/**
 * This function records the user's intended vote on a post or comment.
 * If the use has already voted, a vote of the same value un-votes (deletes the previous vote),
 * and if the vote is a different value, it updates the vote to be the new value
 *
 * The function arguments are a bit weird. You need to pass EITHER a postId OR a commentId, but not both and not neither
 * I'm not sure of a more eloquent way to do this other than brute protecting with error throws at the beginning
 * inshallah I will find a better way one day.
 * @param data VoteData
 * @param postId id of the post, optional (pass if voting on a post)
 * @param commentId id of the comment, optional (pass if voting on a comment)
 */
export async function voteOnPostOrComment(
  data: VoteData,
  postId: string | null,
  commentId: string | null
) {
  auth.protect();
  const dbUser = await getDbUser();
  // protect
  if (!postId && !commentId) {
    throw new Error(
      "Neither Post Id nor Comment Id were provided. At least 1 of those arguments is required"
    );
  }
  if (postId && commentId) {
    throw new Error(
      "Both Post Id and Comment Id were provided. Only 1 of those arguments is allowed at one time"
    );
  }
  try {
    // Check if the user has already voted on this post or comment
    const existingVote = await prisma.vote.findFirst({
      where: {
        user_id: dbUser.id,
        OR: [
          { post_id: postId || undefined },
          { comment_id: commentId || undefined },
        ],
      },
    });
    /**
     * If the user has already voted, there are 2 cases:
     * 1) the user has already upvoted and is upvoting again - in this case delete the previous vote
     * 2) the user has alreayd upvoted and instead would like to downvote - in this case update the vote record to the new value
     */
    if (existingVote) {
      // case 1: if the user tries to vote again using the same button, undo the first vote
      if (existingVote.value === data.voteValue) {
        await prisma.vote.delete({
          where: {
            id: existingVote.id,
          },
        });
        return { success: true, action: "deleted previous vote" };
      }
      // case 2: if the user is trying to vote the opposite way, update the previous vote
      else {
        await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            value: data.voteValue,
          },
        });
        return { success: true, action: "updated previous vote" };
      }
    }
    /**
     * if there is no existing vote, simply create a new record of the vote
     */
    const vote = await prisma.vote.create({
      data: {
        user_id: dbUser.id,
        post_id: postId,
        comment_id: commentId,
        value: data.voteValue,
      },
    });
    return { success: true, action: "created new vote" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
