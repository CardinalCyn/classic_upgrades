import React from "react";
import { Base } from "@/app/sim_lib/classes/player";
import { characterStatsMap } from "@/app/utils/constants";
import GearResistStats from "./gearResistStats";

type GearStatsProps = {
  characterStats: Base;
};

function GearStats({ characterStats }: GearStatsProps) {
  return (
    <div className="bg-primary-foreground p-6 space-y-2">
      <h1 className="text-center text-xl font-semibold text-secondary-foreground mb-4">
        Character Stats
      </h1>
      {Object.keys(characterStats)
        .map((charStatProp) => {
          const statValue =
            characterStats[charStatProp as keyof typeof characterStats];
          const foundStatLabel = characterStatsMap.find(
            (st) => st.statValue === charStatProp,
          )?.statLabel;
          return statValue !== undefined &&
            charStatProp !== "resist" &&
            foundStatLabel
            ? {
                statLabel: foundStatLabel,
                statValue: statValue,
              }
            : null;
        })
        .filter(Boolean)
        .map((stat, index) => {
          if (typeof stat?.statValue === "object") return;
          const value = Number(stat?.statValue);

          return (
            <div
              key={index}
              className="flex justify-between py-1 last:border-b-0"
            >
              <span className="capitalize">{stat?.statLabel}</span>
              <span className="font-medium">
                {Math.round(value * 100) / 100}
              </span>
            </div>
          );
        })}
      {characterStats.resist && (
        <GearResistStats resist={characterStats.resist} />
      )}
    </div>
  );
}

export default GearStats;
