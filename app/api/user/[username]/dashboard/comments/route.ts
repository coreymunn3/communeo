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
    // get the number of comments created by the user total and the chart data for posts
    const [totalComments, thisMonthComments, thisWeekComments] =
      await Promise.all([
        prisma.comment.aggregate({
          where: {
            user_id: user.id,
          },
          _count: true,
        }),
        prisma.comment.aggregate({
          where: {
            user_id: user.id,
            created_on: {
              gte: DateTime.now().startOf("month").toJSDate(),
              lte: DateTime.now().endOf("month").toJSDate(),
            },
          },
          _count: true,
        }),
        prisma.comment.aggregate({
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
        total: totalComments._count || 0,
        thisMonth: thisMonthComments._count || 0,
        thisWeek: thisWeekComments._count || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching the comments for user dashboard", error);
    return NextResponse.json(
      {
        error: `Failed to fetch comment activity for ${params.username}`,
      },
      { status: 500 }
    );
  }
}
