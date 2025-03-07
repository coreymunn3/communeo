import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * This api route returns the total score (upvotes minus downvotes) for a post
 * @param request
 * @param param1 the commentId
 * @returns
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
