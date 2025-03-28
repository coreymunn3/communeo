import { getDbUser } from "@/actions/getDbUser";
import {
  getCommunityById,
  getPostsForUser,
  getPostsFromSearchTerm,
  getUserById,
} from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Retrieve posts for user feed or search results
 *     description: |
 *       Multi-purpose endpoint that serves different functions based on query parameters:
 *       1. With no parameters - Returns posts for the user's feed based on their community memberships
 *       2. With 'q' parameter - Returns search results matching the query term
 *       3. With 'q' and 'communityId' parameters - Returns search results within a specific community
 *     tags: [Posts]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term to filter posts
 *       - in: query
 *         name: communityId
 *         required: false
 *         schema:
 *           type: string
 *         description: Community ID to limit search results to a specific community
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
 *         description: List of posts (either from feed or search results)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostsResponse'
 *       404:
 *         description: Community not found (when communityId is provided)
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
export async function GET(request: NextRequest) {
  auth.protect();
  // get the url params
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const userId = searchParams.get("userId");
  const communityId = searchParams.get("communityId");
  const cursor = searchParams.get("cursor") || undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam) : 10;

  // get the db user
  const dbUser = await getDbUser();

  /**
   * If a query is passed, we only want to return posts matching that query
   * If a community OR userId is also passed, we want to limit posts to those terms as well
   */
  if (q) {
    if (communityId) {
      try {
        // make sure community exists
        const community = await getCommunityById(communityId);
        if (!community) {
          return NextResponse.json(
            { error: `community ${communityId} not found` },
            { status: 404 }
          );
        }
        // get posts
        const result = await getPostsFromSearchTerm(
          q,
          communityId,
          undefined,
          limit,
          cursor
        );
        return NextResponse.json(result, { status: 200 });
      } catch (error) {
        console.error(
          `Error fetching posts from search term in /api/post?q=${q}&communityId=${communityId}`,
          error
        );
        return NextResponse.json(
          {
            error: `Failed to fetch posts from search term ${q} in community ${communityId}`,
          },
          { status: 500 }
        );
      }
    }
    if (userId) {
      try {
        // make sure the user exists
        const user = await getUserById(userId);
        if (!user) {
          return NextResponse.json(
            { error: `user ${userId} not found` },
            { status: 404 }
          );
        }
        // get posts
        const result = await getPostsFromSearchTerm(
          q,
          undefined,
          userId,
          limit,
          cursor
        );
        return NextResponse.json(result, { status: 200 });
      } catch (error) {
        console.error(
          `Error fetching posts from search term in /api/post?q=${q}&userId=${userId}`,
          error
        );
        return NextResponse.json(
          {
            error: `Failed to fetch posts from search term ${q} in user ${userId}`,
          },
          { status: 500 }
        );
      }
    } else {
      try {
        const result = await getPostsFromSearchTerm(
          q,
          undefined,
          undefined,
          limit,
          cursor
        );
        return NextResponse.json(result, { status: 200 });
      } catch (error) {
        console.error(
          `Error fetching posts from search term in /api/post?q=${q}`,
          error
        );
        return NextResponse.json(
          { error: `Failed to fetch posts from search term ${q}` },
          { status: 500 }
        );
      }
    }
  }

  /**
   * Otherwise, get all posts relevant to the user's subscriptions
   */
  try {
    const result = await getPostsForUser(dbUser.id, limit, cursor);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts in /api/post ", error);
    return NextResponse.json(
      { error: `Failed to fetch posts user feed` },
      { status: 500 }
    );
  }
}
