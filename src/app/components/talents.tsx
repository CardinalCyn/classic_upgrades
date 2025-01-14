import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TalentIcon from "./talentIcon";
import { TalentsProps } from "../utils/types";
import { Talent, talents } from "../sim_lib/talents";
import CustomizeButtons from "./customizeButtons";

function Talents({
  talentsSetup,
  handleTalentPointUpdate,
  buttonFunctions,
}: TalentsProps) {
  return (
    <Card className="border-none rounded-none shadow-none text-2xl font-bold mb-6 text-center flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-center">Warrior Talents</CardTitle>
        <CardDescription className="text-center">
          Talent Points Remaining: {talentsSetup.talentPointsRemaining}
        </CardDescription>
        <CustomizeButtons
          sectionName="Talents"
          buttonFunctions={buttonFunctions}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {talents.map((talentTree, treeIndex) => (
            <div key={talentTree.n} className="border rounded p-2">
              <h3 className="text-lg font-semibold mb-2">{talentTree.n}</h3>
              <div className="grid grid-rows-7 grid-cols-4 gap-2">
                {[...Array(7)].map((_, rowIndex) =>
                  [...Array(4)].map((_, colIndex) => {
                    const talent: Talent | undefined = talentsSetup.talents[
                      treeIndex
                    ].t.find((t) => t.x === colIndex && t.y === rowIndex);
                    return talent ? (
                      <TalentIcon
                        key={`${treeIndex}-${talent.n}`}
                        talent={talent}
                        currentCount={talent.c || 0}
                        talentPointsRemaining={
                          talentsSetup.talentPointsRemaining
                        }
                        onAddPoint={() =>
                          handleTalentPointUpdate(talent.i, "add")
                        }
                        onRemovePoint={() =>
                          handleTalentPointUpdate(talent.i, "remove")
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
