import { Button } from "@/components/ui/button";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CircleArrowUpIcon,
  CircleArrowDownIcon,
} from "lucide-react";

interface UpvoteDownvoteButtonProps {
  type: "upvote" | "downvote";
  isActive: boolean;
  onClick: () => void;
}

const UpvoteDownvoteButton = ({
  type,
  isActive,
  onClick,
}: UpvoteDownvoteButtonProps) => {
  const Icon = type === "upvote" ? CircleArrowUpIcon : CircleArrowDownIcon;

  return (
    <Button
      variant={"ghost"}
      className={`p-2 rounded-full ${
        isActive
          ? "text-primary hover:text-primary"
          : "text-black dark:text-white"
      }`}
      onClick={onClick}
    >
      <Icon className="!w-6 !h-6" />
    </Button>
  );
};

export default UpvoteDownvoteButton;
