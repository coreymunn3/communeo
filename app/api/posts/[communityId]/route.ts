import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { communityId: string } }
) {
  auth.protect();
  try {
    const { communityId } = params;
    // first make sure the community exists
    const community = await prisma.community.findUnique({
      where: {
        id: communityId,
      },
    });
    if (!community) {
      return NextResponse.json(
        { error: `Community ${community} not found` },
        { status: 404 }
      );
    }
    // then fetch the posts
    const posts = await prisma.post.findMany({
      where: {
        community_id: communityId,
      },
      orderBy: {
        created_on: "desc",
      },
    });
    // return posts as json response
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts in /api/posts/communityId: ", error);
    return NextResponse.json(
      { error: `Failed to fetch posts for ${params.communityId}` },
      { status: 500 }
    );
  }
}
