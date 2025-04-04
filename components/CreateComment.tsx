"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "./ui/rich-text-editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentFormData, commentFormSchema } from "@/lib/types";
import { useState } from "react";
import { Input } from "./ui/input";
import { createComment } from "@/actions/createComment";
import { editComment } from "@/actions/editComment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Base props that are common to both creating and editing
type CreateCommentBaseProps = {
  postId: string;
  commentOpen?: boolean;
  formFocused?: boolean;
  onSubmit?: () => void;
  onReset?: () => void;
};

// Props specific to creating a new comment
type CreateNewCommentProps = CreateCommentBaseProps & {
  editing?: false;
  parentCommentId?: string; // Optional when creating
  editCommentText?: never; // Not used when creating
  editCommentId?: never; // Not used when creating
};

// Props specific to editing an existing comment
type EditCommentProps = CreateCommentBaseProps & {
  editing: true;
  parentCommentId?: string; // Optional when editing
  editCommentText: string; // Required when editing
  editCommentId: string; // Required when editing
};

// Union type that enforces the conditional requirements
type CreateCommentProps = CreateNewCommentProps | EditCommentProps;

const CreateComment = ({
  postId,
  parentCommentId,
  commentOpen: defaultCommentOpen,
  formFocused: defaultFormFocused,
  onSubmit: propOnSubmit,
  onReset,
  editing = false,
  editCommentText,
  editCommentId,
}: CreateCommentProps) => {
  const queryClient = useQueryClient();
  const [commentOpen, setCommentOpen] = useState(defaultCommentOpen || false);
  const [isFormFocused, setIsFormFocused] = useState(
    defaultFormFocused || false
  );
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  // Use the prop directly instead of storing in state to ensure it's always current

  const createCommentMutation = useMutation({
    mutationFn: (formData: commentFormData) =>
      createComment(formData, postId, parentCommentId || null),
    onSuccess: (data) => {
      resetForm(); // Use resetForm directly without checks
      toast.success("Comment has been added");
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });
      queryClient.invalidateQueries({
        queryKey: ["post", postId, "comment-count"],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to add comment";
      toast.error(errorMessage);
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: (formData: commentFormData) =>
      editComment(formData, editCommentId!),
    onSuccess: (data) => {
      resetForm(); // Use resetForm directly without checks
      toast.success("Comment successfully updated");
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to update comment";
      toast.error(errorMessage);
    },
  });

  const createCommentForm = useForm<commentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: editing ? editCommentText : "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: commentFormData) => {
    if (editing) {
      if (!editCommentId) {
        throw new Error("Unable to edit comment, missing the editCommentId");
      }
      editCommentMutation.mutate(formData);
    } else {
      // parentCommentId can be null or undefined for top-level comments
      createCommentMutation.mutate(formData);
    }
    if (propOnSubmit) propOnSubmit();
  };

  // Handle cancel button click - checks for changes and shows dialog if needed
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default actions
    e.preventDefault();
    e.stopPropagation();

    // Only check for unsaved changes if we're in edit mode
    if (editing) {
      const currentValue = createCommentForm.getValues().comment;
      // Compare with the prop directly to ensure we're using the current value
      if (currentValue !== editCommentText) {
        setShowCancelDialog(true);
        return;
      }
    }

    // Otherwise just reset
    resetForm();
  };

  // Reset form without checking for changes (used after submit or when confirmed)
  const resetForm = () => {
    createCommentForm.reset();
    setCommentOpen(false);
    setIsFormFocused(false);
    setShowCancelDialog(false);
    if (onReset) onReset();
  };

  return (
    <div className="pt-2">
      {commentOpen ? (
        <Form {...createCommentForm}>
          <form
            onSubmit={createCommentForm.handleSubmit(onSubmit)}
            className={`border-input ring-1 ring-offset-2 ring-input rounded-lg ${
              isFormFocused ? "ring-2 ring-primary" : ""
            }`}
            onFocus={() => setIsFormFocused(true)}
            onBlur={() => setIsFormFocused(false)}
          >
            <FormField
              control={createCommentForm.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write your comment..."
                    error={!!createCommentForm.formState.errors.comment}
                    className="border-0"
                  />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-1 mt-2">
              <Button
                type="button"
                variant={"secondary"}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" variant={"default"}>
                {editing ? "Edit" : "Comment"}
              </Button>
            </div>
          </form>
          <p className="text-sm text-destructive p-2">
            {createCommentForm.formState.errors.comment?.message}
          </p>
        </Form>
      ) : (
        <Input
          placeholder="Leave a Comment"
          onClick={() => setCommentOpen(true)}
        />
      )}
      {/* Confirmation Dialog */}
      <Dialog
        open={showCancelDialog}
        onOpenChange={(open) => {
          // Only allow the dialog to be closed via the buttons
          if (!open) {
            setShowCancelDialog(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              You have unsaved changes to your comment. Are you sure you want to
              discard them?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Continue editing
            </Button>
            <Button variant="destructive" onClick={resetForm}>
              Discard changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CreateComment;
