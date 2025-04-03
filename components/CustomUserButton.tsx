import { UserButton } from "@clerk/nextjs";
import { DotIcon, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

/* This page of docs shows how we can add a custom page
  Eventually, it might be good to have a help chat bot here so the user can ask how to use advanced features of the app
  https://clerk.com/docs/customization/user-button
*/

interface SafeUser {
  username: string;
  avatar_url: string;
}

const CustomUserButton = () => {
  // we need to figure out how to construct the link to the user's page.
  // so, we need this query to get the username of the logged in user
  const user = useQuery<SafeUser>({
    queryKey: ["uathenticated-user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      return res.json();
    },
  });

  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          href={`/u/${user.data?.username}`}
          label="View Your Page"
          labelIcon={<User className="h-4 w-4" />}
        />

        {/* re-order the default options */}
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  );
};
export default CustomUserButton;
