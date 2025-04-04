/**
 * Client-side sanitization utilities
 * These functions are safe to use in client components
 */

/**
 * Sanitizes a URL to prevent javascript: URLs and ensure proper formatting
 * @param url The URL to sanitize
 * @returns Sanitized URL
 */
export function sanitizeUrl(url: string): string {
  // Basic URL sanitization
  if (!url) return "";

  // Prevent javascript: URLs
  if (/^javascript:/i.test(url)) {
    return "";
  }

  // Ensure URL starts with http:// or https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }

  return url;
}
