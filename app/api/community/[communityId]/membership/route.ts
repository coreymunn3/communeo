import { getDbUser } from "@/actions/getDbUser";
import { getCommunityById, getUserMembershipInCommunity } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { communityId: string } }
) {
  auth.protect();
  try {
    const { communityId } = params;
    const dbUser = await getDbUser();
    // first make sure the community exists
    const community = getCommunityById(communityId);
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
    if (membership) {
      return NextResponse.json({ isMember: true }, { status: 200 });
    } else {
      return NextResponse.json({ isMember: false }, { status: 200 });
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
