import { getDbUser } from "@/actions/getDbUser";
import { getFeedPosts } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * This route handler is a multi-purpose route to handle getting posts for various use cases
 * 1) posts to populate the user's feed
 * 2) posts that are search results from a search term
 *
 * By default, with no other parameters, this gets all posts that the logged-in user should see on their feed
 * additional utility is achieved through passing url search params
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  auth.protect();
  // get the url params
  const { searchParams } = new URL(request.url);
  console.log(searchParams);
  const q = searchParams.get("url");
  // get the db user
  const dbUser = await getDbUser();

  try {
    const feedPosts = await getFeedPosts(dbUser.id);
    return NextResponse.json(feedPosts, { status: 200 });
  } catch (error) {
    console.error("Error fetching feed in /api/feed ", error);
    return NextResponse.json(
      { error: `Failed to fetch posts user feed` },
      { status: 500 }
    );
  }
}
