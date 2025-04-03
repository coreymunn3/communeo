import { getDbUser } from "@/actions/getDbUser";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * This route gets the logged in user's information.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getDbUser(true);
    console.log(user);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    // the error means the user is not logged in
    console.error("Unable to get DB user from logged in user in /user");
    return NextResponse.json(
      { error: "Unable to get DB user from logged in user in /user" },
      { status: 500 }
    );
  }
}
