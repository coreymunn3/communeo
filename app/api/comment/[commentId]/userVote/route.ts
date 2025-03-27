import { getDbUser } from "@/actions/getDbUser";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/comment/{commentId}/userVote:
 *   get:
 *     summary: Get current user's vote on a comment
 *     description: Returns the authenticated user's vote (upvote, downvote, or no vote) on a specific comment
 *     tags: [Comments]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the comment
 *     responses:
 *       200:
 *         description: User's vote on the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserVote'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  auth.protect();
  const dbUser = await getDbUser();
  try {
    const { commentId } = params;
    const userVote = await prisma.vote.findFirst({
      where: {
        comment_id: commentId,
        user_id: dbUser.id,
      },
    });
    if (userVote) {
      return NextResponse.json(
        {
          user_id: userVote.user_id,
          comment_id: userVote.comment_id,
          value: userVote.value,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { user_id: dbUser.id, comment_id: commentId, value: 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error fetching the users vote in api/comment/commentId/userVote",
      error
    );
    return NextResponse.json(
      { error: `Failed to fetch user votes for comment ${params.commentId}` },
      { status: 500 }
    );
  }
}
