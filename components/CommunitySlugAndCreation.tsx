"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateTime } from "luxon";
import Link from "next/link";

interface CommunitySlugAndCreationProps {
  community: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  createdDate: string;
}

const CommunitySlugAndCreation = ({
  community,
  createdDate,
}: CommunitySlugAndCreationProps) => {
  return (
    <div className="flex space-x-1 w-full pt-2 items-center text-sm">
      {/* community avatar icon */}
      <Avatar className="h-8 w-8">
        <AvatarImage src={community.icon || ""} />
        <AvatarFallback>{community.slug}</AvatarFallback>
      </Avatar>
      {/* community name - links to the community page */}
      <Link href={`/c/${community.slug}`}>
        <p className="font-semibold">{`/c/${community.slug}`}</p>
      </Link>
      {/* datetime posted */}
      <p> | {DateTime.fromISO(createdDate).toRelative()}</p>
    </div>
  );
};
export default CommunitySlugAndCreation;
