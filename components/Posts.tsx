"use client";
import { CommunityPost } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";

interface PostProps {
  initialPosts: CommunityPost[];
  communityId?: string;
  query: {
    queryKey: string[];
    url: string;
  };
}

const Posts = ({
  initialPosts,
  communityId,
  query: { queryKey, url },
}: PostProps) => {
  // fetch the posts for this community using as placeholder the initial posts from the server
  const { data: posts } = useQuery<CommunityPost[]>({
    queryKey: queryKey,
    queryFn: async () => {
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
        <Post post={post} key={post.id} inCommunity={Boolean(communityId)} />
      ))}
    </div>
  );
};
export default Posts;
