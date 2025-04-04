"use server";

import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { postFormData } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { getDbUser } from "./getDbUser";

export async function createPost(
  formData: postFormData,
  communityId: string,
  selectedFlairId?: string
) {
  auth.protect();
  const dbUser = await getDbUser();
  // Sanitize the content
  const sanitizedContent = sanitizeHtml(formData.content);

  // create the post
  try {
    const post = await prisma.post.create({
      data: {
        type: formData.type,
        title: formData.title,
        content: sanitizedContent,
        is_nsfw: formData.is_nsfw,
        is_spoiler: formData.is_spoiler,
        user_id: dbUser.id,
        community_id: communityId,
        ...(selectedFlairId && { flair_id: selectedFlairId }),
      },
    });
    return { success: true, post };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
