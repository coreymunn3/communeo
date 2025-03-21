import Comments from "@/components/Comments";
import CreateComment from "@/components/CreateComment";
import Post from "@/components/Post";
import { getComments, getPostById } from "@/lib/queries";
import { buildCommentTree } from "@/lib/utils";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    slug: string;
    postId: string;
  };
}

const PostPage = async ({ params }: PostPageProps) => {
  const { slug, postId } = params;

  // get the post
  const post = await getPostById(postId);

  // get the comments
  const comments = await getComments(postId);
  const commentTree = buildCommentTree(comments);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col space-y-8">
      <Post post={post} showAuthor={true} />

      {/* Textarea to leave a comment with comment/cancel buttons "inside" */}
      <CreateComment postId={postId} parentCommentId={null} />

      {/* sort by: top/new */}

      {/* tree of comments on this post */}
      <div>
        <Comments
          initialComments={commentTree}
          query={{
            queryKey: ["post", postId, "comments"],
            url: `/api/post/${postId}/comment`,
          }}
        />
      </div>
    </div>
  );
};
export default PostPage;
