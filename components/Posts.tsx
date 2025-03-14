"use client";
import { CommunityPost } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";

const Posts = ({
  initialPosts,
  communityId,
}: {
  initialPosts: CommunityPost[];
  communityId?: string;
}) => {
  const isCommunityPosts = Boolean(communityId);
  // fetch the posts for this community using as placeholder the initial posts from the server
  const { data: posts } = useQuery<CommunityPost[]>({
    queryKey: isCommunityPosts
      ? ["community", communityId, "posts"]
      : ["feed", "posts"],
    queryFn: async () => {
      const url = isCommunityPosts
        ? `/api/community/${communityId}/post`
        : `/api/feed`;
      const res = await fetch(url);
      return res.json();
    },
    initialData: initialPosts,
  });

  if (posts.length === 0) {
    return (
      <div className="flex  flex-col space-y-4 h-full justify-center items-center  text-slate-600 dark:text-slate-400">
        <p>There are no posts here yet!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      {posts.map((post: CommunityPost) => (
        <Post post={post} key={post.id} isCommunityPost={isCommunityPosts} />
      ))}
    </div>
  );
};
export default Posts;
