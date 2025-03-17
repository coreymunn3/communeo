import FullPageMessageLayout from "@/components/FullPageMessageLayout";
import Posts from "@/components/Posts";
import { getCommunityFromSlug, getPostsFromSearchTerm } from "@/lib/queries";
import { SearchXIcon } from "lucide-react";

interface SearchPageProps {
  searchParams: {
    community?: string; // a slug
    q?: string; // a string of any length
  };
}

export default async function Search({ searchParams }: SearchPageProps) {
  const { community: communitySlug, q } = searchParams;

  if (!q) {
    return (
      <FullPageMessageLayout
        icon={<SearchXIcon className="h-16 w-16 text-primary" />}
        title="No Search Term Provided"
        subtitle="Please enter a searh term or phrase using the search bar in the Header"
      ></FullPageMessageLayout>
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
    const posts = await getPostsFromSearchTerm(q, community.id);
    return (
      <Posts
        initialPosts={posts}
        query={{
          queryKey: ["posts", communitySlug, q],
          url: `/api/post?communityId=${community.id}&q=${q}`,
        }}
      />
    );
  } else {
    // if no community slug is passed, just search all posts
    const posts = await getPostsFromSearchTerm(q);
    return (
      <Posts
        initialPosts={posts}
        query={{
          queryKey: ["posts", q],
          url: `/api/post?q=${q}`,
        }}
      />
    );
  }
}
