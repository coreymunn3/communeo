import CreatePostForm from "@/components/CreatePostForm";
import { prisma } from "@/lib/prisma";
import { capitalizeEachWord } from "@/lib/utils";
import { redirect } from "next/navigation";

interface CreatePostPageProps {
  params: {
    slug: string;
  };
}

const CreatePostPage = async ({ params }: CreatePostPageProps) => {
  const community = await prisma.community.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (community) {
    return (
      <div className="max-h-screen max-w-4xl mx-auto mt-12 p-4">
        <div className="flex flex-col space-y-8">
          <h1 className="text-4xl">
            Create Post in{" "}
            <span className="font-semibold">
              {capitalizeEachWord(community.name)}
            </span>
          </h1>
          <CreatePostForm
            redirectOnCreate={`/c/${params.slug}`}
            redirectOnCancel={`/c/${params.slug}`}
            communityId={community.id}
          />
        </div>
      </div>
    );
  }
};
export default CreatePostPage;
