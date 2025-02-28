"use client";
import { CommunityPost } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const CommunityPosts = ({
  initialPosts,
  communityId,
}: {
  initialPosts: CommunityPost[];
  communityId: string;
}) => {
  // fetch the posts for this community using as placeholder the initial posts from the server
  const { data: communityPosts } = useQuery({
    queryKey: [communityId, "posts"],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${communityId}`);
      return res.json();
    },
    initialData: initialPosts,
  });

  return (
    <div>
      {communityPosts.map((post: CommunityPost) => (
        <div>{post.title}</div>
      ))}
    </div>
  );
};
export default CommunityPosts;
