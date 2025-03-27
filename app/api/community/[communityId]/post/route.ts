import { getCommunityById, getCommunityPosts } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/community/{communityId}/post:
 *   get:
 *     summary: Retrieve posts in a community
 *     description: Fetches paginated posts belonging to a specific community
 *     tags: [Communities, Posts]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the community
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
 *         description: List of posts in the community
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostsResponse'
 *       404:
 *         description: Community not found
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
  { params }: { params: { communityId: string } }
) {
  auth.protect();
  try {
    const { communityId } = params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 10;

    // first make sure the community exists
    const community = getCommunityById(communityId);
    if (!community) {
      return NextResponse.json(
        { error: `Community ${community} not found` },
        { status: 404 }
      );
    }
    // then fetch the posts
    const result = await getCommunityPosts(communityId, limit, cursor);
    // return posts as json response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching posts in /api/community/communityId/post",
      error
    );
    return NextResponse.json(
      { error: `Failed to fetch posts for community ${params.communityId}` },
      { status: 500 }
    );
  }
}
