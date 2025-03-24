import { getDbUser } from "@/actions/getDbUser";
import Posts from "@/components/Posts";
import YourCommunities from "@/components/YourCommunities";
import { prisma } from "@/lib/prisma";
import { getPostsForUser } from "@/lib/queries";
import { CommunityPost } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  let feedPosts: CommunityPost[] = [];
  let nextCursor: string | undefined = undefined;
  let hasMore = false;

  // if user is logged in, fetch list of posts from their communities
  if (userId) {
    const dbUser = await getDbUser();
    const {
      posts: feedPosts,
      nextCursor,
      hasMore,
    } = await getPostsForUser(dbUser.id);
  } else {
    // fetch list of highest scoring posts from the last day or so, from all communities
    /**
     * TO DO - while the query works, most of the apps functionality is being protected
     * by the auth.protec and relies on the dbUser to complete. This needs work, probably across the entire app
     */
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
      orderBy: [
        { created_on: "desc" },
        {
          votes: {
            _count: "desc",
          },
        },
      ],
      take: 10,
    });
    feedPosts = posts;
  }

  return (
    <div className="flex flex-col space-y-2">
      <div>
        <YourCommunities />
      </div>
      <Posts
        initialPosts={feedPosts}
        initialNextCursor={nextCursor}
        initialHasMore={hasMore}
        query={{
          queryKey: ["posts", "feed"],
          url: `/api/post`,
        }}
      />
    </div>
  );
}
