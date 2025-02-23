"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { isValidUrl } from "@/lib/utils";

/**
 * create a schema from our form through which we will infer types and create fields
 */
const createCommunityFormSchema = z.object({
  name: z
    .string()
    .min(5, "Community name must be at least 5 characters long.")
    .max(50, "Community name cannot exceed 50 characters."),
  description: z
    .string()
    .max(200, "Community description cannot exceed 200 characters.")
    .optional(),
  icon: z
    .string()
    .optional()
    .refine(
      (value) => !value || isValidUrl(value), // Validate only if value is provided
      "Icon must be a valid URL."
    ),
  banner: z
    .string()
    .optional()
    .refine(
      (value) => !value || isValidUrl(value), // Validate only if value is provided
      "Icon must be a valid URL."
    ),
  rules: z
    .array(
      z.object({
        title: z.string().min(1, "Rule title is required."),
        description: z.string().min(1, "Rule description is required"),
      })
    )
    .min(1, "At least 1 rule is require for each commune"),
  flairs: z.array(
    z
      .object({
        title: z
          .string()
          .min(1, "Flair title is required.")
          .max(20, "Flair title cannot exceed 20 characters."),
      })
      .optional()
  ),
});

const CreateCommunityDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const createCommunityForm = useForm<
    z.infer<typeof createCommunityFormSchema>
  >({
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

  const onSubmit = async (
    values: z.infer<typeof createCommunityFormSchema>
  ) => {
    console.log(values);
    // parse the rules and flairs into JSON
    const defaultRulees = {};
    const defaultFlairs = {};
    const parsedData = {
      ...values,
      // rules: values.rules ? JSON.parse(values.rules) : defaultRulees,
      // flairs: values.flairs ? JSON.parse(values.flairs) : defaultFlairs,
    };
  };

  const handleClose = () => {
    createCommunityForm.reset({ rules: [], flairs: [] });
    // clear the field arrays
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-screen overflow-scroll">
        <DialogHeader>
          <DialogTitle>Tell us about your commune</DialogTitle>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A brief description of your commune"
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
                      * Define your commune rules (min 1 rule)
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
                        className="bg-slate-100 dark:bg-slate-900 space-y-2 p-2 rounded-lg"
                      >
                        <FormField
                          control={createCommunityForm.control}
                          name={`rules.${index}.title`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-4">
                              <FormLabel className="w-20 text-right">
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
                              <FormLabel className="w-20 text-right">
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => removeRule(index)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flairs (JSON Object) */}
                <div>
                  <div className="flex space-x-2 justify-start items-center mb-2">
                    <FormLabel className="sticky">
                      Define your commune flairs
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
                        className="bg-slate-100 dark:bg-slate-900 space-y-2 p-2 rounded-lg"
                      >
                        <FormField
                          control={createCommunityForm.control}
                          name={`flairs.${index}.title`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-4">
                              <FormLabel className="w-20 text-right">
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => removeFlair(index)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* submit */}
                <Button
                  type="submit"
                  disabled={!createCommunityForm.formState.isValid}
                >
                  Create Commune
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
