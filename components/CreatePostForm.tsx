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
import { Textarea } from "./ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { postFormData, postFormSchema } from "@/lib/types";
import { AlertTriangle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPost } from "@/actions/createPost";

// Page Structure
// Post type select - text/image/link
// Title (required)
// Add Flairs (get flairs for community)
// Post Body - Rich Text editor or Link (no image upload)
// Post | Cancel (buttons)

interface CreatePostFormProps {
  redirectOnCreate: string;
  redirectOnCancel: string;
  communityId: string;
}

const CreatePostForm = ({
  redirectOnCreate,
  redirectOnCancel,
  communityId,
}: CreatePostFormProps) => {
  const router = useRouter();
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

  const onSubmit = async (formData: postFormData) => {
    console.log(formData);
    // try to create the post with an action
    try {
      createPost(formData, communityId);
      // alert success
      toast.success("Post has been created");
      // redirect
      router.push(redirectOnCreate);
    } catch (error) {
      // alert failure
      toast.error("Unable to create post");
    }
  };

  const handleCancel = () => {
    // clear fields
    createPostForm.reset();
    // then redirect
    router.push(redirectOnCancel);
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
                <FormDescription>Between 5 and 50 characters</FormDescription>
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
                <FormControl>
                  <Textarea {...field} />
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
              disabled={!createPostForm.formState.isValid}
              className="w-40"
            >
              Create Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default CreatePostForm;
