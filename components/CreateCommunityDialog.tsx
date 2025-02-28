"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2Icon, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  createCommunityFormData,
  createCommunityFormSchema,
} from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createCommunity } from "@/actions/createCommunity";

const CreateCommunityDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const createCommunityForm = useForm<createCommunityFormData>({
    resolver: zodResolver(createCommunityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      banner: "",
      rules: [], // Default to empty array
      flairs: [], // Default to empty array
    },
    mode: "onBlur",
  });

  const {
    fields: rulesFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control: createCommunityForm.control,
    name: "rules",
  });

  const {
    fields: flairsFields,
    append: appendFlair,
    remove: removeFlair,
  } = useFieldArray({
    control: createCommunityForm.control,
    name: "flairs",
  });

  const createCommunityMutation = useMutation({
    mutationFn: (formData: createCommunityFormData) =>
      createCommunity(formData),
    onSuccess: (data) => {
      toast.success(`Community ${data.community?.name} has been created!`);
      handleClose();
      router.push(`/c/${data.community?.slug}`);
    },
    onError: (data, error) => {
      console.error(error);
      toast.error(`Something went wrong!`);
    },
  });

  const onSubmit = async (formData: createCommunityFormData) => {
    // create the community with an action
    createCommunityMutation.mutate(formData);
  };

  /**
   * When we close the dialog, we want to clear the form fields then call whatever onClose function was passed into here
   */
  const handleClose = () => {
    createCommunityForm.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-screen overflow-scroll">
        <DialogHeader>
          <DialogTitle>Tell us about your community</DialogTitle>
          <DialogDescription>
            <Form {...createCommunityForm}>
              <form
                onSubmit={createCommunityForm.handleSubmit(onSubmit)}
                className="flex flex-col space-y-4"
              >
                {/* field for name */}
                <FormField
                  control={createCommunityForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>* Community Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter community name" {...field} />
                      </FormControl>
                      <FormMessage className="ml-2" />
                    </FormItem>
                  )}
                />
                {/* field for description */}
                <FormField
                  control={createCommunityForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>* Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A brief description of your community"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="ml-2" />
                    </FormItem>
                  )}
                />
                {/* icon url */}
                <FormField
                  control={createCommunityForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter icon URL" {...field} />
                      </FormControl>
                      <FormMessage className="ml-2" />
                    </FormItem>
                  )}
                />
                {/* Banner URL */}
                <FormField
                  control={createCommunityForm.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter banner URL" {...field} />
                      </FormControl>
                      <FormMessage className="ml-2" />
                    </FormItem>
                  )}
                />
                {/* rules field */}
                <div>
                  <div className="flex space-x-2 justify-start items-center mb-2">
                    <FormLabel className="sticky">
                      * Define your community rules (min 1 rule)
                    </FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => appendRule({ title: "", description: "" })}
                    >
                      <Plus className="h-4 w-4" />
                      Add Rule
                    </Button>
                  </div>

                  <div className="flex flex-col space-y-4 max-h-[300px] overflow-scroll">
                    {rulesFields.map((rule, index) => (
                      <div
                        key={rule.id}
                        className="flex flex-row bg-slate-100 dark:bg-slate-900 space-x-2 p-2 rounded-lg"
                      >
                        <div className="flex-1">
                          <FormField
                            control={createCommunityForm.control}
                            name={`rules.${index}.title`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-4">
                                <FormLabel className="w-20 text-right mt-2">
                                  Rule Title
                                </FormLabel>
                                <div className="flex-1 flex flex-col space-y-1">
                                  <FormControl>
                                    <Input
                                      placeholder="Enter rule title"
                                      className="bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="ml-2" />
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={createCommunityForm.control}
                            name={`rules.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-4">
                                <FormLabel className="w-20 text-right mt-2">
                                  Rule Description
                                </FormLabel>
                                <div className="flex-1 flex flex-col space-y-1">
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter rule description"
                                      className="bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="ml-2" />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full h-full"
                            onClick={() => removeRule(index)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flairs (JSON Object) */}
                <div>
                  <div className="flex space-x-2 justify-start items-center mb-2">
                    <FormLabel className="sticky">
                      Define your community flairs
                    </FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => appendFlair({ title: "" })}
                    >
                      <Plus className="h-4 w-4" />
                      Add Flair
                    </Button>
                  </div>

                  <div className="flex flex-col space-y-4 max-h-[300px] overflow-scroll">
                    {flairsFields.map((flair, index) => (
                      <div
                        key={flair.id}
                        className="flex flex-row bg-slate-100 dark:bg-slate-900 space-x-2 p-2 rounded-lg"
                      >
                        <div className="flex-1">
                          <FormField
                            control={createCommunityForm.control}
                            name={`flairs.${index}.title`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center space-x-4">
                                <FormLabel className="w-20 text-right mt-2">
                                  Flair Title
                                </FormLabel>
                                <div className="flex-1 flex flex-col space-y-1">
                                  <FormControl>
                                    <Input
                                      placeholder="Enter rule title"
                                      className="bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="ml-2" />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full h-full"
                            onClick={() => removeFlair(index)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* submit */}
                <Button
                  type="submit"
                  disabled={
                    !createCommunityForm.formState.isValid ||
                    !createCommunityForm.formState.isSubmitting
                  }
                >
                  {createCommunityMutation.isPending ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Community"
                  )}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreateCommunityDialog;
