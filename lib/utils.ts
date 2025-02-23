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

export function slugify(name: string): string {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "") // Remove spaces
    .replace(/[^\w-]+/g, ""); // Remove special characters
}
