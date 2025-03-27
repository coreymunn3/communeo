import { getDbUser } from "@/actions/getDbUser";
import { getCommunityById, getUserMembershipInCommunity } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/community/{communityId}/membership:
 *   get:
 *     summary: Check user's membership status in a community
 *     description: Determines if the authenticated user is a member, moderator, or founder of the specified community
 *     tags: [Communities]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the community
 *     responses:
 *       200:
 *         description: User's membership status in the community
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipResponse'
 *       404:
 *         description: Community not found
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
  { params }: { params: { communityId: string } }
) {
  auth.protect();
  try {
    const { communityId } = params;
    const dbUser = await getDbUser();
    // first make sure the community exists
    const community = await getCommunityById(communityId);
    if (!community) {
      return NextResponse.json(
        { error: `Community ${community} not found` },
        { status: 404 }
      );
    }
    // find out if the user is a member of this community
    const membership = await getUserMembershipInCommunity(
      communityId,
      dbUser.id
    );
    const isModerator = community.moderator_id === dbUser.id;
    const isFounder = community.founder_id === dbUser.id;
    if (membership) {
      return NextResponse.json(
        { isMember: true, isModerator, isFounder },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { isMember: false, isModerator, isFounder },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(
      "Error fetching community membership in /api/community/communityId/membership",
      error
    );
    return NextResponse.json(
      {
        error: `Failed to fetch user membership for community ${params.communityId}`,
      },
      { status: 500 }
    );
  }
}
