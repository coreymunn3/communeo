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
    // Get the number of community memberships for this user
    const memberships = await prisma.community_member.aggregate({
      where: {
        user_id: user.id,
      },
      _count: true,
    });

    // Get all communities where the user has posts or comments
    const communitiesWithActivity = await prisma.community.findMany({
      where: {
        OR: [
          {
            posts: {
              some: {
                user_id: user.id,
              },
            },
          },
          {
            posts: {
              some: {
                comments: {
                  some: {
                    user_id: user.id,
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // For each community, calculate post scores and comment scores
    const communityScores = await Promise.all(
      communitiesWithActivity.map(async (community) => {
        // Get post scores for this community
        const postScoreResult = await prisma.vote.aggregate({
          where: {
            post: {
              user_id: user.id,
              community_id: community.id,
            },
          },
          _sum: { value: true },
        });

        // Get comment scores for this community
        const commentScoreResult = await prisma.vote.aggregate({
          where: {
            comment: {
              user_id: user.id,
              post: {
                community_id: community.id,
              },
            },
          },
          _sum: { value: true },
        });

        const postScore = postScoreResult._sum.value || 0;
        const commentScore = commentScoreResult._sum.value || 0;
        const totalScore = postScore + commentScore;

        return {
          communityName: community.name,
          communitySlug: community.slug,
          postScore,
          commentScore,
          totalScore,
        };
      })
    );

    // Filter out communities with no score and sort by total score descending
    const filteredAndSortedCommunityScores = communityScores
      .filter((community) => community.totalScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json(
      {
        memberships: memberships._count,
        scores: filteredAndSortedCommunityScores,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error fetching the community scores for user dashboard",
      error
    );
    return NextResponse.json(
      {
        error: `Failed to fetch community scores for ${params.username}`,
      },
      { status: 500 }
    );
  }
}
