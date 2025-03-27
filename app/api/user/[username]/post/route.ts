import { getPostsByUserId, getUserFromUsername } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/user/{username}/post:
 *   get:
 *     summary: Retrieve posts created by a user
 *     description: Fetches paginated posts created by a specific user identified by username
 *     tags: [Users, Posts]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user whose posts to retrieve
 *       - in: query
 *         name: cursor
 *         required: false
 *         schema:
 *           type: string
 *         description: Cursor for pagination (ID of the last post in previous page)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts to return per page
 *     responses:
 *       200:
 *         description: List of posts created by the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostsResponse'
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
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 10;

    // first, make sure the username is a real user
    const user = await getUserFromUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: `User with username ${username} not found` },
        { status: 404 }
      );
    }
    // then, get the posts
    const result = await getPostsByUserId(user.id, limit, cursor);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`Error fetching posts for user ${params.username}`, error);
    return NextResponse.json(
      { error: `Failed to fetch posts for user ${params.username}` },
      { status: 500 }
    );
  }
}
