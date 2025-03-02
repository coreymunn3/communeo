import { getDbUser } from "@/actions/getDbUser";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  auth.protect();
  const dbUser = await getDbUser();
  try {
    const { postId } = params;
    const userVote = await prisma.vote.findFirst({
      where: {
        post_id: postId,
        user_id: dbUser.id,
      },
    });
    if (userVote) {
      return NextResponse.json(
        {
          user_id: userVote.user_id,
          post_id: userVote.post_id,
          value: userVote.value,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { user_id: dbUser.id, post_id: postId, value: 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error fetching the users vote in api/post/postId/userVote",
      error
    );
    return NextResponse.json(
      { error: `Failed to fetch user votes for post ${params.postId}` },
      { status: 500 }
    );
  }
}
