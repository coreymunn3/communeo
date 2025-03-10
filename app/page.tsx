import { getDbUser } from "@/actions/getDbUser";
import Posts from "@/components/Posts";
import { prisma } from "@/lib/prisma";
import { CommunityPost } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  let feedPosts: CommunityPost[] = [];
  // if user is logged in, fetch list of posts from their communities
  if (userId) {
    const dbUser = await getDbUser();
    feedPosts = await prisma.post.findMany({
      where: {
        community: {
          members: {
            some: {
              user_id: dbUser.id,
            },
          },
        },
      },
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
    });
  } else {
    // fetch list of highest scoring posts from the last day or so, from all communities
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

  {
    /* 
  Not Logged In: Main Page will default be a feed of top posts from the curernt day 
    - Fallback Idea: One Page vibrant Image/abstract shapes, possibly some animations to catch the users eye
  Logged In: Main Page will be a feed of all posts from the user's subsriptions 
  - side bar: a list of the user's communities with the ability to create a community
  
  */
  }
  return (
    <div>
      {/* top - sort by top/newest */}
      <Posts initialPosts={feedPosts} />
    </div>
  );
}
