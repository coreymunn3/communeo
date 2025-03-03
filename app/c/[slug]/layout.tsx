import React from "react";

const CommunityPageLayour = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-h-screen max-w-6xl mx-auto mt-12 p-4">
      <div className="container mx-auto flex flex-col space-y-2">
        {children}
      </div>
    </div>
  );
};
export default CommunityPageLayour;
