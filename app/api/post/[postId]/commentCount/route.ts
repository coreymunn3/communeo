import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
