import {
  getCommentsByUserId,
  getPostsByUserId,
  getUserFromUsername,
} from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get all comments that the user has made
 * @param request NextRequest
 * @param param1 username
 * @returns the user's comments
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  auth.protect();
  try {
    const { username } = params;
    // first, make sure the username is a real user
    const user = await getUserFromUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: `User with username ${username} not found` },
        { status: 404 }
      );
    }
    // then, get the comments
    const userComments = await getCommentsByUserId(user.id);
    return NextResponse.json(userComments, { status: 200 });
  } catch (error) {
    console.error(`Error fetching comments for user ${params.username}`, error);
    return NextResponse.json(
      { error: `Failed to fetch comments for user ${params.username}` },
      { status: 500 }
    );
  }
}
