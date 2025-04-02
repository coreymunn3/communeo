import {
  getCommentsByUserId,
  getPostsByUserId,
  getUserFromUsername,
} from "@/lib/queries";
import { getDbUser } from "@/actions/getDbUser";
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
 *                 allOf:
 *                   - $ref: '#/components/schemas/Comment'
 *                   - type: object
 *                     properties:
 *                       canEdit:
 *                         type: boolean
 *                         description: Whether the current user can edit this comment (true if they are the author)
 *             example:
 *               - id: "comment-id-1"
 *                 content: "This is a comment"
 *                 created_on: "2025-04-01T12:00:00Z"
 *                 post_id: "post-id"
 *                 parent_id: null
 *                 author: { id: "user-id", username: "username", image_url: "url" }
 *                 canEdit: true
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
    // try to get the logged in user. If user is not logged in this will fail, which is ok
    let dbUser = undefined;
    try {
      dbUser = await getDbUser();
    } catch (error) {
      console.log(`Unable to get the database User`);
    }

    // then, get the comments
    const userComments = await getCommentsByUserId(user.id);

    // determine if the user can edit the comment (if they are the author)
    const commentsWithEdit = userComments.map((comment) => ({
      ...comment,
      canEdit: dbUser ? comment.author.id === dbUser.id : false,
    }));

    return NextResponse.json(commentsWithEdit, { status: 200 });
  } catch (error) {
    console.error(`Error fetching comments for user ${params.username}`, error);
    return NextResponse.json(
      { error: `Failed to fetch comments for user ${params.username}` },
      { status: 500 }
    );
  }
}
