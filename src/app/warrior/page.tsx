"use client";

import React, { useContext, useState, useEffect } from "react";
import GearStats from "../components/gear/gearStats";
import Customize from "../components/customize";
import { defaultTargetBaseArmor, equipmentStats } from "../utils/constants";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassicModeContext } from "../providers/modeContext";
import { Spell, spells } from "../sim_lib/spells";
import { settingsFields } from "../utils/constants";
import { Buff, buffs } from "../sim_lib/buffs";
import { Gear } from "../sim_lib/gear";
import { Rune, runes } from "../sim_lib/runes";
import { warriorTalents } from "../utils/warriorTalents";
import { gearSlotData, runeSlotData } from "../utils/constants";

function Warrior(): React.JSX.Element {
  const [simulatedDPS, setSimulatedDPS] = useState(0);
  const { classicMode, setClassicMode } = useContext(ClassicModeContext);

  function simulateDps() {
    setSimulatedDPS(Math.random());
  }

  const [rotationSetup, setRotationSetup] = useState<Spell[]>(
    spells.map((spell) => {
      spell.active = false;
      return spell;
    }),
  );

  const resetRotation = () => {
    setRotationSetup(
      spells.map((spell) => {
        return { ...spell };
      }),
    );
  };
  const handleRotationUpdate = (
    spellId: number,
    updates: Partial<Pick<Spell, keyof Spell>>,
  ) => {
    setRotationSetup((prev) =>
      prev.map((spell) =>
        spell.id === spellId ? ({ ...spell, ...updates } as Spell) : spell,
      ),
    );
  };

  const [gearSetup, setGearSetup] = useState<{
    [key: string]: Gear | null;
  }>(
    gearSlotData.reduce((acc, gearSlot) => {
      acc[gearSlot.gearJsSlotName] = null;
      return acc;
    }, {} as { [key: string]: Gear | null }),
  );

  const resetGear = () => {
    setGearSetup(
      gearSlotData.reduce((acc, gearSlot) => {
        acc[gearSlot.gearJsSlotName] = null;
        return acc;
      }, {} as { [key: string]: Gear | null }),
    );
  };

  const handleGearUpdate = (slotName: string, gearPiece: Gear) => {
    setGearSetup((prev) => ({
      ...prev,
      [slotName]: gearPiece,
    }));
  };

  const [talentsSetup, setTalentsSetup] = useState(
    warriorTalents.reduce((acc, talent) => {
      talent.t.forEach((t) => {
        acc[t.n] = 0;
      });
      return acc;
    }, {} as { [key: string]: number }),
  );

  const [runesSetup, setRunesSetup] = useState(
    runeSlotData.reduce((acc, runeSlotName) => {
      const mappedRunes: (Rune & { active: boolean })[] = runes[
        runeSlotName
      ].map((rune: Rune) => {
        return { ...rune, active: false };
      });
      acc[runeSlotName] = mappedRunes;
      return acc;
    }, {} as { [key: string]: (Rune & { active: boolean })[] }),
  );

  const resetRunes = () => {
    setRunesSetup(
      runeSlotData.reduce((acc, runeSlotName) => {
        const mappedRunes: (Rune & { active: boolean })[] = runes[
          runeSlotName
        ].map((rune: Rune) => {
          return { ...rune, active: false };
        });
        acc[runeSlotName] = mappedRunes;
        return acc;
      }, {} as { [key: string]: (Rune & { active: boolean })[] }),
    );
  };

  const handleRunesUpdate = (
    runeId: number,
    toggle: boolean,
    runeSlotName: string,
  ) => {
    setRunesSetup((prev) => ({
      ...prev,
      [runeSlotName]: prev[runeSlotName].map((rune) =>
        rune.id === runeId ? { ...rune, active: toggle } : rune,
      ),
    }));
  };

  const [talentPointsRemaining, setTalentPointsRemaining] = useState(51);

  const handleTalentPointUpdate = (
    talentName: string,
    operation: "add" | "remove",
  ) => {
    setTalentsSetup((prev) => ({
      ...prev,
      [talentName]:
        operation === "add"
          ? Math.min(
              (prev[talentName] || 0) + 1,
              warriorTalents
                .find((tree) => tree.t.some((t) => t.n === talentName))
                ?.t.find((t) => t.n === talentName)?.m || 0,
            )
          : Math.max((prev[talentName] || 0) - 1, 0),
    }));

    setTalentPointsRemaining((prev) =>
      operation === "add" ? prev - 1 : prev + 1,
    );
  };

  const resetTalentPoints = () => {
    setTalentPointsRemaining(51);
    setTalentsSetup(
      warriorTalents.reduce((acc, talent) => {
        talent.t.forEach((t) => {
          acc[t.n] = 0;
        });
        return acc;
      }, {} as { [key: string]: number }),
    );
  };

  const [settingsSetup, setSettingsSetup] = useState<{
    [settingsFieldName: string]: {
      checkbox?: boolean;
      number?: number;
      slider?: number;
      dropdown?: string;
    };
  }>(
    settingsFields.reduce((acc, settingsField) => {
      switch (settingsField.fieldType) {
        case "checkbox":
          acc[settingsField.id] = { checkbox: settingsField.defaultValue };
          break;
        case "number":
          acc[settingsField.id] = { number: settingsField.defaultValue };
          break;
        case "slider":
          acc[settingsField.id] = { slider: settingsField.defaultValue };
          break;
        case "dropdown":
          acc[settingsField.id] = {
            dropdown: settingsField.defaultDropdownValue,
          };
          break;
      }
      return acc;
    }, {} as { [key: string]: { checkbox?: boolean; number?: number; slider?: number; dropdown?: string } }),
  );

  const handleSettingsUpdate = (
    settingName: string,
    val: {
      checkbox?: boolean;
      number?: number;
      slider?: number;
      dropdown?: string;
    },
  ) => {
    setSettingsSetup((prev) => {
      if (settingName === "level") resetBuffs();
      return {
        ...prev,
        [settingName]: val,
      };
    });
  };

  const [buffsSetup, setBuffsSetup] = useState<(Buff & { active: boolean })[]>(
    buffs.map((buff) => {
      return { ...buff, active: false };
    }),
  );

  const resetBuffs = () => {
    setBuffsSetup(
      buffs.map((buff) => {
        return { ...buff, active: false };
      }),
    );
  };

  const handleBuffUpdate = (buffId: number, toggle: boolean) => {
    setBuffsSetup((prev) =>
      prev.map((buff) =>
        buff.id === buffId ? { ...buff, active: toggle } : buff,
      ),
    );
  };

  useEffect(() => {
    resetBuffs();
    resetGear();
    resetRotation();
    resetGear();
    resetRunes();
    resetTalentPoints();
  }, [settingsSetup, classicMode]);

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
          <Customize
            classicMode={classicMode}
            gearSelectionProps={{ gearSetup, handleGearUpdate, resetGear }}
            settingsProps={{ settingsSetup, handleSettingsUpdate }}
            talentSelectionProps={{
              talentsSetup,
              handleTalentPointUpdate,
              resetTalentPoints,
              talentPointsRemaining,
            }}
            buffsProps={{
              buffsSetup,
              handleBuffUpdate,
              resetBuffs,
              classicMode,
              initTargetArmor:
                settingsSetup.targetbasearmor.number || defaultTargetBaseArmor,
              playerLevel: settingsSetup.level.slider || 60,
              runesSetup,
              settingsSetup,
            }}
            rotationProps={{
              classicMode,
              gearSetup,
              handleRotationUpdate,
              playerLevel: settingsSetup.level.slider || 60,
              resetRotation,
              rotationSetup,
              runesSetup,
              settingsSetup,
            }}
            runesProps={{ runesSetup, handleRunesUpdate, resetRunes }}
          />
        </div>
      </div>
    </div>
  );
}

export default Warrior;
