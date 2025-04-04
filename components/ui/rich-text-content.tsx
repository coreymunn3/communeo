"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

interface RichTextContentProps {
  content: string;
  className?: string;
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  // Sanitize content on the client side before rendering
  const sanitizedContent =
    typeof window !== "undefined" ? DOMPurify.sanitize(content) : content; // On server, we'll rely on server-side sanitization

  return (
    <div
      className={cn("prose dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
