import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rune } from "../sim_lib/runes";
import { runeSlotData } from "../utils/constants";
import RuneIcon from "./runeIcon";

type RunesProps = {
  runesSetup: { [key: string]: (Rune & { active: boolean })[] };
  handleRunesUpdate: (
    runeId: number,
    toggle: boolean,
    runeSlotName: string,
  ) => void;
  resetRunes: () => void;
};

function Runes({ runesSetup, handleRunesUpdate, resetRunes }: RunesProps) {
  return (
    <Card className="border-none rounded-none shadow-none w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center">Warrior Runes</CardTitle>
        <div className="flex flex-col justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={resetRunes}>Reset Runes</Button>
            <Button>Save Runes</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 gap-2`}>
          {runeSlotData.map((slotName, slotIndex) => (
            <div key={slotName} className="text-center">
              <h3>{slotName[0].toUpperCase() + slotName.slice(1)}</h3>
              <div className="flex items-center justify-center gap-2">
                {runesSetup[slotName].map((rune, runeIndex) => {
                  return rune ? (
                    <RuneIcon
                      key={`filled-'+${slotIndex}-${runeIndex}'`}
                      rune={rune}
                      runeStatus={rune.active}
                      updateruneSelection={handleRunesUpdate}
                      runeSlotName={slotName}
                    />
                  ) : (
                    <div key={`empty-${slotIndex}-${runeIndex}`} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Runes;
