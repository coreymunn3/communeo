"use server";

import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { commentFormData } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { getDbUser } from "./getDbUser";

export async function editComment(
  formData: commentFormData,
  commentId: string
) {
  auth.protect();
  const dbUser = await getDbUser();
  // get the comment to make sure it exists
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  // if there's no comment for this ID, throw and error
  if (!comment) {
    throw new Error(
      `Comment with id ${commentId} not found - unable to edit this comment`
    );
  }
  // only the author of the comment is allowed to edit
  if (comment.user_id !== dbUser.id) {
    throw new Error(
      `You are not the author of this comment - not allowed to edit`
    );
  }
  // Sanitize the comment text
  const sanitizedText = sanitizeHtml(formData.comment);

  // update the comment
  await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      text: sanitizedText,
    },
  });
  return { success: true };
}
