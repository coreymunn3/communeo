import { getUserFromUsername } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    // then get the total score, score for posts, and score for comments
    const [postScore, commentScore] = await Promise.all([
      prisma.vote.aggregate({
        where: {
          post: {
            user_id: user.id,
          },
        },
        _sum: { value: true },
      }),
      prisma.vote.aggregate({
        where: {
          comment: {
            user_id: user.id,
          },
        },
        _sum: { value: true },
      }),
    ]);
    return NextResponse.json(
      {
        totalScore:
          (postScore._sum.value || 0) + (commentScore._sum.value || 0),
        postScore: postScore._sum.value || 0,
        commentScore: commentScore._sum.value || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error fetching the score information in user dashboard",
      error
    );
    return NextResponse.json(
      {
        error: `Failed to fetch user total scores, post score, and comment score for ${params.username}`,
      },
      { status: 500 }
    );
  }
}
