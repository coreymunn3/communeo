"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { useMemo } from "react";

interface RichTextContentProps {
  content: string;
  className?: string;
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  // Configure DOMPurify to allow target and rel attributes
  if (typeof window !== "undefined") {
    DOMPurify.setConfig({
      ADD_ATTR: ["target", "rel"],
    });
  }

  // Sanitize and process content
  const processedContent = useMemo(() => {
    // First sanitize the content
    let sanitizedContent =
      typeof window !== "undefined" ? DOMPurify.sanitize(content) : content;

    // Then process all links in the HTML to add target="_blank" and fix URLs without protocols
    if (typeof window !== "undefined") {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = sanitizedContent;

      // Find all anchor tags
      const links = tempDiv.querySelectorAll("a");

      // Process each link
      links.forEach((link) => {
        // Get the href attribute
        const href = link.getAttribute("href");

        // Fix URLs without protocols
        if (href && !href.match(/^(?:https?|mailto|tel|ftp):/i)) {
          link.setAttribute("href", `https://${href}`);
        }

        // Set target and rel attributes
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });

      // Get the processed HTML
      sanitizedContent = tempDiv.innerHTML;
    }

    return sanitizedContent;
  }, [content]);

  return (
    <div
      className={cn("prose dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
