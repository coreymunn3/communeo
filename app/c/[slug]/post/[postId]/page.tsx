import Comments from "@/components/Comments";
import Post from "@/components/Post";
import { prisma } from "@/lib/prisma";
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
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  // get the comments
  const comments = await prisma.comment.findMany({
    where: {
      post_id: postId,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Post post={post} />

      {/* Textarea to leave a comment with comment/cancel buttons "inside" */}

      {/* sort by: top/new */}

      {/* tree of comments on this post */}
      <div>
        {comments.length > 0 ? (
          <Comments postId={post.id} initialComments={comments} />
        ) : (
          <div className="flex flex-col my-10 justify-center items-center  text-slate-600 dark:text-slate-400">
            <p>There are no comments here yet!</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default PostPage;
