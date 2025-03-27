import {
  getCommentsByUserId,
  getPostsByUserId,
  getUserFromUsername,
} from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/user/{username}/comment:
 *   get:
 *     summary: Retrieve comments created by a user
 *     description: Fetches all comments created by a specific user identified by username
 *     tags: [Users, Comments]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user whose comments to retrieve
 *     responses:
 *       200:
 *         description: List of comments created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: User not found
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
  { params }: { params: { username: string } }
) {
  auth.protect();
  try {
    const { username } = params;
    // first, make sure the username is a real user
    const user = await getUserFromUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: `User with username ${username} not found` },
        { status: 404 }
      );
    }
    // then, get the comments
    const userComments = await getCommentsByUserId(user.id);
    return NextResponse.json(userComments, { status: 200 });
  } catch (error) {
    console.error(`Error fetching comments for user ${params.username}`, error);
    return NextResponse.json(
      { error: `Failed to fetch comments for user ${params.username}` },
      { status: 500 }
    );
  }
}
