"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CommunityRule } from "@/lib/types";
import { capitalizeEachWord } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

const CommunityRules = ({ rules }: { rules: CommunityRule[] }) => {
  // state for managing rule open closed
  const [isOpen, setIsOpen] = useState<boolean[]>(rules.map(() => false));

  // handler for opening and closing a rule state
  const toggleRule = (index: number) => {
    setIsOpen((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return rules.map((rule, index) => (
    <Collapsible
      key={rule.title}
      open={isOpen[index]}
      onOpenChange={() => toggleRule(index)}
    >
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between space-y-2">
          <p className="flex-1 text-left">{capitalizeEachWord(rule.title)}</p>
          <div className="transition-transform duration-200">
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-200 ${
                isOpen[index] ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="ml-2 mt-1 text-sm">{rule.description}</p>
      </CollapsibleContent>
    </Collapsible>
  ));
};
export default CommunityRules;
