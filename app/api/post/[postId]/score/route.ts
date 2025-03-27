import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/post/{postId}/score:
 *   get:
 *     summary: Get score for a post
 *     description: Returns the total score (upvotes minus downvotes) for a specific post
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
 *         description: Score for the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
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
    const score = await prisma.vote.aggregate({
      _sum: {
        value: true,
      },
      where: {
        post_id: postId,
      },
    });
    return NextResponse.json({ score: score._sum.value || 0 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post score in /api/posts/postId: ", error);
    return NextResponse.json(
      { error: `Failed to fetch score for ${params.postId}` },
      { status: 500 }
    );
  }
}
