"use client";
import { CommunityPost } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Post from "./Post";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";

interface PostsResponse {
  posts: CommunityPost[];
  nextCursor?: string;
  hasMore: boolean;
}

interface PostProps {
  initialPosts: CommunityPost[];
  initialNextCursor?: string;
  initialHasMore?: boolean;
  query: {
    queryKey: string[];
    url: string;
  };
  showAuthor?: boolean;
}

const Posts = ({
  showAuthor,
  initialPosts,
  initialNextCursor,
  initialHasMore = false,
  query: { queryKey, url },
}: PostProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Use infinite query to fetch posts with pagination
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<PostsResponse>({
      queryKey,
      queryFn: async ({ pageParam = "" }) => {
        const separator = url.includes("?") ? "&" : "?";
        const paginatedUrl = `${url}${separator}cursor=${pageParam}`;
        const res = await fetch(paginatedUrl);
        return res.json();
      },
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      getPreviousPageParam: () => undefined,
      initialData: {
        pages: [
          {
            posts: initialPosts,
            nextCursor: initialNextCursor,
            hasMore: initialHasMore,
          },
        ],
        pageParams: [""],
      },
    });

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten all posts from all pages
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "error") {
    return <div>Error loading posts</div>;
  }

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col space-y-4 h-full justify-center items-center text-slate-600 dark:text-slate-400">
        <p>There are no posts here yet!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      {allPosts.map((post: CommunityPost) => (
        <Post post={post} key={post.id} showAuthor={showAuthor} />
      ))}

      {/* Loading indicator and intersection observer target */}
      <div ref={bottomRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="w-full space-y-3">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton component for loading state
const PostSkeleton = () => {
  return (
    <div className="flex flex-col space-y-1">
      <Separator />
      <div className="flex flex-col space-y-2 rounded-lg p-2">
        {/* Author/Community line skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Content skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Controls skeleton */}
        <div className="flex space-x-2 pt-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
};

export default Posts;
