import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/comment/{commentId}/score:
 *   get:
 *     summary: Get score for a comment
 *     description: Returns the total score (upvotes minus downvotes) for a specific comment
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
 *         description: Score for the comment
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
  { params }: { params: { commentId: string } }
) {
  auth.protect();

  try {
    const { commentId } = params;
    const score = await prisma.vote.aggregate({
      _sum: {
        value: true,
      },
      where: {
        comment_id: commentId,
      },
    });
    return NextResponse.json({ score: score._sum.value || 0 }, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching post score in /api/comment/commentId: ",
      error
    );
    return NextResponse.json(
      { error: `Failed to fetch score for ${params.commentId}` },
      { status: 500 }
    );
  }
}
