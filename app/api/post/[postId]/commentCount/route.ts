import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/post/{postId}/commentCount:
 *   get:
 *     summary: Get comment count for a post
 *     description: Returns the total number of comments on a specific post
 *     tags: [Posts, Comments]
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
 *         description: Comment count for the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentCount'
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
  try {
    const { postId } = params;
    const numComments = await prisma.comment.count({
      where: {
        post_id: postId,
      },
    });
    return NextResponse.json({ count: numComments }, { status: 200 });
  } catch (error) {
    console.error(
      "Error getting comment count in /api/post/postId/commentCount"
    );
    return NextResponse.json({
      error: `Failed to fetch comment count for post ${params.postId}`,
    });
  }
}
