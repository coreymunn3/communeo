import { getDbUser } from "@/actions/getDbUser";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/post/{postId}/userVote:
 *   get:
 *     summary: Get current user's vote on a post
 *     description: Returns the authenticated user's vote (upvote, downvote, or no vote) on a specific post
 *     tags: [Posts]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post
 *     responses:
 *       200:
 *         description: User's vote on the post
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
  { params }: { params: { postId: string } }
) {
  auth.protect();
  const dbUser = await getDbUser();
  try {
    const { postId } = params;
    const userVote = await prisma.vote.findFirst({
      where: {
        post_id: postId,
        user_id: dbUser.id,
      },
    });
    if (userVote) {
      return NextResponse.json(
        {
          user_id: userVote.user_id,
          post_id: userVote.post_id,
          value: userVote.value,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { user_id: dbUser.id, post_id: postId, value: 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error fetching the users vote in api/post/postId/userVote",
      error
    );
    return NextResponse.json(
      { error: `Failed to fetch user votes for post ${params.postId}` },
      { status: 500 }
    );
  }
}
