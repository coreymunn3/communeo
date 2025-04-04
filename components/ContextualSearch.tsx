"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ContextualSearch = () => {
  const params: { slug?: string; username?: string } = useParams();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchValue.trim()) {
        if (params?.slug) {
          return router.push(
            `/search?community=${params.slug}&q=${searchValue}`
          );
        }
        if (params?.username) {
          return router.push(
            `/search?username=${params.username}&q=${searchValue}`
          );
        }
        return router.push(`/search?q=${searchValue}`);
      }
    }
  };

  const getPlaceholder = () => {
    let location = "communeo";
    if (params?.slug) location = params.slug;
    if (params?.username) location = params.username;
    return `Search posts in ${location}`;
  };

  return (
    <div className="relative w-full flex">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      </div>
      <Input
        type="text"
        id="contextual-search"
        placeholder={getPlaceholder()}
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="pl-10 border-none rounded-full flex-1 bg-slate-200 dark:bg-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400" // Add padding to the left to make space for the icon
      />
    </div>
  );
};

export default ContextualSearch;
