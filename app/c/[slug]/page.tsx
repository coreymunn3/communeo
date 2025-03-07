import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { capitalizeEachWord } from "@/lib/utils";
import { CakeIcon, PlusIcon, UserIcon } from "lucide-react";
import { CommunityFlair, CommunityRule } from "@/lib/types";
import CommunityRules from "@/components/CommunityRules";
import CommunityFlairs from "@/components/CommunityFlairs";
import { Button } from "@/components/ui/button";
import Posts from "@/components/Posts";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CommunityPageProps {
  params: {
    slug: string;
  };
}

const CommunityPage = async ({ params }: CommunityPageProps) => {
  const { slug } = params;
  // get the community data from the slug
  const community = await prisma.community.findUnique({
    where: {
      slug,
    },
  });
  const communityRules = community?.rules as CommunityRule[];
  const communityFlairs = community?.flairs as CommunityFlair[];

  if (!community) {
    notFound();
  }

  if (community) {
    // find the moderator
    const moderator = await prisma.app_user.findUnique({
      where: {
        id: community?.moderator_id,
      },
    });
    // find the number of members
    const numMembers = await prisma.community_member.count({
      where: {
        community_id: community?.id,
      },
    });
    // get the posts for this community
    const communityPosts = await prisma.post.findMany({
      where: {
        community_id: community.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
      },
    });

    return (
      <div>
        {/* Banner */}
        {/* Name & Icon */}
        {/* Main Content                    |      SideBar             */}
        {/* First 10 Posts, with infinite
           scroll                           |      Name, Desc, Created 
           - filter by flair                |      Num Members   
           - Top by Day/Week/Month/Year/AllTime |      Rules */}

        {/* Banner & Icon */}
        <div className="relative">
          <div className="w-full h-[200px] relative overflow-hidden rounded-lg">
            <Image
              src={community.banner}
              alt="Community Banner Image"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="absolute w-16 h-16 md:w-32 md:h-32 -bottom-8 md:-bottom-[30%] left-6 overflow-hidden rounded-full">
            <Image
              src={community.icon}
              alt="Community Icon Image"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        {/* Title */}
        <div className=" flex ml-[16%] md:ml-[20%] justify-between p-2 md:h-[60px]">
          <h1 className="text-2xl md:text-4xl tracking-tight">
            {`${capitalizeEachWord(community.name)}`}
          </h1>
          <div className="flex space-x-2 items-center">
            <Button variant={"community"} asChild>
              <Link href={`/c/${slug}/create?type=text`}>
                <PlusIcon />
                Create Post
              </Link>
            </Button>
            <Button
              variant={"community"}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              Join
            </Button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex gap-4 flex-col-reverse md:flex-row">
          {/* Left Section - Posts */}
          <div className="md:w-2/3">
            <Posts communityId={community.id} initialPosts={communityPosts} />
          </div>
          {/* Right Section - Meta & Controls */}
          <div className="md:w-1/3 self-start bg-slate-100 dark:bg-slate-900 rounded-lg p-4 text-slate-600 dark:text-slate-400">
            {/* top section, about the community */}
            <div className="flex flex-col space-y-1 text-sm">
              <p className="text-lg font-semibold">
                {`c/${capitalizeEachWord(community.name)}`}
              </p>
              <p>{community.description}</p>
              <p className="flex items-end">
                <CakeIcon className="mr-2" />
                {`Created on ${community.created_on.toDateString()}`}
              </p>
              <p className="flex items-end">
                <UserIcon className="mr-2" />
                {`Moderated by ${moderator?.username}`}
              </p>
            </div>
            <div className="my-4 border border-slate-300 dark:border-slate-700 rounded-lg p-4">
              {`${numMembers} Members`}
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-6" />

            {/* rules section */}
            <div className="flex flex-col space-y-2 text-sm">
              <p className="text-base font-semibold">Rules</p>
              {Array.isArray(communityRules) ? (
                <CommunityRules rules={communityRules} />
              ) : (
                <p>WooHoo! No Rules!</p>
              )}
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-6" />

            {/* Flairs section */}
            <div className="flex flex-col space-y-2 text-sm">
              <p className="text-base font-semibold">Flairs</p>
              <p className="text-sm">Click to Sort Posts</p>
              {Array.isArray(communityFlairs) && (
                <CommunityFlairs flairs={communityFlairs} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default CommunityPage;
