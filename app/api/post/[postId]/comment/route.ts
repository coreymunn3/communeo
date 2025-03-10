import { prisma } from "@/lib/prisma";
import { Comment } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { buildCommentTree } from "@/lib/utils";
import { getComments, getPost } from "@/lib/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  auth.protect();
  // get the sort param
  const { searchParams } = new URL(request.url);
  // TO DO - implement sorting
  const sort = searchParams.get("sort");

  try {
    const { postId } = params;
    // first make sure the post exists
    const post = await getPost(postId);
    if (!post) {
      return NextResponse.json(
        { error: `Post ${postId} not found` },
        { status: 404 }
      );
    }
    // fetch the comments
    const comments = await getComments(postId);
    // return comments
    const commentTree = buildCommentTree(comments);
    return NextResponse.json(commentTree, { status: 200 });
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
