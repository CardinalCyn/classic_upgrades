import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { warriorTalents } from "../utils/warriorTalents";
import TalentIcon from "./talentIcon";
import { TalentsProps } from "../utils/types";

function Talents({
  talentsSetup,
  handleTalentPointUpdate,
  resetTalentPoints,
  talentPointsRemaining,
}: TalentsProps) {
  return (
    <Card className="border-none rounded-none shadow-none text-2xl font-bold mb-6 text-center flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-center">Warrior Talents</CardTitle>
        <div className="flex flex-col justify-between items-center">
          <p>Talent Points Remaining: {talentPointsRemaining}</p>
          <div className="flex gap-2">
            <Button onClick={resetTalentPoints}>Reset Talents</Button>
            <Button>Save Talents</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warriorTalents.map((talentTree, treeIndex) => (
            <div key={talentTree.n} className="border rounded p-2">
              <h3 className="text-lg font-semibold mb-2">{talentTree.n}</h3>
              <div className="grid grid-rows-7 grid-cols-4 gap-2">
                {[...Array(7)].map((_, rowIndex) =>
                  [...Array(4)].map((_, colIndex) => {
                    const talent = talentTree.t.find(
                      (t) => t.x === colIndex && t.y === rowIndex,
                    );
                    return talent ? (
                      <TalentIcon
                        key={`${treeIndex}-${talent.n}`}
                        talent={talent}
                        currentCount={talentsSetup[talent.n] || 0}
                        talentPointsRemaining={talentPointsRemaining}
                        onAddPoint={() =>
                          handleTalentPointUpdate(talent.n, "add")
                        }
                        onRemovePoint={() =>
                          handleTalentPointUpdate(talent.n, "remove")
                        }
                      />
                    ) : (
                      <div key={`empty-${rowIndex}-${colIndex}`} />
                    );
                  }),
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Talents;
