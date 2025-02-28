import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
