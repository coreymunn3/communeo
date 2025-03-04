"use client";

import { Comment as CommentType, PublicUser } from "@/lib/types";
import { normalizeDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import UserTagAndCreation from "./UserTagAndCreation";

const Comment = ({ comment }: { comment: CommentType }) => {
  console.log(comment);
  const normalizeCommentDate = normalizeDate(comment.created_on);

  /**
   * Query to fetch the user details to display in the post
   */
  const userQuery = useQuery<PublicUser>({
    queryKey: ["user", comment.user_id],
    queryFn: async () => {
      const res = await fetch(`/api/publicUser/${comment.user_id}`);
      return res.json();
    },
  });

  return (
    <div className="flex flex-col space-y-1">
      <div>
        {userQuery.isSuccess && (
          <UserTagAndCreation
            user={userQuery.data}
            createdDate={normalizeCommentDate}
          />
        )}
      </div>
      {/* comment text */}
      <p className="text-sm pl-10 py-2">{comment.text}</p>
    </div>
  );
};
export default Comment;
