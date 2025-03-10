import { getDbUser } from "@/actions/getDbUser";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  auth.protect();
  const dbUser = await getDbUser();
  try {
    const feedPosts = await prisma.post.findMany({
      where: {
        community: {
          members: {
            some: {
              user_id: dbUser.id,
            },
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
      orderBy: [
        { created_on: "desc" },
        {
          votes: {
            _count: "desc",
          },
        },
      ],
    });
    return NextResponse.json(feedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching feed in /api/feed ", error);
    return NextResponse.json(
      { error: `Failed to fetch posts user feed` },
      { status: 500 }
    );
  }
}
