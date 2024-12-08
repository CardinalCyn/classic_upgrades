import React from "react";
import { equipmentStats } from "@/app/utils/constants";

type GearStatsProps = {
  gearStats: {
    statName: (typeof equipmentStats)[number];
    statValue: number;
  }[];
};

function GearStats({ gearStats }: GearStatsProps) {
  return (
    <div className="bg-primary-foreground p-6 space-y-2">
      <h1 className="text-center text-xl font-semibold text-secondary-foreground mb-4">
        Character Stats
      </h1>
      {gearStats.map((stat, index) => (
        <div key={index} className="flex justify-between py-1 last:border-b-0">
          <span className=" capitalize">{stat.statName}</span>
          <span className="font-medium">{stat.statValue}</span>
        </div>
      ))}
    </div>
  );
}

export default GearStats;
