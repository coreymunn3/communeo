import { prisma } from "@/lib/prisma";
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
    // first make sure the community exists
    const community = getCommunityById(communityId);
    if (!community) {
      return NextResponse.json(
        { error: `Community ${community} not found` },
        { status: 404 }
      );
    }
    // then fetch the posts
    const posts = await getCommunityPosts(communityId);
    // return posts as json response
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts in /api/community/communityId", error);
    return NextResponse.json(
      { error: `Failed to fetch posts for community ${params.communityId}` },
      { status: 500 }
    );
  }
}
