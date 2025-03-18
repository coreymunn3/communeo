"use server";
import { createCommunityFormData } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { DEFAULT_COMMUNITY_BANNER, DEFAULT_COMMUNITY_ICON } from "@/CONSTANTS";
import { slugify } from "@/lib/utils";
import { getDbUser } from "./getDbUser";

export async function createCommunity(formData: createCommunityFormData) {
  auth.protect();
  const dbUser = await getDbUser();
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
        founder_id: dbUser.id,
        moderator_id: dbUser.id,
      },
    });
    // create the flairs for this community
    formData.flairs.forEach(async (flair) => {
      await prisma.flair.create({
        data: {
          title: flair.title,
          color: flair.color,
          community_id: community.id,
        },
      });
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
    throw error;
  }
}
