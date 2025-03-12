"use server";

import { auth } from "@clerk/nextjs/server";
import { getDbUser } from "./getDbUser";
import { prisma } from "@/lib/prisma";

export async function leaveCommunity(communityId: string) {
  auth.protect();
  const dbUser = await getDbUser();
  try {
    // attempt to find the community_member record so we can delete it by ID
    const existingMembership = await prisma.community_member.findFirst({
      where: {
        community_id: communityId,
        user_id: dbUser.id,
      },
    });
    // if it exists, delete it
    if (existingMembership) {
      await prisma.community_member.delete({
        where: {
          id: existingMembership.id,
        },
      });
      return { success: true };
    } else {
      throw new Error("User doees not appear to be a member of this community");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
