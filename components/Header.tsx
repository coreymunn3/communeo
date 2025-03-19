"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { Button } from "./ui/button";
import { MenuIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import CreateCommunityDialog from "./CreateCommunityDialog";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAppContext } from "@/context/AppContext";
import ContextualSearch from "./ContextualSearch";
import CreatePostDialog from "./CreatePostDialog";

const Header = () => {
  const {
    createCommunityOpen,
    setCreateCommunityOpen,
    createPostOpen,
    setCreatePostOpen,
  } = useAppContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleCloseCommunity = () => setCreateCommunityOpen(false);
  const handleClosePost = () => setCreatePostOpen(false);

  const CreatePostButton = () => {
    return (
      <Button variant={"ghost"} onClick={() => setCreatePostOpen(true)}>
        <Plus />
        Post
      </Button>
    );
  };

  const CreateCommunityButton = () => {
    return (
      <Button variant={"ghost"} onClick={() => setCreateCommunityOpen(true)}>
        <Plus />
        Community
      </Button>
    );
  };

  return (
    <div className="px-4 py-2 flex justify-between items-center">
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
      {/* Search Bar */}
      <div className="hidden md:flex w-[400px]">
        <ContextualSearch />
      </div>
      {/* show the buttons on larger screens */}
      <div className="hidden md:flex items-center space-x-2">
        <DarkModeToggle />
        <SignedIn>
          <CreatePostButton />
          <CreateCommunityButton />
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>

      {/* Hamburger Menu for smaller screens */}
      <div className="md:hidden flex items-center space-x-2">
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <SheetTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className="w-[80%]">
              <div className=" flex flex-col p-4 space-y-2">
                <ContextualSearch />
                <CreatePostButton />
                <CreateCommunityButton />
                <DarkModeToggle />
              </div>
            </SheetContent>
          </SignedIn>
        </Sheet>
        <UserButton />
      </div>

      {/* Dialog to create a new community */}
      <CreateCommunityDialog
        open={createCommunityOpen}
        onClose={handleCloseCommunity}
      />

      <CreatePostDialog open={createPostOpen} onClose={handleClosePost} />
    </div>
  );
};
export default Header;
