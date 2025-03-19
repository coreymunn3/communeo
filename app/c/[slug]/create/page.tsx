import CreatePostForm from "@/components/CreatePostForm";
import { getCommunityFromSlug } from "@/lib/queries";
import { capitalizeEachWord } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

interface CreatePostPageProps {
  params: {
    slug: string;
  };
}

const CreatePostPage = async ({ params }: CreatePostPageProps) => {
  const community = await getCommunityFromSlug(params.slug);

  if (!community) {
    redirect("/");
  }

  if (community) {
    return (
      <div className="max-h-screen max-w-4xl mx-auto mt-12 p-4">
        <div className="flex flex-col space-y-8">
          <div className="flex space-x-4 items-center justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden relative">
              <Image
                src={community.icon}
                alt="Community Icon Image"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <h1 className="text-4xl">
              Create Post in{" "}
              <span className="font-semibold">
                {capitalizeEachWord(community.name)}
              </span>
            </h1>
          </div>
          <CreatePostForm
            redirectOnSuccess={`/c/${params.slug}`}
            redirectOnCancel={`/c/${params.slug}`}
            community={community}
          />
        </div>
      </div>
    );
  }
};
export default CreatePostPage;
