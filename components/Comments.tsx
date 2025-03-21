"use client";

import { Comment as CommentType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Comment from "./Comment";

interface CommentsProps {
  initialComments: CommentType[];
  allowReply?: boolean;
  query: {
    queryKey: string[];
    url: string;
  };
}

const Comments = ({
  initialComments,
  allowReply,
  query: { queryKey, url },
}: CommentsProps) => {
  // fetch the comments for this post using the initialComments as placeholder
  const { data: comments } = useQuery<CommentType[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(url);
      return res.json();
    },
    initialData: initialComments,
  });

  if (comments.length === 0) {
    return (
      <div className="flex flex-col my-4 justify-center items-center  text-slate-600 dark:text-slate-400">
        <p>There are no comments here yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {comments.map((comment: CommentType) => (
        <Comment key={comment.id} comment={comment} allowReply={allowReply} />
      ))}
    </div>
  );
};
export default Comments;
