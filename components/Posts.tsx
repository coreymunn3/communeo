"use client";
import { CommunityPost } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";

const Posts = ({
  initialPosts,
  communityId,
}: {
  initialPosts: CommunityPost[];
  communityId: string;
}) => {
  // fetch the posts for this community using as placeholder the initial posts from the server
  const { data: posts } = useQuery<CommunityPost[]>({
    queryKey: ["community", communityId, "posts"],
    queryFn: async () => {
      const res = await fetch(`/api/community/${communityId}/post`);
      return res.json();
    },
    initialData: initialPosts,
  });

  return (
    <div className="flex flex-col space-y-4">
      {posts.map((post: CommunityPost) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};
export default Posts;
