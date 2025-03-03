import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  auth.protect();
  // get the sort param
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort");

  try {
    const { postId } = params;
    // first make sure the post exists
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return NextResponse.json(
        { error: `Post ${postId} not found` },
        { status: 404 }
      );
    }
    // fetch the comments
    const comments = await prisma.comment.findMany({
      where: {
        post_id: postId,
      },
    });
    // return comments
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching comments in /api/post/postId/comment ",
      error
    );
    return NextResponse.json({
      error: `Failed to fetch comments for post ${params.postId}`,
    });
  }
}
