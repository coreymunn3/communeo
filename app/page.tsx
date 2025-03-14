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
  // if user is logged in, fetch list of posts from their communities
  if (userId) {
    const dbUser = await getDbUser();
    feedPosts = await getPostsForUser(dbUser.id);
  } else {
    // fetch list of highest scoring posts from the last day or so, from all communities
    /**
     * TO DO - while the query works, most of the apps functionality is being protected
     * by the auth.protec and relies on the dbUser to complete. This needs work, probably across the entire app
     */
    feedPosts = await prisma.post.findMany({
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
  }

  return (
    <div className="flex flex-col space-y-2">
      <div>
        <YourCommunities />
      </div>
      <Posts
        initialPosts={feedPosts}
        query={{
          queryKey: ["posts", "feed"],
          url: `/api/post`,
        }}
      />
    </div>
  );
}
