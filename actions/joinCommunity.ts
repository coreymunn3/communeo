"use server";

import { auth } from "@clerk/nextjs/server";
import { getDbUser } from "./getDbUser";
import { prisma } from "@/lib/prisma";

export async function joinCommunity(communityId: string) {
  auth.protect();
  const dbUser = await getDbUser();
  try {
    const membership = await prisma.community_member.create({
      data: {
        community_id: communityId,
        user_id: dbUser.id,
      },
    });
    return { success: true, membership };
  } catch (error) {
    console.error();
    throw error;
  }
}
