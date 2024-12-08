"use client";

import { Button } from "@/components/ui/button";
import { ClassicMode } from "../utils/types";
import { cn } from "@/lib/utils";

type ClassicModeToggleProps = {
  classicMode: ClassicMode;
  setClassicMode: (mode: ClassicMode) => void;
};

export function ClassicModeToggle({
  classicMode,
  setClassicMode,
}: ClassicModeToggleProps) {
  return (
    <div className="flex">
      <Button
        onClick={() => setClassicMode("Season of Discovery")}
        className={cn(
          "text-sm font-medium transition-colors",
          classicMode === "Classic"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        )}
      >
        <span className="hidden md:inline">Season of Discovery</span>
        <span className="md:hidden">SoD</span>
      </Button>
      <Button
        onClick={() => setClassicMode("Classic")}
        className={cn(
          "text-sm font-medium transition-colors",
          classicMode === "Season of Discovery"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        )}
      >
        Classic
      </Button>
    </div>
  );
}
