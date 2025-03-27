import { getDbUser } from "@/actions/getDbUser";
import { getUserCommunities } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/community:
 *   get:
 *     summary: Retrieve user's communities
 *     description: Fetches all communities the authenticated user is a member of, including their role (founder, moderator) and member count
 *     tags: [Communities]
 *     security:
 *       - clerkAuth: []
 *     responses:
 *       200:
 *         description: List of user's communities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommunityResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  auth.protect();
  const dbUser = await getDbUser();
  try {
    const userCommunities = await getUserCommunities(dbUser.id);
    const formatted = userCommunities.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      slug: c.slug,
      icon: c.icon,
      isFounder: c.founder_id === dbUser.id,
      isModerator: c.moderator_id === dbUser.id,
      members: c._count.members,
    }));
    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching list of user communities", error);
    return NextResponse.json(
      { error: `Failed to fetch list of user communities for ${dbUser.id}` },
      { status: 500 }
    );
  }
}
