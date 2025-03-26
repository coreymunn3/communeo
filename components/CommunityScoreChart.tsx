"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { UserCommunityScore } from "@/lib/types";

// Chart configuration with primary color for posts and lighter primary for comments
const communityScoreChartConfig = {
  postScore: {
    label: "Posts",
    color: "hsl(var(--primary))",
  },
  commentScore: {
    label: "Comments",
    color: "hsl(var(--primary) / 0.5)",
  },
} satisfies ChartConfig;

const CommunityScoreChart = ({ data }: { data: UserCommunityScore[] }) => {
  // Limit to top 10 communities for better visualization
  const limitedData = data.slice(0, 10);

  // Custom tooltip to show both post and comment scores
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const postScore = payload[0].value;
      const commentScore = payload[1].value;
      const totalScore = postScore + commentScore;

      return (
        <div className="bg-background border border-border/50 rounded-lg p-2 text-xs shadow-xl">
          <p className="font-medium">{label}</p>
          <p>
            Posts: <span className="font-mono">{postScore}</span>
          </p>
          <p>
            Comments: <span className="font-mono">{commentScore}</span>
          </p>
          <p className="font-medium">
            Total: <span className="font-mono">{totalScore}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={limitedData.length * 40}>
      <BarChart
        data={limitedData}
        layout="vertical"
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        barCategoryGap={5}
      >
        {/* Hide XAxis but keep it for functionality */}
        <XAxis type="number" hide={true} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="communityName"
          width={50}
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
          tickMargin={0}
        />
        <Tooltip content={<CustomTooltip />} />
        {/* Removed Legend for a cleaner look */}
        <Bar
          dataKey="postScore"
          name={communityScoreChartConfig.postScore.label}
          stackId="a"
          fill={communityScoreChartConfig.postScore.color}
          radius={[0, 8, 8, 0]}
        />
        <Bar
          dataKey="commentScore"
          name={communityScoreChartConfig.commentScore.label}
          stackId="a"
          fill={communityScoreChartConfig.commentScore.color}
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CommunityScoreChart;
