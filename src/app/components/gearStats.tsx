import React from "react";
import { equipmentStats } from "../utils/constants";

type GearStatsProps = {
  gearStats: {
    statName: (typeof equipmentStats)[number];
    statValue: number;
  }[];
};

function GearStats({ gearStats }: GearStatsProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-6 space-y-2 border border-gray-200 shadow-sm">
      <h1 className="text-center text-xl font-semibold text-gray-800 mb-4">
        Character Stats
      </h1>
      {gearStats.map((stat, index) => (
        <div
          key={index}
          className="flex justify-between py-1 border-b border-gray-300 last:border-b-0"
        >
          <span className="text-gray-600 capitalize">{stat.statName}</span>
          <span className="font-medium text-gray-800">{stat.statValue}</span>
        </div>
      ))}
    </div>
  );
}

export default GearStats;
