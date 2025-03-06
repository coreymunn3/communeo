"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

type CommentCountProps = {
  postId: string;
  commentId?: never;
  emphasize?: boolean;
  action: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

// Retrieves and displays the number of comments on a post
const CommentCount = ({ emphasize, postId, action }: CommentCountProps) => {
  /**
   * Query to get the number of comments on the post
   */
  const commentCount = useQuery<{ count: number }>({
    queryKey: ["post", postId, "comment-count"],
    queryFn: async () => {
      const res = await fetch(`/api/post/${postId}/commentCount`);
      return res.json();
    },
  });
  return (
    <Button
      variant={"ghost"}
      className={`flex ${
        emphasize ? "bg-slate-200 dark:bg-slate-800" : ""
      } rounded-full items-center py-2 px-4`}
      onClick={action}
    >
      <MessageCircleIcon className="mr-1" />
      <span className="text-sm">
        {commentCount.isSuccess ? commentCount.data.count : ""}
      </span>
    </Button>
  );
};
export default CommentCount;
