import { z } from "zod";
import { isValidUrl } from "./utils";
import { JsonValue } from "@prisma/client/runtime/library";

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

export type AppUser = {
  id: string;
  username: string;
  avatar_url: string | null;
  email: string;
  created_on: Date;
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_on: Date;
  flairs: CommunityFlair[];
  rules?: CommunityRule[] | null | undefined | JsonValue;
  icon?: string;
  banner?: string;
  founder_id: string;
  moderator_id: string;
};

export type CommunityWithSubs = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isFounder: boolean;
  isModerator: boolean;
  members: number;
};

export type CommunityMembership = {
  isMember: boolean;
  isModerator: boolean;
  isFounder: boolean;
};

export type CommunityRule = {
  title: string;
  description: string;
};

export type CommunityFlair = {
  id: string;
  title: string;
  color: string;
  community_id: string;
};

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
        color: z
          .string()
          .regex(/^#([0-9A-F]{3}){1,2}$/i, "Color must be a valid hex value."),
      })
    )
    .min(1, "At least 1 flair is required for each commune"),
});

export type createCommunityFormData = z.infer<typeof createCommunityFormSchema>;

// Define schemas for each post type
const textPostSchema = z.object({
  type: z.literal("text"),
  title: z.string().min(5).max(500),
  content: z.string().min(1, "Content is required for text posts."),
  is_nsfw: z.boolean().default(false), // Boolean field for is_NSFW
  is_spoiler: z.boolean().default(false), // Boolean field for is_Spoiler
});

const imagePostSchema = z.object({
  type: z.literal("image"),
  title: z.string().min(5).max(100),
  content: z.string().url("Content must be a valid URL for image posts."),
  is_nsfw: z.boolean().default(false),
  is_spoiler: z.boolean().default(false),
});

const linkPostSchema = z.object({
  type: z.literal("link"),
  title: z.string().min(5).max(100),
  content: z.string().url("Content must be a valid URL for link posts."),
  is_nsfw: z.boolean().default(false),
  is_spoiler: z.boolean().default(false),
});

// Combine the schemas into a discriminated union
export const postFormSchema = z.discriminatedUnion("type", [
  textPostSchema,
  imagePostSchema,
  linkPostSchema,
]);

export type postFormData = z.infer<typeof postFormSchema>;

export type Author = {
  id: string;
  avatar_url: string | null;
  username: string;
};

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  type: string;
  is_nsfw: boolean;
  is_spoiler: boolean;
  user_id: string;
  community_id: string;
  created_on: Date;
  author: Author;
  community: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  flair?: CommunityFlair | null;
};

export type LinkPreviewMetadata = {
  title: string;
  description: string;
  author_name: string | null;
  author_url: string | null;
  image: string | null;
  url: string;
};

export type VoteData = {
  voteValue: number;
};

export type UserVote = {
  id: string;
  created_on: Date;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  value: number;
};

export const commentFormSchema = z.object({
  comment: z.string().min(1, "Some text is required"),
});

export type commentFormData = z.infer<typeof commentFormSchema>;

export type Comment = {
  text: string;
  id: string;
  created_on: Date;
  user_id: string;
  post_id: string;
  parent_comment_id: string | null;
  author: Author;
  replies?: Comment[];
  canEdit: boolean;
};

export type SortOption = {
  label: string;
  value: string;
};

export type UserCommunityScore = {
  communityName: string;
  communitySlug: string;
  postScore: number;
  commentScore: number;
  totalScore: number;
};
