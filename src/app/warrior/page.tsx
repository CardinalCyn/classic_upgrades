"use client";

import React, { useContext, useState } from "react";
import GearStats from "../components/gear/gearStats";
import Customize from "../components/customize";
import { equipmentStats } from "../utils/constants";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassicModeContext } from "../providers/modeContext";

function Warrior(): React.JSX.Element {
  const [simulatedDPS, setSimulatedDPS] = useState(0);
  const { classicMode, setClassicMode } = useContext(ClassicModeContext);

  function simulateDps() {
    setSimulatedDPS(Math.random());
  }

  return (
    <div className="h-screen">
      <Navbar classicMode={classicMode} setClassicMode={setClassicMode} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pt-16 w-full h-screen ">
        <div className="w-full bg-primary-foreground">
          <Card className=" border-none rounded-none w-full bg-primary-foreground">
            <CardContent className="space-y-2 pt-6 flex flex-col items-center w-full rounded-none">
              <Button onClick={simulateDps}>Simulate</Button>
              <div className="flex items-center space-x-2">
                <span>{simulatedDPS} DPS(±)150</span>
              </div>
            </CardContent>
          </Card>
          <GearStats
            gearStats={equipmentStats.map((stat) => {
              return { statName: stat, statValue: 0 };
            })}
          />
        </div>
        <div className="col-span-2 w-full">
          <Customize classicMode={classicMode} />
        </div>
      </div>
    </div>
  );
}

export default Warrior;
