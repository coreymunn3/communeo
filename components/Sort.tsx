"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SORT_OPTIONS } from "@/CONSTANTS";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { SortOption } from "@/lib/types";

const Sort = ({
  sortOptions = SORT_OPTIONS,
  defaultSortOption,
}: {
  sortOptions?: SortOption[];
  defaultSortOption?: SortOption;
}) => {
  const [selectedSort, setSelectedSort] = useState(
    defaultSortOption || sortOptions[0]
  );
  const handleSortChange = (newVal: string) => {
    const selectedOption = sortOptions.find((opt) => opt.value === newVal)!;
    setSelectedSort(selectedOption);
  };
  return (
    <div className="mb-2">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            {selectedSort.label}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {sortOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => handleSortChange(opt.value)}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default Sort;
