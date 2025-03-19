import { getCommunityFromSlug } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
