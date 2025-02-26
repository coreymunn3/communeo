"use server";
import { createCommunityFormData } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { DEFAULT_COMMUNITY_BANNER, DEFAULT_COMMUNITY_ICON } from "@/CONSTANTS";
import { slugify } from "@/lib/utils";

export async function createCommunity(formData: createCommunityFormData) {
  auth.protect();
  const { userId: clerkUserId } = await auth();
  // get the user's database ID. the clerkUserId above is not what we want to use for the user Id
  const dbUser = await prisma.app_user.findFirst({
    where: {
      clerk_id: clerkUserId!,
    },
  });
  if (!dbUser) {
    throw new Error(
      `Unable to find a database user with this Clerk Id: ${clerkUserId}`
    );
  }
  try {
    // create the community
    const community = await prisma.community.create({
      data: {
        name: formData.name,
        slug: slugify(formData.name),
        description: formData.description,
        icon: formData?.icon || DEFAULT_COMMUNITY_ICON,
        banner: formData?.banner || DEFAULT_COMMUNITY_BANNER,
        rules: formData?.rules,
        flairs: formData?.flairs,
        founder_id: dbUser.id,
        moderator_id: dbUser.id,
      },
    });
    // add the user as a community member for this community
    await prisma.community_member.create({
      data: {
        user_id: dbUser.id,
        community_id: community.id,
      },
    });
    return { success: true, community };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
