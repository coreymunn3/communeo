"use client";

import UpvoteDownvoteButton from "./UpvoteDownvoteButton";

interface VoteControlsProps {
  handleUpvote: () => void;
  handleDownvote: () => void;
  userVoteValue: number;
  totalVoteValue: number;
  emphasize?: boolean;
}

const VoteControls = ({
  userVoteValue,
  totalVoteValue,
  handleUpvote,
  handleDownvote,
  emphasize,
}: VoteControlsProps) => {
  return (
    <div
      className={`flex ${
        emphasize ? "bg-slate-100 dark:bg-slate-900" : ""
      } rounded-full items-center`}
    >
      <UpvoteDownvoteButton
        type="upvote"
        isActive={userVoteValue > 0}
        onClick={handleUpvote}
      />
      <span className="mx-1 min-w-4 text-center text-sm">{totalVoteValue}</span>
      <UpvoteDownvoteButton
        type="downvote"
        isActive={userVoteValue < 0}
        onClick={handleDownvote}
      />
    </div>
  );
};
export default VoteControls;
