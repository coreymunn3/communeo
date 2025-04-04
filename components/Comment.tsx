"use client";

import { Comment as CommentType } from "@/lib/types";
import { RichTextContent } from "./ui/rich-text-content";
import { normalizeDate } from "@/lib/utils";
import UserTagAndCreation from "./UserTagAndCreation";
import { useState } from "react";
import CreateComment from "./CreateComment";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageCircleIcon,
  CirclePlusIcon,
  CircleMinusIcon,
  MessageCirclePlusIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import CommentVotes from "./CommentVotes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/actions/deleteComment";

const Comment = ({
  comment,
  allowReply,
}: {
  comment: CommentType;
  allowReply?: boolean;
}) => {
  const queryClient = useQueryClient();
  const normalizeCommentDate = normalizeDate(comment.created_on);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // delete the comment and re-fetch the comments for this post
  const deleteCommentMutation = useMutation({
    mutationKey: ["comment", comment.id, "delete"],
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: async (data) => {
      // invalidate the post comments
      queryClient.invalidateQueries({
        queryKey: ["post", comment.post_id, "comments"],
      });
      // invalidate the user comments
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const handleCommentClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleReply = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowCommentForm((prev) => !prev);
  };

  const handleCancelCreate = () => {
    setShowCommentForm(false);
  };

  const handleCancelEdit = () => {
    // This function is passed to CreateComment as onReset
    // It will only be called after the form is successfully reset
    // (either directly or after the dialog confirmation)
    setIsEditing(false);
    setShowCommentForm(false);
  };

  const handleToggleOpenReplies = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleEditComment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditing((prev) => !prev);
  };

  const handleDeleteComment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  return (
    <div className="flex flex-col space-y-1">
      {/* The Comment Itself */}
      <div
        className={`flex flex-col space-y-2 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors duration-300 cursor-pointer ${
          isEditing && "border border-green-200 dark:border-green-800"
        }`}
        onClick={handleCommentClick}
        role="button"
        tabIndex={isEditing || showCommentForm ? -1 : 0}
        aria-expanded={isOpen}
        aria-label={`Comment by ${comment.author.username}`}
        onKeyDown={(e) => {
          if (
            (e.key === "Enter" || e.key === " ") &&
            !isEditing &&
            !showCommentForm
          ) {
            handleCommentClick();
          }
        }}
      >
        <UserTagAndCreation
          user={comment.author}
          createdDate={normalizeCommentDate}
        />
        {/* comment text - if editing, show the form */}
        {isEditing ? (
          <div onClick={(e) => e.stopPropagation()} className="pl-2">
            <CreateComment
              editing={true}
              editCommentText={comment.text}
              editCommentId={comment.id}
              postId={comment.post_id}
              commentOpen={true}
              formFocused={true}
              onReset={handleCancelEdit}
            />
          </div>
        ) : (
          <div className="pl-6">
            <RichTextContent content={comment.text} className="text-sm" />
          </div>
        )}

        {/* comment controls - view replies, view votes, reply */}
        <div className="flex flex-row pl-6 space-x-2 items-center">
          {/* open replies  */}
          {comment?.replies && comment.replies.length > 0 && (
            <Button
              variant="ghost"
              className="p-0 h-full"
              onClick={handleToggleOpenReplies}
              aria-label={isOpen ? "Collapse replies" : "Expand replies"}
            >
              {isOpen ? (
                <CircleMinusIcon className="h-4 w-4" />
              ) : (
                <CirclePlusIcon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* comment votes */}
          <CommentVotes commentId={comment.id} />
          {/* number of replies */}
          <Button variant={"ghost"}>
            <MessageCircleIcon className="mr-1 h-4 w-4" />
            {(comment?.replies && comment.replies.length) || 0}
          </Button>
          {/* comment reply button */}
          {allowReply && (
            <Button
              variant={"ghost"}
              className="flex items-center"
              onClick={handleReply}
              aria-label="Reply to comment"
            >
              <MessageCirclePlusIcon className="mr-1" />
              <span className="text-sm">Reply</span>
            </Button>
          )}
          {/* edit button */}
          {comment.canEdit && (
            <Button
              variant={"ghost"}
              className="flex items-center"
              onClick={handleEditComment}
              aria-label="Edit comment"
            >
              <PencilIcon className="mr-1" />
              <span className="text-sm">Edit</span>
            </Button>
          )}
          {/* delete button */}
          {comment.canEdit && (
            <Button
              variant={"ghost"}
              className="flex items-center text-destructive hover:text-destructive"
              onClick={handleDeleteComment}
              aria-label="Delete comment"
              disabled={deleteCommentMutation.isPending}
            >
              <Trash2Icon className="mr-1" />
            </Button>
          )}
        </div>
      </div>

      {/* The create comment form */}
      <div className="pl-6 ml-4 pr-2">
        {showCommentForm && (
          <div onClick={(e) => e.stopPropagation()}>
            <CreateComment
              postId={comment.post_id}
              parentCommentId={comment.id}
              commentOpen={true}
              formFocused={true}
              onReset={handleCancelCreate}
            />
          </div>
        )}
      </div>

      {/* Comment Replies */}
      <div className="pl-6 ml-4">
        {comment?.replies && comment.replies.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent
              className={`pl-1 border-l-2 border-slate-200 dark:border-slate-700 
                transition-all duration-300 ease-in-out overflow-hidden 
                data[state=open]:animate-slide-down data-[state=closed]:animate-slide-up`}
            >
              <div className="flex flex-col space-y-1">
                {comment.replies.map((replyComment) => (
                  <Comment
                    key={replyComment.id}
                    comment={replyComment}
                    allowReply={allowReply}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* dialog to confirm delete */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              No, Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteCommentMutation.mutate(comment.id);
                setShowDeleteConfirm(false);
              }}
              disabled={deleteCommentMutation.isPending}
            >
              {deleteCommentMutation.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Comment;
