import Image from "next/image";
import CommunityNotFound from "@/components/CommunityNotFound";
import { prisma } from "@/lib/prisma";
import { capitalizeEachWord } from "@/lib/utils";
import { CakeIcon, UserIcon } from "lucide-react";
import { CommunityFlair, CommunityRule } from "@/lib/types";
import CommunityRules from "@/components/CommunityRules";
import CommunityFlairs from "@/components/CommunityFlairs";

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
    return <CommunityNotFound slug={slug} />;
  }

  const moderator = await prisma.app_user.findUnique({
    where: {
      id: community?.moderator_id,
    },
  });

  const numMembers = await prisma.community_member.count({
    where: {
      community_id: community?.id,
    },
  });

  if (community) {
    return (
      <div className="max-h-screen max-w-6xl mx-auto mt-12 p-4">
        <div className="container mx-auto flex flex-col space-y-2">
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
          <div className=" flex justify-center p-2 md:h-[60px]">
            <h1 className="text-4xl font-bold tracking-tight">
              {`${capitalizeEachWord(community.name)}`}
            </h1>
          </div>
          {/* Main Content */}
          <div className="flex gap-4 flex-col-reverse md:flex-row">
            {/* Left Section - Posts */}
            <div className="md:w-2/3 bg-slate-100 p-4">Posts!</div>
            {/* Right Section - Meta & Controls */}
            <div className="md:w-1/3 bg-slate-100 dark:bg-slate-900 rounded-lg p-4 text-slate-600 dark:text-slate-400">
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

              <hr className="border-slate-300 dark:border-slate-700 my-6" />

              {/* rules section */}
              <div className="flex flex-col space-y-2 text-sm">
                <p className="text-base font-semibold">Rules</p>
                {Array.isArray(communityRules) ? (
                  <CommunityRules rules={communityRules} />
                ) : (
                  <p>WooHoo! No Rules!</p>
                )}
              </div>

              <hr className="border-slate-300 dark:border-slate-700 my-6" />

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
      </div>
    );
  }
};
export default CommunityPage;
