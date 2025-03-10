"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { LinkPreviewMetadata } from "@/lib/types";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

const LinkPreview = ({ url, postId }: { url: string; postId: string }) => {
  const linkPreviewQuery = useQuery<LinkPreviewMetadata>({
    queryKey: ["post", postId, "link-preview", url],
    queryFn: async () => {
      const res = await fetch(`/api/link-preview?url=${url}`);
      return res.json();
    },
  });
  if (linkPreviewQuery.isLoading) {
    return (
      <div className="flex">
        <div className="w-1/3 aspect-video">
          <Skeleton className="h-full w-full rounded-tl-lg rounded-bl-lg" />
        </div>
        <div className="w-2/3">
          <Skeleton className="h-full w-full rounded-tr-lg rounded-br-lg" />
        </div>
      </div>
    );
  }
  if (linkPreviewQuery.isSuccess) {
    return (
      <Link
        href={linkPreviewQuery.data.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
          {linkPreviewQuery.data?.image && (
            <div className="w-1/3 aspect-video relative">
              <Image
                src={
                  linkPreviewQuery.data.image === "broken"
                    ? "/images/brokenlink.jpg"
                    : linkPreviewQuery.data.image
                }
                alt={linkPreviewQuery.data.title || "Link preview image"}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  e.currentTarget.src = "/images/fallback-image.jpg";
                }}
              />
            </div>
          )}
          <div className="w-2/3 p-2">
            <h2 className="">{linkPreviewQuery.data.title}</h2>
            <p className="text-sm text-slate-400">
              {linkPreviewQuery.data.description}
            </p>
          </div>
        </div>
      </Link>
    );
  }
};
export default LinkPreview;
