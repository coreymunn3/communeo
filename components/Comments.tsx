"use client";

import { Comment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Comments = ({
  initialComments,
  postId,
}: {
  initialComments: Comment[];
  postId: string;
}) => {
  const sortByOptions = ["top", "newest"];
  const [sortBy, setSortBy] = useState<string>(sortByOptions[0]);
  // fetch the comments for this post using the initialComments as placeholder
  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["post", postId, "comments"],
    queryFn: async () => {
      const res = await fetch(`/api/post/${postId}/comment?sort=${sortBy}`);
      return res.json();
    },
    initialData: initialComments,
  });

  return (
    <div className="flex flex-col">
      {comments.map((comment: Comment) => (
        <div>{comment.text}</div>
      ))}
    </div>
  );
};
export default Comments;
