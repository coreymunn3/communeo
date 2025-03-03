import { Button } from "@/components/ui/button";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

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
  const Icon = type === "upvote" ? ChevronUpIcon : ChevronDownIcon;

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`p-2 rounded-full ${
        isActive ? "bg-primary/50" : "bg-transparent"
      }`}
      onClick={onClick}
    >
      <Icon className="!w-6 !h-6" />
    </Button>
  );
};

export default UpvoteDownvoteButton;
