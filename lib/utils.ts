import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Comment } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(value: string) {
  try {
    new URL(value); // Throws an error if the URL is invalid
    return true;
  } catch {
    return false;
  }
}

/**
 * creates a lower case slug with text and no spaces or special characters
 * @param name string
 * @returns string, a valid slug
 */
export function slugify(name: string): string {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "") // Remove spaces
    .replace(/[^\w-]+/g, ""); // Remove special characters
}

/**
 * This function capitalizes each word of a phrase
 * @param phrase string
 * @returns string, with first letters capitalized
 */
export function capitalizeEachWord(phrase: string): string {
  if (!phrase) return phrase; // Return the input if it's empty or null
  return phrase
    .split(" ") // Split the phrase into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join the words back into a single string
}

/**
 * This function ensures the date is always an ISO date string in the client
 * @param date a date-like object or string
 * @returns iso date string
 */
export const normalizeDate = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
};

/**
 * This function takes a flat array of comments, and creates a tree structure of nested objects
 * child comments are placed in the replies array.
 * @param comments array of Comments
 * @returns A tree of neseted comments
 */
export const buildCommentTree = (comments: Comment[]) => {
  const commentMap: { [key: string]: Comment } = {};
  const commentTree: Comment[] = [];

  // map comments
  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });
  // assign replies to their parents
  comments.forEach((comment) => {
    // if there's a parent comment, put this comment in that parent's replies
    if (comment.parent_comment_id) {
      const parent = commentMap[comment.parent_comment_id];
      if (parent) {
        parent.replies?.push(commentMap[comment.id]);
      }
    } else {
      // if no parent, it's a top-level comment
      commentTree.push(commentMap[comment.id]);
    }
  });
  return commentTree;
};

/**
 * Formats a number to relevant units
 * @param num
 * @returns a string of the formatted number
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    // Format for millions (e.g., 1.23M)
    const millions = num / 1000000;
    return millions.toFixed(millions < 10 ? 2 : 1) + "M";
  } else if (num >= 10000) {
    // Format for thousands (e.g., 12.3k)
    const thousands = num / 1000;
    return thousands.toFixed(1) + "k";
  }
  // Return plain number for values under 10k
  return num.toString();
}
