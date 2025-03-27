import { prisma } from "@/lib/prisma";
import { getUserFromUsername } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";

/**
 * @swagger
 * /api/user/{username}/dashboard/comments:
 *   get:
 *     summary: Get comment activity metrics for user dashboard
 *     description: |
 *       Retrieves comment activity metrics for a user's dashboard, including:
 *       - Total number of comments created by the user
 *       - Number of comments created this month
 *       - Number of comments created this week
 *     tags: [Users, Comments]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *     responses:
 *       200:
 *         description: Comment activity metrics for the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDashboardComments'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
