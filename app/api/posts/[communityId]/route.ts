import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { communityId: string } }
) {
  try {
    const { communityId } = params;
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
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
