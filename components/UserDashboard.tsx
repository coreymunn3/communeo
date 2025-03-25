"use client";

import React from "react";
import { type ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { Line, LineChart } from "recharts";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#2563eb",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#60a5fa",
//   },
// } satisfies ChartConfig;

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

const WidgetLoadingSkeleton = () => (
  <Skeleton className="h-28 w-full bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg" />
);

{
  /* info we want to see:
    - Total score (up - down votes) topline
    - total posts with sparkline
    - total comments with sparkline
    - communities active in: number and list top few
      - active = posts & comments (typically a user will comment more than post)
    - score by communities in order of activity w/sparklines
*/
}

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

  return (
    <div className="p-2 text-sm">
      <p className="p-2 text-center">
        Activity Summary for <span className="font-semibold">{username}</span>
      </p>
      <div className="flex flex-col space-y-2">
        <div>
          {userScores.isLoading ? (
            <WidgetLoadingSkeleton />
          ) : (
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
          )}
        </div>

        <div>
          {userPosts.isLoading ? (
            <WidgetLoadingSkeleton />
          ) : (
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
          )}
        </div>

        <div>
          {userComments.isLoading ? (
            <WidgetLoadingSkeleton />
          ) : (
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
          )}
        </div>
      </div>

      {/* refactor into sparkline component? */}
      {/* <ChartContainer config={chartConfig} className="h-[30px] w-[50px]">
        <LineChart data={chartData}>
          <Line
            type={"monotone"}
            dataKey={"desktop"}
            name="Desktop"
            dot={false}
          ></Line>
        </LineChart>
      </ChartContainer> */}
    </div>
  );
};
export default UserDashboard;
