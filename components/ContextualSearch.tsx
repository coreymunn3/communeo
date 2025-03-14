"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ContextualSearch = () => {
  const params = useParams();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchValue.trim()) {
        router.push(`/search?q=${searchValue}`);
      }
      // to do, execute search
      // guard, trim text and don't advance if empty string
      // navigate to the /search?q='search term'
      // in that page, pull out the url params and do a query with prisma to get all posts with that term in the title or content
      // maybe theres
    }
  };

  const placeholder = `Search posts ${
    params?.slug ? "in " + params.slug : "in communeo"
  }`;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      </div>
      <Input
        type="text"
        id="contextual-search"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="pl-10 border-none rounded-full min-w-[400px] bg-slate-200 dark:bg-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400" // Add padding to the left to make space for the icon
      />
    </div>
  );
};

export default ContextualSearch;
