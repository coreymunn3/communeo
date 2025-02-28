"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateCommunityDialog from "./CreateCommunityDialog";

const Header = () => {
  const [createCommunityOpen, setCreateCommunityOpen] = useState(false);
  const handleCloseForm = () => setCreateCommunityOpen(false);

  return (
    <div className="px-4 py-2 flex justify-between items-center bg-slate-100 dark:bg-slate-800">
      {/* brand logo */}
      <Link href={"/"}>
        <p className="text-xl font-bold tracking-widest text-primary">
          Communeo
        </p>
        <hr className="border border-primary mb-[2px]"></hr>
        <p className="text-xs tracking-tighter text-slate-800/70 dark:text-white/50">
          A Space for the Community
        </p>
      </Link>
      {/* Log In / User Avatar */}
      <div className="flex items-center space-x-2">
        <DarkModeToggle />
        <SignedIn>
          {/* button to quickly create a post */}
          <Button variant={"ghost"}>
            <Plus />
            Post
          </Button>
          {/* button to quickly create a community */}
          <Button
            variant={"ghost"}
            onClick={() => setCreateCommunityOpen(true)}
          >
            <Plus />
            Community
          </Button>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>
      {/* Dialog to create a new community */}
      <CreateCommunityDialog
        open={createCommunityOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
};
export default Header;
