"use client";

import { Comment as CommentType, Author } from "@/lib/types";
import { normalizeDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import UserTagAndCreation from "./UserTagAndCreation";
import { useState } from "react";
import CreateComment from "./CreateComment";
import { Button } from "./ui/button";
import { MessageCircleIcon } from "lucide-react";

const Comment = ({ comment }: { comment: CommentType }) => {
  const normalizeCommentDate = normalizeDate(comment.created_on);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

  const handleReply = () => {
    setShowCommentForm(true);
  };

  const cancelReply = () => {
    setShowCommentForm(false);
  };

  return (
    <div className="flex flex-col space-y-1">
      <div>
        <UserTagAndCreation
          user={comment.author}
          createdDate={normalizeCommentDate}
        />
      </div>
      {/* comment text */}
      <p className="text-sm pl-8 py-2">{comment.text}</p>
      {/* comment controls */}
      <div className="flex flex-row pl-8 space-x-2 items-center">
        {/* comment votes */}
        {/* comment reply button */}
        <Button
          variant={"ghost"}
          className="flex items-center"
          onClick={handleReply}
        >
          <MessageCircleIcon className="mr-1" />
          <span className="text-sm">Reply</span>
        </Button>
      </div>
      <div className="py-2 pl-8 ">
        {showCommentForm && (
          <CreateComment
            postId={comment.post_id}
            parentCommentId={comment.id}
            commentOpen={true}
            formFocused={true}
            onReset={cancelReply}
          />
        )}
        {/* replies */}
        <div className="flex flex-col space-y-1">
          {comment?.replies &&
            comment.replies.length > 0 &&
            comment.replies.map((replyComment) => (
              <Comment key={replyComment.id} comment={replyComment} />
            ))}
        </div>
      </div>
    </div>
  );
};
export default Comment;
