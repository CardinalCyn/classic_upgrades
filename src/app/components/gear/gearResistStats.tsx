import { Resist } from "@/app/sim_lib/classes/player";
import React from "react";

type GearResistStatsProps = {
  resist: Resist;
};

function GearResistStats({ resist }: GearResistStatsProps) {
  return (
    <div className="mt-6">
      <h2 className="text-center text-lg font-semibold text-secondary-foreground mb-2">
        Resistances
      </h2>
      <div className="space-y-1">
        {Object.entries(resist).map(([resistType, value]) => (
          <div key={resistType} className="flex justify-between py-1">
            <span className="capitalize">{resistType}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GearResistStats;
