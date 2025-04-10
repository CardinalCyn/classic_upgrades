import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { runeSlotData } from "../utils/constants";
import RuneIcon from "./runeIcon";
import { RunesProps } from "../utils/types";
import CustomizeButtons from "./customizeButtons";

function Runes({ runesSetup, handleRunesUpdate, buttonFunctions }: RunesProps) {
  return (
    <Card className="border-none rounded-none shadow-none w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center">Warrior Runes</CardTitle>
        <CustomizeButtons
          sectionName="Runes"
          buttonFunctions={buttonFunctions}
        />
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 gap-2`}>
          {runeSlotData.map((slotName, slotIndex) => (
            <div key={slotName} className="text-center">
              <h3>
                {slotName.toString()[0].toUpperCase() +
                  slotName.toString().slice(1).toLowerCase()}
              </h3>
              <div className="flex items-center justify-center gap-2">
                {runesSetup[slotName].map((rune, runeIndex) => {
                  return rune ? (
                    <RuneIcon
                      key={`filled-'+${slotIndex}-${runeIndex}'`}
                      rune={rune}
                      runeStatus={rune.active}
                      updateruneSelection={handleRunesUpdate}
                      runeSlotName={slotName.toString()}
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
