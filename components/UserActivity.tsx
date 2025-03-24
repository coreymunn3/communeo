"use client";

import { act, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppUser, Comment, CommunityPost } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Posts from "./Posts";
import Comments from "./Comments";

type ActivityType = {
  id: string;
  name: string;
  component: React.ReactNode;
};

const UserActivity = ({
  user,
  initialPosts,
  initialNextCursor,
  initialHasMore,
  initialComments,
}: {
  user: AppUser;
  initialPosts: CommunityPost[];
  initialNextCursor?: string;
  initialHasMore?: boolean;
  initialComments: Comment[];
}) => {
  const activityTypes: ActivityType[] = [
    {
      id: "1",
      name: "Posts",
      component: (
        <Posts
          showAuthor={true}
          initialPosts={initialPosts}
          initialNextCursor={initialNextCursor}
          initialHasMore={initialHasMore}
          query={{
            queryKey: ["user", user.username, "posts"],
            url: `/api/user/${user.username}/post`,
          }}
        />
      ),
    },
    {
      id: "2",
      name: "Commenets",
      component: (
        <Comments
          allowReply={false}
          initialComments={initialComments}
          query={{
            queryKey: ["user", user.username, "comments"],
            url: `/api/user/${user.username}/comment`,
          }}
        />
      ),
    },
  ];
  const [activityType, setActityType] = useState<ActivityType>(
    activityTypes[0]
  );

  return (
    <div>
      <Tabs defaultValue={activityType.id} className="w-full">
        <TabsList>
          {activityTypes.map((activity) => (
            <TabsTrigger value={activity.id}>{activity.name}</TabsTrigger>
          ))}
        </TabsList>
        {activityTypes.map((activity) => (
          <TabsContent value={activity.id}>
            <div className="p-2">{activity.component}</div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default UserActivity;
