import { getPostsByUserId, getUserFromUsername } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
    const limit = limitParam ? parseInt(limitParam) : 3;

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
