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
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentFormData, commentFormSchema } from "@/lib/types";
import { useState } from "react";
import { Input } from "./ui/input";
import { createComment } from "@/actions/createComment";

const CreateComment = ({
  postId,
  parentCommentId,
  commentOpen: defaultCommentOpen,
  formFocused: defaultFormFocused,
  onSubmit: propOnSubmit,
  onReset,
}: {
  postId: string;
  parentCommentId: string | null;
  commentOpen?: boolean;
  formFocused?: boolean;
  onSubmit?: () => void;
  onReset?: () => void;
}) => {
  const queryClient = useQueryClient();
  const [commentOpen, setCommentOpen] = useState(defaultCommentOpen || false);
  const [isFormFocused, setIsFormFocused] = useState(
    defaultFormFocused || false
  );

  const createCommentMutation = useMutation({
    mutationFn: (formData: commentFormData) =>
      createComment(formData, postId, parentCommentId),
    onSuccess: (data) => {
      handleReset();
      toast.success("Comment has been added");
      queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });
      queryClient.invalidateQueries({
        queryKey: ["post", postId, "comment-count"],
      });
    },
  });

  const createCommentForm = useForm<commentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: commentFormData) => {
    createCommentMutation.mutate(formData);
    if (propOnSubmit) propOnSubmit();
  };

  const handleReset = () => {
    createCommentForm.reset();
    setCommentOpen(false);
    if (onReset) onReset();
  };

  return (
    <div>
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
                  <Textarea
                    {...field}
                    autoFocus
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-1 mt-2">
              <Button variant={"secondary"} onClick={handleReset}>
                Cancel
              </Button>
              <Button type="submit" variant={"default"}>
                Comment
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
    </div>
  );
};
export default CreateComment;
