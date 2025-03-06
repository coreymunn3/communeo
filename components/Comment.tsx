"use client";

import { Comment as CommentType } from "@/lib/types";
import { normalizeDate } from "@/lib/utils";
import UserTagAndCreation from "./UserTagAndCreation";
import { useState } from "react";
import CreateComment from "./CreateComment";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  MessageCircleIcon,
  CirclePlusIcon,
  CircleMinusIcon,
} from "lucide-react";

const Comment = ({ comment }: { comment: CommentType }) => {
  const normalizeCommentDate = normalizeDate(comment.created_on);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

  const handleCommentClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleReply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowCommentForm((prev) => !prev);
  };

  const cancelReply = () => {
    setShowCommentForm(false);
  };

  const handleToggleOpenReplies = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col space-y-1">
      {/* The Comment Itself */}
      <div
        className="flex flex-col space-y-2 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors duration-300 cursor-pointer"
        onClick={handleCommentClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCommentClick();
          }
        }}
      >
        <UserTagAndCreation
          user={comment.author}
          createdDate={normalizeCommentDate}
        />
        {/* comment text */}
        <p className="text-sm pl-6">{comment.text}</p>
        {/* comment controls - view replies, view votes, reply */}
        <div className="flex flex-row pl-6 space-x-2 items-center">
          {/* open replies  */}
          {comment?.replies && comment.replies.length > 0 && (
            <Button
              variant="ghost"
              className="p-0 h-full"
              onClick={handleToggleOpenReplies}
            >
              {isOpen ? (
                <CircleMinusIcon className="h-4 w-4" />
              ) : (
                <CirclePlusIcon className="h-4 w-4" />
              )}
            </Button>
          )}

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
      </div>

      {/* The create comment form */}
      <div className="pl-6 ml-4">
        {showCommentForm && (
          <CreateComment
            postId={comment.post_id}
            parentCommentId={comment.id}
            commentOpen={true}
            formFocused={true}
            onReset={cancelReply}
          />
        )}
      </div>

      {/* Comment Replies */}
      <div className="pl-6 ml-4">
        {comment?.replies && comment.replies.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent className="pl-1 border-l-2 border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out overflow-hidden data[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
              <div className="flex flex-col space-y-1">
                {comment.replies.map((replyComment) => (
                  <Comment key={replyComment.id} comment={replyComment} />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};
export default Comment;
