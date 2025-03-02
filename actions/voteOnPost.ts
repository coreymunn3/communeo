"use server";

import { prisma } from "@/lib/prisma";
import { VoteData } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { getDbUser } from "./getDbUser";

/**
 * This function is a bit weird. You need to pass EITHER a postId OR a commentId, but not both and not neither
 * I'm not sure of a more eloquent way to do this other than brute protecting with error throws at the beginning
 * inshallah I will find a better way one day.
 * @param data VoteData
 * @param postId id of the post, optional (pass if voting on a post)
 * @param commentId id of the comment, optional (pass if voting on a comment)
 */
export async function voteOnPost(
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
    console.log("existing", existingVote);
    if (existingVote) {
      throw new Error("User has already voted on this post or comment");
    }
    // record the vote
    const vote = await prisma.vote.create({
      data: {
        user_id: dbUser.id,
        post_id: postId,
        comment_id: commentId,
        value: data.voteValue,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
