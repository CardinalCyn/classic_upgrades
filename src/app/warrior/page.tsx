"use client";

import React, { useContext, useState, useEffect } from "react";
import GearStats from "../components/gear/gearStats";
import Customize from "../components/customize";
import {
  defaultTargetBaseArmor,
  getPlayerConfig,
  getTargetConfig,
} from "../utils/constants";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassicModeContext } from "../providers/modeContext";
import { Spell, spells } from "../sim_lib/spells";
import { settingsFields } from "../utils/constants";
import { Buff, buffs } from "../sim_lib/buffs";
import { Gear } from "../sim_lib/gear";
import { Rune, runes } from "../sim_lib/runes";
import { gearSlotData, runeSlotData } from "../utils/constants";
import { Base, Player } from "../sim_lib/classes/player";
import { GetConfig, Report } from "../utils/types";
import { Talent, talents, TalentTreeItem } from "../sim_lib/talents";
import {
  SimulationConfig,
  SimulationStartParams,
  SimulationWorkerParallel,
} from "../sim_lib/classes/simulation";

function Warrior(): React.JSX.Element {
  const [simulatedDPS, setSimulatedDPS] = useState(0);
  const { classicMode, setClassicMode } = useContext(ClassicModeContext);

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

  const [talentsSetup, setTalentsSetup] = useState<TalentTreeItem[]>(
    talents.map((tree) => ({
      ...tree,
      t: tree.t.map((talent) => ({ ...talent, c: 0 })),
    })),
  );

  const [talentPointsRemaining, setTalentPointsRemaining] = useState(51);

  const handleTalentPointUpdate = (
    talentToUpdateId: number,
    operation: "add" | "remove",
  ) => {
    setTalentsSetup((prev: TalentTreeItem[]) => {
      const updatedTalents = prev.map((tree) => ({
        ...tree,
        t: tree.t.map((talent: Talent) => {
          if (talent.i !== talentToUpdateId) return talent;
          const maxPoints = talent.m;

          if (
            operation === "add" &&
            talent.c < maxPoints &&
            talentPointsRemaining > 0
          ) {
            return { ...talent, c: talent.c + 1 };
          } else if (operation === "remove" && talent.c > 0) {
            return { ...talent, c: talent.c - 1 };
          }
          return talent;
        }),
      }));

      return updatedTalents;
    });

    // Separate state update for talent points
    if (operation === "add" && talentPointsRemaining > 0) {
      setTalentPointsRemaining((prev) => prev - 1);
    } else if (operation === "remove") {
      setTalentPointsRemaining((prev) => prev + 1);
    }
  };

  const resetTalentPoints = () => {
    setTalentPointsRemaining(51);
    setTalentsSetup(
      talents.map((tree) => ({
        ...tree,
        t: tree.t.map((talent) => ({ ...talent, c: 0 })),
      })),
    );
  };

  const [settingsSetup, setSettingsSetup] = useState<{
    [settingsFieldName: string]: boolean | number | string;
  }>(
    settingsFields.reduce((acc, settingsField) => {
      switch (settingsField.fieldType) {
        case "dropdown":
          acc[settingsField.id] = settingsField.defaultDropdownValue;
          break;
        default:
          acc[settingsField.id] = settingsField.defaultValue;
      }
      return acc;
    }, {} as { [key: string]: boolean | number | string }),
  );

  const handleSettingsUpdate = (
    settingName: string,
    val: boolean | string | number,
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

  function getFullConfig(): GetConfig {
    const playerConfig = getPlayerConfig(settingsSetup);
    const targetConfig = getTargetConfig(settingsSetup);
    return {
      mode: classicMode === "Classic" ? "classic" : "sod",
      playerConfig,
      targetConfig,
      talents: talentsSetup,
      gear: gearSetup,
      buffs: buffsSetup,
      spells: rotationSetup,
    };
  }
  function getSimulationConfig(): SimulationConfig {
    return {
      batching: settingsSetup.batching as number,
      executeperc: settingsSetup.executeperc as number,
      iterations: settingsSetup.simulations as number,
      startrage: settingsSetup.startrage as number,
      timesecsmax: settingsSetup.timesecsmax as number,
      timesecsmin: settingsSetup.timesecsmin as number,
    };
  }

  function simulateDps() {
    const fullConfig = getFullConfig(); // Use the current state configuration
    const player = new Player(fullConfig, undefined, undefined, undefined);
    const stats = Object.keys(player.stats).length ? player.stats : player.base;
    setCharacterStats(stats);
    const MAX_WORKERS = ~~Math.min(8, (navigator.hardwareConcurrency || 8) / 2);
    const sim = new SimulationWorkerParallel(
      MAX_WORKERS,
      (report: Report) => {
        console.log(report);
        const mean = report.totaldmg / report.totalduration;
        setSimulatedDPS(mean);
        const s1 = report.sumdps,
          s2 = report.sumdps2,
          n = report.iterations;
        const varmean = (s2 - (s1 * s1) / n) / (n - 1) / n;
        const err = (1.96 * Math.sqrt(varmean)).toFixed(2);
        const time = (report.endtime - report.starttime) / 1000;
        const mindps = report.mindps.toFixed(2);
        const maxdps = report.maxdps.toFixed(2);
        const res = {
          mean,
          err,
          time,
          mindps,
          maxdps,
        };
        console.log(res);
      },
      (iteration: number, report: Report) => {
        const perc = parseInt(
          (Number(iteration / report.iterations) * 100).toString(),
        );
        console.log(perc);
      },
      (error: unknown) => {
        console.error(error);
      },
    );
    const params: SimulationStartParams = {
      sim: getSimulationConfig(),
      fullReport: true,
      player: [
        undefined,
        undefined,
        undefined,
        { ...getPlayerConfig(settingsSetup), target: player.target },
      ],
      globals: {
        buffs: buffsSetup.map((buff) => buff.id),
        enchant: {},
        rotation: rotationSetup,
        runes: {},
        sod: classicMode === "Season of Discovery",
        talents: talentsSetup,
      },
    };
    console.log("starting sim page.tsx");
    console.log(sim);
    sim.start(params);
  }

  const [characterStats, setCharacterStats] = useState<Base>(() => {
    const fullConfig = getFullConfig();
    const player = new Player(fullConfig, undefined, undefined, undefined);
    return Object.keys(player.stats).length ? player.stats : player.base;
  });

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
          <GearStats characterStats={characterStats} />
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
                (settingsSetup.targetbasearmor as number) ||
                defaultTargetBaseArmor,
              playerLevel: (settingsSetup.level as number) || 60,
              runesSetup,
              settingsSetup,
            }}
            rotationProps={{
              classicMode,
              gearSetup,
              handleRotationUpdate,
              playerLevel: (settingsSetup.level as number) || 60,
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
