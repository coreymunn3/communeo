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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { RichTextEditor } from "./ui/rich-text-editor";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Community, postFormData, postFormSchema } from "@/lib/types";
import { AlertTriangle, Eye, Loader2Icon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/actions/createPost";
import { useState } from "react";
import { Badge } from "./ui/badge";

interface CreatePostFormProps {
  onSuccess?: () => void;
  redirectOnSuccess?: string;
  onCancel?: () => void;
  redirectOnCancel?: string;
  community: Community;
}

const CreatePostForm = ({
  onSuccess,
  redirectOnSuccess,
  onCancel,
  redirectOnCancel,
  community,
}: CreatePostFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedFlair, setSelectedFlair] = useState<string | undefined>();

  /**
   * If the user clicks the flair, select it,
   * unless that is the flair that is already selected, in which case we will unselect it
   * @param flairId string
   */
  const handleToggleFlair = (flairId: string) => {
    if (selectedFlair === flairId) {
      setSelectedFlair(undefined);
    } else {
      setSelectedFlair(flairId);
    }
  };

  const createPostForm = useForm<postFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      type: "text",
      content: "",
      is_nsfw: false,
      is_spoiler: false,
    },
    mode: "onBlur",
  });

  const createPostMutation = useMutation({
    mutationFn: (formData: postFormData) =>
      createPost(formData, community.id, selectedFlair),
    // if successful, alert the user, run any success actions they want, invalidate the previous query & refetch
    onSuccess: (data) => {
      toast.success("Post has been created");
      if (onSuccess) onSuccess();
      if (redirectOnSuccess) router.push(redirectOnSuccess);
      queryClient.invalidateQueries({
        queryKey: ["community", community.id, "posts"],
      });
    },
    // if failure, alert the user, keep form dirty
    onError: (error) => {
      console.error(error);
      toast.error("Unable to create post");
    },
  });

  const onSubmit = async (formData: postFormData) => {
    // try to create the post with an action
    createPostMutation.mutate(formData);
  };

  const handleCancel = () => {
    // clear fields
    createPostForm.reset();
    // run any cancel actions & redirects
    if (onCancel) onCancel();
    if (redirectOnCancel) router.push(redirectOnCancel);
  };

  return (
    <div className="">
      <Form {...createPostForm}>
        <form
          onSubmit={createPostForm.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          {/* select field for type */}
          <FormField
            control={createPostForm.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select what type of post this is" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />
          {/* input for title */}
          <FormField
            control={createPostForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Get the reader's attention with a catchy title"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Between 5 and 500 characters</FormDescription>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />
          {/* input for content */}
          <FormField
            control={createPostForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Content</FormLabel>
                {/* flairs */}
                <div className="flex space-x-2">
                  {community.flairs.map((flair, i) => {
                    const isSelected = selectedFlair === flair.id;
                    return (
                      <Badge
                        key={i}
                        // variant={isSelected ? "default" : "outline"}
                        variant={"outline"}
                        onClick={() => handleToggleFlair(flair.id)}
                        style={{
                          backgroundColor: isSelected ? flair.color : "",
                        }}
                        className="bg-slate-100 dark:bg-slate-800"
                      >
                        {flair.title}
                      </Badge>
                    );
                  })}
                </div>
                {/* content area */}
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="What do you want to share with the community?"
                    error={!!createPostForm.formState.errors.content}
                  />
                </FormControl>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />
          <div className="flex space-x-2">
            {/* NSFW Toggle */}
            <FormField
              control={createPostForm.control}
              name="is_nsfw"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Toggle
                      variant={"outline"}
                      pressed={createPostForm.getValues().is_nsfw}
                      onPressedChange={(pressed) =>
                        createPostForm.setValue("is_nsfw", pressed)
                      }
                    >
                      <AlertTriangle /> NSFW
                    </Toggle>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Spoiler Toggle */}
            <FormField
              control={createPostForm.control}
              name="is_spoiler"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Toggle
                      variant={"outline"}
                      pressed={createPostForm.getValues().is_spoiler}
                      onPressedChange={(pressed) =>
                        createPostForm.setValue("is_spoiler", pressed)
                      }
                    >
                      <Eye /> Spoiler
                    </Toggle>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* form control buttons - submit and cancel */}
          <div className="flex self-end space-x-4 flex-wrap">
            <Button className="w-40" variant={"outline"} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !createPostForm.formState.isValid ||
                createPostForm.formState.isSubmitting
              }
              className="w-40"
            >
              {createPostMutation.isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                "Create Post"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default CreatePostForm;
