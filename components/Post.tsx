"use client";
import React from "react";
import { CommunityPost } from "@/lib/types";
import { Separator } from "./ui/separator";
import { normalizeDate } from "@/lib/utils";
import Image from "next/image";
import LinkPreview from "./LinkPreview";
import PostVotes from "./PostVotes";
import { useParams, useRouter } from "next/navigation";
import CommentCount from "./CommentCount";
import UserTagAndCreation from "./UserTagAndCreation";
import CommunitySlugAndCreation from "./CommunitySlugAndCreation";

const Post = ({
  post,
  inCommunity,
}: {
  post: CommunityPost;
  inCommunity?: boolean;
}) => {
  const router = useRouter();
  const normalizedPostDate = normalizeDate(post.created_on);

  const handleNavigateToPost = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.stopPropagation(); // Stop propagation if the event is from a child element
    }
    router.push(`/c/${post.community.slug}/post/${post.id}`);
  };

  const renderPostContent = (type: string, content: string, postId: string) => {
    switch (type) {
      case "text":
        return <p>{content}</p>;
      case "image":
        return (
          <div className="w-full h-auto relative aspect-video">
            <Image
              src={content}
              alt={"post image"}
              style={{ objectFit: "cover", borderRadius: "16px" }}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={(e) => {
                e.currentTarget.src = "/images/fallback-image.jpg";
              }}
            />
          </div>
        );
      case "link":
        return <LinkPreview url={content} postId={postId} />;
      default:
        console.error(`Unsupported post content type passed: ${type}`);
        break;
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <Separator />
      <div
        className={`flex flex-col space-y-1 hover:bg-slate-100 dark:hover:bg-slate-900 
          rounded-lg p-2 cursor-pointer transition-all duration-300`}
        onClick={handleNavigateToPost}
      >
        {/* author tag line - username details if a community post, and community icon and details, if in feed */}
        <div>
          {inCommunity ? (
            <UserTagAndCreation
              user={post.author}
              createdDate={normalizedPostDate}
            />
          ) : (
            <CommunitySlugAndCreation
              community={post.community}
              createdDate={normalizedPostDate}
            />
          )}
        </div>

        {/* title */}
        <p className="font-semibold text-lg">{post.title}</p>
        {/* content */}
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {renderPostContent(post.type, post.content, post.id)}
          </p>
        </div>
        {/* TO DO - controls: upvote downvote (with count), number of comments (expandable), share (copy link, crosspost, embed?) */}
        <div className="flex flex-row space-x-2 items-center pt-4">
          <PostVotes postId={post.id} />
          <CommentCount
            postId={post.id}
            emphasize={true}
            action={handleNavigateToPost}
          />
        </div>
      </div>
    </div>
  );
};
export default Post;
