"use server";

import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { commentFormData, postFormData } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { getDbUser } from "./getDbUser";

export async function createComment(
  formData: commentFormData,
  postId: string,
  parentCommentId: string | null
) {
  auth.protect();
  const dbUser = await getDbUser();
  // Sanitize the comment text
  const sanitizedText = sanitizeHtml(formData.comment);

  // create the comment
  try {
    const comment = await prisma.comment.create({
      data: {
        text: sanitizedText,
        user_id: dbUser.id,
        post_id: postId,
        parent_comment_id: parentCommentId,
      },
    });
    return { success: true, comment };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
