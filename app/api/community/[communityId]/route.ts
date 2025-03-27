import { getCommunityById } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/community/{communityId}:
 *   get:
 *     summary: Retrieve a community by ID
 *     description: Fetches a specific community's details using its unique identifier
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
 *         description: Community details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Community'
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
