"use server";

import { prisma } from "@/lib/prisma";
import { postFormData } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

export async function createPost(formData: postFormData, communityId: string) {
  auth.protect();
  // get the user
  const { userId: clerkUserId } = await auth();
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
  // create the post
  try {
    const post = await prisma.post.create({
      data: {
        type: formData.type,
        title: formData.title,
        content: formData.content,
        is_nsfw: formData.is_nsfw,
        is_spoiler: formData.is_spoiler,
        user_id: dbUser.id,
        community_id: communityId,
      },
    });
    return { success: true, post };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
