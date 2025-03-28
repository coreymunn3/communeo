import FullPageMessageLayout from "@/components/FullPageMessageLayout";
import Posts from "@/components/Posts";
import {
  getCommunityFromSlug,
  getPostsFromSearchTerm,
  getUserFromUsername,
} from "@/lib/queries";
import { SearchXIcon } from "lucide-react";

interface SearchPageProps {
  searchParams: {
    community?: string; // a slug
    q?: string; // a string of any length
    username?: string; // a username
  };
}

export default async function Search({ searchParams }: SearchPageProps) {
  const { community: communitySlug, q, username } = searchParams;

  if (!q) {
    return (
      <FullPageMessageLayout
        icon={<SearchXIcon className="h-16 w-16 text-primary" />}
        title="No Search Term Provided"
        subtitle="Please enter a searh term or phrase using the search bar in the Header"
      ></FullPageMessageLayout>
    );
  }

  if (username) {
    // verify the user exists
    const user = await getUserFromUsername(username);
    // if user doesnt exist, show the user a full page error message
    if (!user) {
      return (
        <FullPageMessageLayout
          icon={<SearchXIcon className="h-16 w-16 text-primary" />}
          title="404 - User Not Found"
          subtitle="We couldn't find any users matching that name! Please try again."
        ></FullPageMessageLayout>
      );
    }
    // otherwise, search posts within this user's posts
    const { posts, nextCursor, hasMore } = await getPostsFromSearchTerm(
      q,
      undefined,
      user.id
    );
    return (
      <Posts
        showAuthor={true}
        initialPosts={posts}
        initialNextCursor={nextCursor}
        initialHasMore={hasMore}
        query={{
          queryKey: ["posts", "search", user.username, q],
          url: `/api/post?userId=${user.id}&q=${q}`,
        }}
      />
    );
  }
  if (communitySlug) {
    // verify the community slug exists
    const community = await getCommunityFromSlug(communitySlug);
    // if it doesn't exist, show the user a full page error message
    if (!community) {
      return (
        <FullPageMessageLayout
          icon={<SearchXIcon className="h-16 w-16 text-primary" />}
          title="404 - Community Not Found"
          subtitle="We couldn't find any communities matching that name! Please try again."
        ></FullPageMessageLayout>
      );
    }
    // if community exists, search posts within it, and pass the new query param to the client side fetch url
    const { posts, nextCursor, hasMore } = await getPostsFromSearchTerm(
      q,
      community.id
    );
    return (
      <Posts
        initialPosts={posts}
        initialNextCursor={nextCursor}
        initialHasMore={hasMore}
        query={{
          queryKey: ["posts", "search", communitySlug, q],
          url: `/api/post?communityId=${community.id}&q=${q}`,
        }}
      />
    );
  }

  // if no community slug or username is passed, just search all posts in communeo
  const { posts, nextCursor, hasMore } = await getPostsFromSearchTerm(q);
  return (
    <Posts
      initialPosts={posts}
      initialNextCursor={nextCursor}
      initialHasMore={hasMore}
      query={{
        queryKey: ["posts", "search", q],
        url: `/api/post?q=${q}`,
      }}
    />
  );
}
