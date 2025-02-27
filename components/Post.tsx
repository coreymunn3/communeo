import React from "react";
import { CommunityPost, PublicUser } from "@/lib/types";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { DateTime } from "luxon";
import { normalizeDate } from "@/lib/utils";

const Post = ({ post }: { post: CommunityPost }) => {
  /**
   * Query to fetch the user details to display in the post
   */
  const userQuery = useQuery<PublicUser>({
    queryKey: [post.user_id, "user"],
    queryFn: async () => {
      const res = await fetch(`/api/publicUser/${post.user_id}`);
      return res.json();
    },
  });
  const normalizedPostDate = normalizeDate(post.created_on);
  return (
    <div className="flex flex-col p-2 space-y-1">
      <Separator />
      {/* top line - avatar, username, datetime posted (time ago) */}
      {userQuery.isSuccess && (
        <div className="flex space-x-1 w-full pt-4 items-center text-sm">
          {/* user avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage src={userQuery.data.avatar_url} />
            <AvatarFallback>{userQuery.data.username}</AvatarFallback>
          </Avatar>
          {/* username - links to the user's page */}
          <Link href={`/u/${userQuery.data.username}`}>
            <p className="font-semibold">{`/u/${userQuery.data.username}`}</p>
          </Link>
          {/* datetime posted */}
          <p> | {DateTime.fromISO(normalizedPostDate).toRelative()}</p>
        </div>
      )}
      {/* title */}
      <div>
        <p className="font-semibold text-lg">{post.title}</p>
      </div>
      {/* content */}
      {/* TO DO - render content differently depending on type! swtich statement */}
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {post.content}
        </p>
      </div>
      {/* TO DO - controls: upvote downvote (with count), number of comments (expandable), share (copy link, crosspost, embed?) */}
    </div>
  );
};
export default Post;
