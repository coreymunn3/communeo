import { getDbUser } from "@/actions/getDbUser";
import { getCommunityById } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { communityId: string } }
) {
  auth.protect();
  try {
    const { communityId } = params;
    const community = await getCommunityById(communityId);
    if (!community) {
      return NextResponse.json(
        { error: `Community with ID ${params.communityId} not found` },
        { status: 404 }
      );
    } else {
      return NextResponse.json(community, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching community by ID", error);
    return NextResponse.json(
      { error: `Failed to fetch community by ID ${params.communityId}` },
      { status: 500 }
    );
  }
}
