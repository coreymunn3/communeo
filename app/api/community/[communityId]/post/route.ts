import { getCommunityById, getCommunityPosts } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * This endpoint fetches the posts in a community
 * @param request the NextRequest object
 * @param param1 community ID string
 * @returns
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
    const limit = limitParam ? parseInt(limitParam) : 3;

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
