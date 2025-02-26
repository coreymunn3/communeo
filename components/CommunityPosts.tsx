import { CommunityPost } from "@/lib/types";

const CommunityPosts = ({ posts }: { posts: CommunityPost[] }) => {
  return (
    <div>
      {posts.map((post) => (
        <div>{post.title}</div>
      ))}
    </div>
  );
};
export default CommunityPosts;
