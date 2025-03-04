"use client";

import { Comment as CommentType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Comment from "./Comment";

const Comments = ({
  initialComments,
  postId,
}: {
  initialComments: CommentType[];
  postId: string;
}) => {
  const sortByOptions = ["top", "newest"];
  const [sortBy, setSortBy] = useState<string>(sortByOptions[0]);
  // fetch the comments for this post using the initialComments as placeholder
  const { data: comments } = useQuery<CommentType[]>({
    queryKey: ["post", postId, "comments"],
    queryFn: async () => {
      const res = await fetch(`/api/post/${postId}/comment?sort=${sortBy}`);
      return res.json();
    },
    initialData: initialComments,
  });

  if (comments.length === 0) {
    return (
      <div className="flex flex-col my-4 justify-center items-center  text-slate-600 dark:text-slate-400">
        <p>There are no comments here yet!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {comments.map((comment: CommentType) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
export default Comments;
