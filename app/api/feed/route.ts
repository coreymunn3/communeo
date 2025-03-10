import { getDbUser } from "@/actions/getDbUser";
import { prisma } from "@/lib/prisma";
import { getFeedPosts } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  auth.protect();
  const dbUser = await getDbUser();
  try {
    const feedPosts = await getFeedPosts(dbUser.id);
    return NextResponse.json(feedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching feed in /api/feed ", error);
    return NextResponse.json(
      { error: `Failed to fetch posts user feed` },
      { status: 500 }
    );
  }
}
