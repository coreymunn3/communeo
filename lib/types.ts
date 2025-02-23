import { z } from "zod";
import { isValidUrl } from "./utils";

export interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    username: string | null;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

/**
 * create a schema from our form through which we will infer types and create fields
 */
export const createCommunityFormSchema = z.object({
  name: z
    .string()
    .min(5, "Community name must be at least 5 characters long.")
    .max(50, "Community name cannot exceed 50 characters."),
  description: z
    .string()
    .min(10, "Community description must be at least 10 characters long.")
    .max(200, "Community description cannot exceed 200 characters."),
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
  flairs: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, "Flair title is required.")
          .max(20, "Flair title cannot exceed 20 characters."),
      })
    )
    .min(1, "At least 1 flair is required for each commune"),
});

export type createCommunityFormData = z.infer<typeof createCommunityFormSchema>;
