import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const publicUser = await prisma.app_user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!publicUser) {
      return NextResponse.json(
        { error: `User ${userId} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        id: publicUser?.id,
        username: publicUser?.username,
        avatar_url: publicUser?.avatar_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user in /api/user/userId: ", error);
    return NextResponse.json(
      { error: `Failed to fetch user ${params.userId}` },
      { status: 500 }
    );
  }
}
