import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Configuration for DOMPurify
const purifyConfig = {
  ALLOWED_TAGS: [
    // Block elements
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "pre",
    "div",
    // Inline elements
    "span",
    "b",
    "i",
    "strong",
    "em",
    "a",
    "br",
    "code",
    // Lists
    "ul",
    "ol",
    "li",
    // Tables (if needed)
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
  FORBID_TAGS: ["script", "style", "iframe", "form", "input", "button"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  ALLOW_DATA_ATTR: false,
  USE_PROFILES: { html: true },
  SANITIZE_DOM: true,
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html The HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  try {
    // Create a new JSDOM instance for server-side sanitization
    const window = new JSDOM("").window;
    // @ts-ignore - DOMPurify types are not fully compatible with JSDOM
    const purify = DOMPurify(window);

    // Add hooks for links
    addLinkHooks(purify);

    return purify.sanitize(html, purifyConfig);
  } catch (error) {
    console.error("Error during sanitization:", error);
    // Fallback: strip all HTML tags as a last resort
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }
}

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

/**
 * Adds hooks to DOMPurify to handle links
 * @param purify DOMPurify instance
 */
export function addLinkHooks(purify: any): void {
  purify.addHook("afterSanitizeAttributes", function (node: any) {
    // Set all links to open in a new tab and add noopener noreferrer
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");

      // Sanitize the href attribute
      if (node.hasAttribute("href")) {
        node.setAttribute("href", sanitizeUrl(node.getAttribute("href") || ""));
      }
    }
  });
}
