import { Button } from "@/components/ui/button";
import { CircleArrowUpIcon, CircleArrowDownIcon } from "lucide-react";

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
      variant={isActive ? "default" : "ghost"}
      className="p-2 rounded-full"
      onClick={onClick}
    >
      <Icon className="!w-6 !h-6" />
    </Button>
  );
};

export default UpvoteDownvoteButton;
