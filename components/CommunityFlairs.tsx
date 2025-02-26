"use client";

import { CommunityFlair } from "@/lib/types";
import { Badge } from "./ui/badge";

const CommunityFlairs = ({ flairs }: { flairs: CommunityFlair[] }) => {
  return (
    <div className="flex space-x-2">
      {flairs.map((flair) => (
        <Badge
          key={flair.title}
          className="bg-primary/50 text-slate-600 dark:text-white"
        >
          {flair.title}
        </Badge>
      ))}
    </div>
  );
};
export default CommunityFlairs;
