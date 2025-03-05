"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Author } from "@/lib/types";
import { DateTime } from "luxon";
import Link from "next/link";

interface UserTagAndCreationProps {
  user: Author;
  createdDate: string;
}

const UserTagAndCreation = ({ user, createdDate }: UserTagAndCreationProps) => {
  return (
    <div className="flex space-x-1 w-full pt-4 items-center text-sm">
      {/* user avatar */}
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar_url || ""} />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      {/* username - links to the user's page */}
      <Link href={`/u/${user.username}`}>
        <p className="font-semibold">{`/u/${user.username}`}</p>
      </Link>
      {/* datetime posted */}
      <p> | {DateTime.fromISO(createdDate).toRelative()}</p>
    </div>
  );
};
export default UserTagAndCreation;
