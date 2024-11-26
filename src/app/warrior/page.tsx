import React from "react";
import GearStats from "../components/gearStats";
import Customize from "../components/customize";
import { equipmentStats } from "../utils/constants";
import Navbar from "../components/navbar";

function Warrior(): React.JSX.Element {
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-3 gap-6 p-24">
        <GearStats
          gearStats={equipmentStats.map((stat) => {
            return { statName: stat, statValue: 0 };
          })}
        />
        <div className="col-span-2">
          <Customize />
        </div>
      </div>
    </div>
  );
}

export default Warrior;
