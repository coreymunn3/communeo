import { getCommunityFromSlug } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/community/slug/{slug}:
 *   get:
 *     summary: Retrieve a community by slug
 *     description: Fetches a specific community's details using its URL-friendly slug identifier
 *     tags: [Communities]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL-friendly slug of the community
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
  { params }: { params: { slug: string } }
) {
  auth.protect();
  try {
    const { slug } = params;
    const community = await getCommunityFromSlug(slug);
    if (!community) {
      return NextResponse.json(
        { error: `Community with slug ${params.slug} not found` },
        { status: 404 }
      );
    } else {
      return NextResponse.json(community, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching community by slug", error);
    return NextResponse.json(
      { error: `Failed to fetch community by slug ${params.slug}` },
      { status: 500 }
    );
  }
}
