import { getUserFromUsername } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get all posts the user has made
 * @param request NextRequest
 * @param param1 username
 * @returns
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  auth.protect();
  try {
    const { username } = params;
    const user = await getUserFromUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: `User with username ${username} not found` },
        { status: 404 }
      );
    } else {
      return NextResponse.json(user, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching user by username", error);
    return NextResponse.json(
      { error: `Failed to fetch uesr with username ${params.username}` },
      { status: 500 }
    );
  }
}
