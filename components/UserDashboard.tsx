"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { UserCommunityScore } from "@/lib/types";
import CommunityScoreChart from "./CommunityScoreChart";

interface UserScores {
  totalScore: number;
  commentScore: number;
  postScore: number;
}

interface UserPostsAndComments {
  total: number;
  thisMonth: number;
  thisWeek: number;
}

interface UserCommunityData {
  memberships: number;
  scores: UserCommunityScore[];
}

const WidgetWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`p-1 border rounded-lg border-slate-300 dark:border-slate-700 flex flex-col space-y-1 items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
};

const WidgetLoadingSkeleton = ({ className }: { className?: string }) => (
  <Skeleton
    className={`h-28 w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg ${
      className ?? ""
    }`}
  />
);

const UserDashboard = ({ username }: { username: string }) => {
  const userScores = useQuery<UserScores>({
    queryKey: ["user", username, "dashboard", "scores"],
    queryFn: async () => {
      const res = await fetch(`/api/user/${username}/dashboard/scores`);
      return res.json();
    },
  });

  const userPosts = useQuery<UserPostsAndComments>({
    queryKey: ["user", username, "dashboard", "posts"],
    queryFn: async () => {
      const res = await fetch(`/api/user/${username}/dashboard/posts`);
      return res.json();
    },
  });

  const userComments = useQuery<UserPostsAndComments>({
    queryKey: ["user", username, "dashboard", "comments"],
    queryFn: async () => {
      const res = await fetch(`/api/user/${username}/dashboard/comments`);
      return res.json();
    },
  });

  const userCommunityData = useQuery<UserCommunityData>({
    queryKey: ["user", username, "dashboard", "communities"],
    queryFn: async () => {
      const res = await fetch(`/api/user/${username}/dashboard/communities`);
      return res.json();
    },
  });

  return (
    <div className="p-2 text-sm">
      <p className="p-2 text-center">
        Activity Summary for <span className="font-semibold">{username}</span>
      </p>
      <div className="flex flex-col space-y-2">
        {/* score on all activity */}
        <div>
          {userScores.isLoading ? (
            <WidgetLoadingSkeleton />
          ) : userScores.isError ? (
            <WidgetWrapper className="pb-2">
              <p className="font-semibold text-red-500">
                Failed to load score data
              </p>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </WidgetWrapper>
          ) : (
            userScores.isSuccess && (
              <WidgetWrapper className="pb-2">
                <p className="font-semibold">Score on activity</p>
                <div className="w-full flex justify-evenly flex-row md:flex-col md:space-y-2 items-center">
                  <p>
                    Total:{" "}
                    <span className="font-semibold">
                      {formatNumber(userScores.data!.totalScore)}
                    </span>
                  </p>
                  <p>
                    Posts:{" "}
                    <span className="font-semibold">
                      {formatNumber(userScores.data!.postScore)}
                    </span>
                  </p>
                  <p>
                    Comments:{" "}
                    <span className="font-semibold">
                      {formatNumber(userScores.data!.commentScore)}
                    </span>
                  </p>
                </div>
              </WidgetWrapper>
            )
          )}
        </div>
        {/* score on posts */}
        <div>
          {userPosts.isLoading ? (
            <WidgetLoadingSkeleton />
          ) : userPosts.isError ? (
            <WidgetWrapper>
              <p className="font-semibold text-red-500">
                Failed to load post data
              </p>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </WidgetWrapper>
          ) : (
            userPosts.isSuccess && (
              <WidgetWrapper>
                <p className="font-semibold">Number of Posts</p>
                <div className="w-full flex justify-evenly flex-row md:flex-col md:space-y-2 items-center">
                  <p>
                    Total:{" "}
                    <span className="font-semibold">
                      {formatNumber(userPosts.data!.total)}
                    </span>
                  </p>
                  <p>
                    This Week:{" "}
                    <span className="font-semibold">
                      {formatNumber(userPosts.data!.thisWeek)}
                    </span>
                  </p>
                  <p>
                    This Month:{" "}
                    <span className="font-semibold">
                      {formatNumber(userPosts.data!.thisMonth)}
                    </span>
                  </p>
                </div>
              </WidgetWrapper>
            )
          )}
        </div>
        {/* score on comments */}
        <div>
          {userComments.isLoading ? (
            <WidgetLoadingSkeleton />
          ) : userComments.isError ? (
            <WidgetWrapper>
              <p className="font-semibold text-red-500">
                Failed to load comment data
              </p>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </WidgetWrapper>
          ) : (
            userComments.isSuccess && (
              <WidgetWrapper>
                <p className="font-semibold">Number of Comments</p>
                <div className="w-full flex justify-evenly flex-row md:flex-col md:space-y-2 items-center">
                  <p>
                    Total:{" "}
                    <span className="font-semibold">
                      {formatNumber(userComments.data!.total)}
                    </span>
                  </p>
                  <p>
                    This Week:{" "}
                    <span className="font-semibold">
                      {formatNumber(userComments.data!.thisWeek)}
                    </span>
                  </p>
                  <p>
                    This Month:{" "}
                    <span className="font-semibold">
                      {formatNumber(userComments.data!.thisMonth)}
                    </span>
                  </p>
                </div>
              </WidgetWrapper>
            )
          )}
        </div>
        {/* Community Scores */}
        <div>
          {userCommunityData.isLoading ? (
            <WidgetLoadingSkeleton className="h-64" />
          ) : userCommunityData.isError ? (
            <WidgetWrapper>
              <p className="font-semibold text-red-500">
                Failed to load community data
              </p>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </WidgetWrapper>
          ) : userCommunityData.isSuccess &&
            userCommunityData.data.scores.length > 0 ? (
            <WidgetWrapper className="p-3 h-auto">
              <p className="font-semibold mb-2">Community Activity & Scores</p>
              <div>
                <p>
                  {username} is currently a member of{" "}
                  <strong>{userCommunityData.data.memberships || 0}</strong>{" "}
                  communities. Below is a summary of how much people have
                  enjoyed their contributions in those communities.
                </p>
              </div>
              <div className="w-full">
                <CommunityScoreChart data={userCommunityData.data.scores} />
              </div>
            </WidgetWrapper>
          ) : (
            <WidgetWrapper>
              <p className="font-semibold">Community Scores</p>
              <p className="text-muted-foreground">No community activity yet</p>
            </WidgetWrapper>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;
