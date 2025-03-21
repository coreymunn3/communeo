import {
  getCommentsByUserId,
  getPostsByUserId,
  getUserFromUsername,
} from "@/lib/queries";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserActivity from "@/components/UserActivity";

interface UserPageProps {
  params: {
    username: string;
  };
}
const UserPage = async ({ params }: UserPageProps) => {
  const { username } = params;
  /**
   * Layout:
   * left 2/3 = banner, posts & comments (selector to determine which to view), then all of those rendered in a list
   * right 1/3 user statistics -
   *    All Time posts, total comments, total upvotes - downvotes on all posts/comments (karma) (all with a sparkline chart to show over time)
   *    Last 1 year posts, comments, karma
   * created date of account
   * link to moderation controls
   */
  const user = await getUserFromUsername(username);

  if (!user) {
    notFound();
  }

  if (user) {
    console.log(user);
    // get the user's initial posts and comments
    const initialUserPosts = await getPostsByUserId(user.id);
    const initialUserComments = await getCommentsByUserId(user.id);

    return (
      <div className="flex flex-col-reverse md:flex-row">
        {/* left seciton - user info and posts/comments window */}
        <div className="md:w-2/3 flex flex-col space-y-8">
          {/* top - big user avatar and name */}
          <div className="flex items-center space-x-4">
            <div>
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-4xl font-semibold tracking-wide">
                {user.username}
              </p>
              <p className="text-slate-500 dark:text-slate-400">{`/u/${user.username}`}</p>
            </div>
          </div>
          {/* selecter to determine what you want to see from this user */}
          <UserActivity
            user={user}
            initialPosts={initialUserPosts}
            initialComments={initialUserComments}
          />
        </div>
        {/* right section - user stats */}
        <div className="md:w-1/3 bg-slate-100 dark:bg-slate-900 rounded-lg p-4 text-slate-600 dark:text-slate-400"></div>
      </div>
    );
  }
};

export default UserPage;
