import { prisma } from "@/lib/prisma";
import { getUserFromUsername } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";

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
    }
    // get the number of posts created by the user total and the chart data for posts
    const [totalPosts, thisMonthPosts, thisWeekPosts] = await Promise.all([
      prisma.post.aggregate({
        where: {
          user_id: user.id,
        },
        _count: true,
      }),
      prisma.post.aggregate({
        where: {
          user_id: user.id,
          created_on: {
            gte: DateTime.now().startOf("month").toJSDate(),
            lte: DateTime.now().endOf("month").toJSDate(),
          },
        },
        _count: true,
      }),
      prisma.post.aggregate({
        where: {
          user_id: user.id,
          created_on: {
            gte: DateTime.now().startOf("week").toJSDate(),
            lte: DateTime.now().endOf("week").toJSDate(),
          },
        },
        _count: true,
      }),
    ]);
    return NextResponse.json(
      {
        total: totalPosts._count || 0,
        thisMonth: thisMonthPosts._count || 0,
        thisWeek: thisWeekPosts._count || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching the posts for user dashboard", error);
    return NextResponse.json(
      {
        error: `Failed to fetch posts for ${params.username}`,
      },
      { status: 500 }
    );
  }
}
