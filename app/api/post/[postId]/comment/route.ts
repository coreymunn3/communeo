import { prisma } from "@/lib/prisma";
import { Comment } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { buildCommentTree } from "@/lib/utils";
import { getComments, getPostById } from "@/lib/queries";

/**
 * @swagger
 * /api/post/{postId}/comment:
 *   get:
 *     summary: Retrieve comments for a post
 *     description: Fetches all comments for a specific post and organizes them into a nested tree structure
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
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [newest, oldest, score]
 *         description: Sort order for comments (not yet implemented)
 *     responses:
 *       200:
 *         description: Nested tree of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentTree'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
  // get the sort param
  const { searchParams } = new URL(request.url);
  // TO DO - implement sorting
  const sort = searchParams.get("sort");

  try {
    const { postId } = params;
    // first make sure the post exists
    const post = await getPostById(postId);
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
