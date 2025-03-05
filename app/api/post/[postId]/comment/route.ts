import { prisma } from "@/lib/prisma";
import { Comment } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const buildCommentTree = (comments: Comment[]) => {
  const commentMap: { [key: string]: Comment } = {};
  const commentTree: Comment[] = [];

  // map comments
  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });
  // assign replies to their parents
  comments.forEach((comment) => {
    // if there's a parent comment, put this comment in that parent's replies
    if (comment.parent_comment_id) {
      const parent = commentMap[comment.parent_comment_id];
      if (parent) {
        parent.replies?.push(commentMap[comment.id]);
      }
    } else {
      // if no parent, it's a top-level comment
      commentTree.push(commentMap[comment.id]);
    }
  });
  return commentTree;
};

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
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
      },
      // TO DO - how to implement sort by top? votes stored in different table. should I create a view?
      // orderBy: {
      // }
    });
    // return comments
    const commentTree = buildCommentTree(comments);
    console.log(buildCommentTree(comments));
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
