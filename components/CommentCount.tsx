"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircleIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

type BaseProps = {
  emphasize?: boolean;
  action: () => void;
};

type CommentCountProps =
  | ({
      type: "post";
      postId: string;
      commentId?: never;
    } & BaseProps)
  | ({
      type: "comment";
      postId?: never;
      commentId: string;
    } & BaseProps);

// Retrieves and displays the number of comments on a post or comment
const CommentCount = ({
  type,
  emphasize,
  postId,
  commentId,
  action,
}: CommentCountProps) => {
  const typeId = type === "post" ? postId : commentId;
  /**
   * Query to get the number of comments on the post OR comment
   */
  const commentCount = useQuery<{ count: number }>({
    queryKey: ["post", typeId, "comment-count"],
    queryFn: async () => {
      const res = await fetch(`/api/post/${typeId}/commentCount`);
      return res.json();
    },
  });
  return (
    <Button
      variant={"ghost"}
      className={`flex ${
        emphasize ? "bg-slate-100 dark:bg-slate-900" : ""
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
