import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Spell } from "../sim_lib/spells";
import { RotationProps } from "../utils/types";
import RotationIcon from "./rotationIcon";

function Rotation({
  rotationSetup,
  handleRotationUpdate,
  resetRotation,
  classicMode,
  playerLevel,
  settingsSetup,
  runesSetup,
  gearSetup,
}: RotationProps) {
  const spellSections = [
    {
      title: "Abilities",
      filter: (spell: Spell) => {
        return !spell.buff && !spell.item;
      },
    },
    {
      title: "Buffs",
      filter: (spell: Spell) => {
        return spell.buff;
      },
    },
    {
      title: "Items",
      filter: (spell: Spell) => {
        return spell.item;
      },
    },
  ];

  function levelFilter(spell: Spell): boolean {
    const minLevel = spell.minlevel;
    if (!minLevel && minLevel !== 0) return true;
    if (spell.minlevel > playerLevel) return false;
    const maxLevel = spell.maxlevel;
    if (!maxLevel && maxLevel !== 0) return true;
    if (playerLevel > maxLevel) return false;
    return true;
  }

  function aqBooksFilter(spell: Spell): boolean {
    if (!spell.aq && spell.aq !== false) return true;
    return spell.aq === settingsSetup.aqbooks.checkbox;
  }

  function runesFilter(spell: Spell): boolean {
    if (!spell.rune) return true;

    for (const prop in runesSetup) {
      for (const val of runesSetup[prop]) {
        if (spell.id !== val.id) continue;
        return val.active;
      }
    }
    return true;
  }

  function gearFilter(spell: Spell): boolean {
    if (!spell.item) return true;

    for (const slot in gearSetup) {
      const gearPiece = gearSetup[slot];
      if (!gearPiece || gearPiece.id !== spell.id) continue;
      return true;
    }
    return false;
  }

  return (
    <Card className="border-none rounded-none shadow-none text-2xl font-bold mb-6 text-center flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-center">Gear</CardTitle>
        <div className="flex flex-col justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={resetRotation}>Reset Gear</Button>
            <Button>Save Gear</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="md:mx-32">
        {spellSections.map(({ title, filter }, index) => {
          return (
            <div className="pb-10" key={title + index.toString()}>
              <h1 className="text-center">{title}</h1>
              <div
                key={index.toString() + title}
                className="text-sm flex flex-wrap gap-4"
              >
                {rotationSetup
                  .filter((spell) =>
                    classicMode === "Classic" ? !spell.sod : true,
                  )
                  .filter(levelFilter)
                  .filter(aqBooksFilter)
                  .filter(filter)
                  .filter(runesFilter)
                  .filter(gearFilter)
                  .map((spell) => {
                    return spell ? (
                      <RotationIcon
                        key={spell.id}
                        spell={spell}
                        handleRotationUpdate={handleRotationUpdate}
                        spellStatus={spell.active ? spell.active : false}
                      />
                    ) : null;
                  })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default Rotation;
