"use client";

import React from "react";
import { type ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { Line, LineChart } from "recharts";

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

const WidgetWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-1 border rounded-lg border-slate-300 dark:border-slate-700 flex flex-col space-y-1 items-center justify-center">
      {children}
    </div>
  );
};

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
    queryKey: ["user", username, "scores"],
    queryFn: async () => {
      const res = await fetch(`/api/user/${username}/scores`);
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
          <WidgetWrapper>
            <p>Total Score</p>
            <p className="font-bold">{userScores.data?.totalScore}</p>
          </WidgetWrapper>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <WidgetWrapper>
            <p>Post Score</p>
            <p className="font-bold">{userScores.data?.postScore}</p>
          </WidgetWrapper>
          <WidgetWrapper>
            <p>Comment Score</p>
            <p className="font-bold">{userScores.data?.commentScore}</p>
          </WidgetWrapper>
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
