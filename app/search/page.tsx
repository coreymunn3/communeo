import FullPageMessageLayout from "@/components/FullPageMessageLayout";
import Posts from "@/components/Posts";
import { getPostsFromSearchTerm } from "@/lib/queries";
import { SearchXIcon } from "lucide-react";

interface SearchPageProps {
  searchParams: {
    q?: string; // Define the expected query parameter
  };
}

export default async function Search({ searchParams }: SearchPageProps) {
  console.log(searchParams);
  const { q } = searchParams;

  if (!q) {
    return (
      <FullPageMessageLayout
        icon={<SearchXIcon className="h-16 w-16 text-primary" />}
        title="No Search Term Provided"
        subtitle="Please enter a searh term or phrase using the search bar in the Header"
      ></FullPageMessageLayout>
    );
  }

  const posts = await getPostsFromSearchTerm(q);

  return (
    <Posts
      initialPosts={posts}
      query={{
        queryKey: ["posts", q],
        url: `/api/posts?q=${q}`,
      }}
    />
  );
}
