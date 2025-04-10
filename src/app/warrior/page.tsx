"use client";

import React, { useContext, useState, useEffect, useCallback } from "react";
import GearStats from "../components/gear/gearStats";
import Customize from "../components/customize";
import {
  defaultTalentPointsRemaining,
  defaultTargetBaseArmor,
  getClearedSetup,
  getPlayerConfig,
  getTargetConfig,
  SetupConfig,
} from "../utils/constants";
import Navbar from "../components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassicModeContext } from "../providers/modeContext";
import { WarrSpell } from "../sim_lib/spells";
import { Buff, buffs } from "../sim_lib/buffs";
import { Gear } from "../sim_lib/gear";
import { Base, Player } from "../sim_lib/classes/player";
import {
  BuffsSetup,
  EnchantSetup,
  GearSetup,
  GetConfig,
  Report,
  RotationSetup,
  RunesSetup,
  SettingsSetup,
  TalentsSetup,
} from "../utils/types";
import { Talent, talents, TalentTreeItem } from "../sim_lib/talents";
import { Simulation, SimulationConfig } from "../sim_lib/classes/simulation";
import ErrorModal from "../components/errorModal";
import { Rune } from "../sim_lib/runes";
import { Enchant } from "../sim_lib/enchants";

function getSavedSetup(keyName: "rotation"): RotationSetup;
function getSavedSetup(keyName: "gear"): GearSetup;
function getSavedSetup(keyName: "runes"): RunesSetup;
function getSavedSetup(keyName: "settings"): SettingsSetup;
function getSavedSetup(
  keyName: "talents",
  talentPointsRemaining: number,
): TalentsSetup;
function getSavedSetup(keyName: "buffs"): BuffsSetup;
function getSavedSetup(keyName: "enchants"): EnchantSetup;
function getSavedSetup(
  keyName: keyof SetupConfig,
  talentPointsRemaining?: number,
): SetupConfig[keyof SetupConfig] {
  try {
    const savedSetup = localStorage.getItem(keyName);
    if (savedSetup) {
      const parsedSetup = JSON.parse(savedSetup);
      if (keyName !== "talents") return parsedSetup;
      const parsedTalentsSetup = parsedSetup as {
        talents: TalentTreeItem[];
        talentPointsRemaining: number;
      };
      for (
        let talentTreeIndex = 0;
        talentTreeIndex < talents.length;
        talentTreeIndex++
      ) {
        for (
          let talentIndex = 0;
          talentIndex < parsedTalentsSetup.talents[talentTreeIndex].t.length;
          talentIndex++
        ) {
          parsedTalentsSetup.talents[talentTreeIndex].t[talentIndex].aura =
            talents[talentTreeIndex].t[talentIndex].aura;
        }
      }
      return parsedTalentsSetup;
    }
    if (keyName === "talents" && talentPointsRemaining !== undefined) {
      return getClearedSetup(keyName, talentPointsRemaining);
    } else if (keyName === "talents") {
      throw new Error("talentPointsRemaining is required for talents setup");
    } else {
      switch (keyName) {
        case "rotation":
          return getClearedSetup("rotation");
        case "gear":
          return getClearedSetup("gear");
        case "runes":
          return getClearedSetup("runes");
        case "settings":
          return getClearedSetup("settings");
        case "buffs":
          return getClearedSetup("buffs");
        case "enchants":
          return getClearedSetup("enchants");
        default:
          throw new Error(`Unexpected keyName: ${keyName}`);
      }
    }
  } catch (err) {
    throw err;
  }
}

function Warrior(): React.JSX.Element {
  const [simulatedDPS, setSimulatedDPS] = useState(0);
  const [simulatedDPSError, setSimulatedDpsError] = useState("0");
  const { classicMode, setClassicMode } = useContext(ClassicModeContext);

  const [rotationSetup, setRotationSetup] = useState<WarrSpell[]>([]);

  const resetRotation = useCallback(() => {
    return getSavedSetup("rotation");
  }, []);

  const handleRotationUpdate = (
    spellId: number,
    updates: Partial<Pick<WarrSpell, keyof WarrSpell>>,
  ) => {
    setRotationSetup((prev) =>
      prev.map((spell) =>
        spell.id === spellId ? ({ ...spell, ...updates } as WarrSpell) : spell,
      ),
    );
  };

  const [gearSetup, setGearSetup] = useState<{
    [key: string]: Gear | null;
  }>({});

  const resetGear = useCallback(() => {
    setGearSetup(getSavedSetup("gear"));
    setEnchantSetup(getSavedSetup("enchants"));
  }, []);

  const handleGearUpdate = (slotName: string, gearPiece: Gear) => {
    setGearSetup((prev) => ({
      ...prev,
      [slotName]: gearPiece,
    }));
  };

  const [enchantSetup, setEnchantSetup] = useState<EnchantSetup>({});

  const handleEnchantUpdate = (slotName: string, enchant: Enchant) => {
    const isTempEnch = "temp" in enchant && enchant.temp;
    setEnchantSetup((prev) => {
      const [prevMain, prevTemp] = prev[slotName] || [null, null];
      console.log(isTempEnch);

      return {
        ...prev,
        [slotName]: isTempEnch ? [prevMain, enchant] : [enchant, prevTemp],
      };
    });
  };

  const [runesSetup, setRunesSetup] = useState<{
    [key: string]: (Rune & {
      active: boolean;
    })[];
  }>({});

  const resetRunes = useCallback(() => {
    setRunesSetup(getSavedSetup("runes"));
  }, []);

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

  const [settingsSetup, setSettingsSetup] = useState<{
    [settingsFieldName: string]: boolean | number | string;
  }>({});

  const resetSettings = () => {
    setSettingsSetup(getSavedSetup("settings"));
  };

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

  const [talentsSetup, setTalentsSetup] = useState<{
    talents: TalentTreeItem[];
    talentPointsRemaining: number;
  }>({ talents: [], talentPointsRemaining: settingsSetup.level as number });

  const resetTalents = useCallback(() => {
    setTalentsSetup(
      getSavedSetup(
        "talents",
        (settingsSetup.level as number) - 9 || defaultTalentPointsRemaining,
      ),
    );
  }, [settingsSetup.level]);

  const handleTalentPointUpdate = (
    talentToUpdateId: number,
    operation: "add" | "remove",
  ) => {
    setTalentsSetup(
      (prev: { talents: TalentTreeItem[]; talentPointsRemaining: number }) => {
        let talentPointsRemaining = prev.talentPointsRemaining;
        const updatedTalents = prev.talents.map((tree) => ({
          ...tree,
          t: tree.t.map((talent: Talent) => {
            if (talent.i !== talentToUpdateId) return talent;
            const maxPoints = talent.m;
            if (
              operation === "add" &&
              talent.c < maxPoints &&
              prev.talentPointsRemaining > 0
            ) {
              talentPointsRemaining--;
              return { ...talent, c: talent.c + 1 };
            } else if (operation === "remove" && talent.c > 0) {
              talentPointsRemaining++;
              return { ...talent, c: talent.c - 1 } as Talent;
            }
            return talent;
          }),
        }));

        return { talents: updatedTalents, talentPointsRemaining };
      },
    );
  };

  const [buffsSetup, setBuffsSetup] = useState<(Buff & { active: boolean })[]>(
    [],
  );

  const resetBuffs = useCallback(() => {
    setBuffsSetup(getSavedSetup("buffs"));
  }, []);

  const clearBuffs = () => {
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

  const [report, setReport] = useState<Report | undefined>(undefined);

  useEffect(() => {
    setRotationSetup(getSavedSetup("rotation"));
    setGearSetup(getSavedSetup("gear"));
    setRunesSetup(getSavedSetup("runes"));
    setSettingsSetup(getSavedSetup("settings"));
    setTalentsSetup(
      getSavedSetup(
        "talents",
        (settingsSetup.level as number) || defaultTalentPointsRemaining + 9,
      ),
    );
    setBuffsSetup(getSavedSetup("buffs"));
  }, [settingsSetup.level]);

  useEffect(() => {
    resetBuffs();
    resetGear();
    resetRotation();
    resetRunes();
    resetTalents();
  }, [
    classicMode,
    resetBuffs,
    resetRotation,
    resetGear,
    resetRunes,
    resetTalents,
  ]);

  function getFullConfig(): GetConfig {
    const playerConfig = getPlayerConfig(settingsSetup);
    const targetConfig = getTargetConfig(settingsSetup);
    return {
      mode: classicMode === "Classic" ? "classic" : "sod",
      playerConfig,
      targetConfig,
      talents: talentsSetup.talents,
      gear: gearSetup,
      buffs: buffsSetup,
      spells: rotationSetup,
      enchants: enchantSetup,
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
    try {
      const fullConfig = getFullConfig(); // Use the current state configuration
      const player = new Player(fullConfig, undefined, undefined, undefined);
      if (!player.mh) throw { message: "No Mainhand Weapon Selected" };
      console.log(player);
      const stats = Object.keys(player.stats).length
        ? player.stats
        : player.base;
      setCharacterStats(stats);
      const s = new Simulation(
        player,
        (report: Report) => {
          report.player = player.serializeStats();
          report.spread = s.spread;
          const mean = report.totaldmg / report.totalduration;
          setSimulatedDPS(mean);
          const s1 = report.sumdps,
            s2 = report.sumdps2,
            n = report.iterations;
          const varmean = (s2 - (s1 * s1) / n) / (n - 1) / n;
          const error = 1.97 * Math.sqrt(varmean);
          setSimulatedDpsError(error.toFixed(2));
          setReport(report);
          console.log("time: " + (report.endtime - report.starttime) / 1000);
        },
        () => {},
        getSimulationConfig(),
      );
      s.startAsync();
    } catch (err) {
      const errMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err && "message" in err
          ? (err as { message: string }).message
          : JSON.stringify(err);

      setErrorMessage(errMessage);
      setIsErrorModalOpen(true);
      throw err;
    }
  }

  const [characterStats, setCharacterStats] = useState<Base>(() => {
    const fullConfig = getFullConfig();
    const player = new Player(fullConfig, undefined, undefined, undefined);
    return Object.keys(player.stats).length ? player.stats : player.base;
  });

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="h-screen">
      <Navbar classicMode={classicMode} setClassicMode={setClassicMode} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pt-16 w-full h-screen ">
        <div className="w-full bg-primary-foreground">
          <Card className=" border-none rounded-none w-full bg-primary-foreground">
            <ErrorModal
              errorMessage={errorMessage}
              isOpen={isErrorModalOpen}
              onClose={() => setIsErrorModalOpen(false)}
            />
            <CardContent className="space-y-2 pt-6 flex flex-col items-center w-full rounded-none">
              <Button onClick={simulateDps}>Simulate</Button>
              <div className="flex items-center space-x-2">
                <span>
                  {simulatedDPS.toFixed(2)} DPS(±){simulatedDPSError}
                </span>
              </div>
            </CardContent>
          </Card>
          <GearStats characterStats={characterStats} />
        </div>
        <div className="col-span-2 w-full">
          <Customize
            classicMode={classicMode}
            rotationProps={{
              classicMode,
              gearSetup,
              handleRotationUpdate,
              playerLevel: (settingsSetup.level as number) || 60,
              buttonFunctions: {
                clear: () => setRotationSetup(getClearedSetup("rotation")),
                reset: resetRotation,
                save: () => {
                  localStorage.setItem(
                    "rotation",
                    JSON.stringify(rotationSetup),
                  );
                },
              },
              rotationSetup,
              runesSetup,
              settingsSetup,
            }}
            gearSelectionProps={{
              gearSetup,
              handleGearUpdate,
              buttonFunctions: {
                clear: () => {
                  setGearSetup(getClearedSetup("gear"));
                  setEnchantSetup(getClearedSetup("enchants"));
                },
                reset: resetGear,
                save: () => {
                  localStorage.setItem("gear", JSON.stringify(gearSetup));
                  localStorage.setItem(
                    "enchants",
                    JSON.stringify(enchantSetup),
                  );
                },
              },
              enchantSetup,
              handleEnchantUpdate,
            }}
            runesProps={{
              runesSetup,
              handleRunesUpdate,
              buttonFunctions: {
                clear: () => setRunesSetup(getClearedSetup("runes")),
                reset: resetRunes,
                save: () => {
                  localStorage.setItem("runes", JSON.stringify(runesSetup));
                },
              },
            }}
            settingsProps={{
              settingsSetup,
              handleSettingsUpdate,
              buttonFunctions: {
                clear: () => setSettingsSetup(getClearedSetup("settings")),
                reset: resetSettings,
                save: () => {
                  localStorage.setItem(
                    "settings",
                    JSON.stringify(settingsSetup),
                  );
                },
              },
            }}
            talentSelectionProps={{
              talentsSetup,
              handleTalentPointUpdate,
              buttonFunctions: {
                clear: () => {
                  setTalentsSetup(
                    getClearedSetup(
                      "talents",
                      (settingsSetup.level as number) - 9 ||
                        defaultTalentPointsRemaining,
                    ),
                  );
                },
                reset: resetTalents,
                save: () => {
                  localStorage.setItem("talents", JSON.stringify(talentsSetup));
                },
              },
            }}
            buffsProps={{
              buffsSetup,
              handleBuffUpdate,
              buttonFunctions: {
                reset: resetBuffs,
                clear: clearBuffs,
                save: () => {
                  localStorage.setItem("buffs", JSON.stringify(buffsSetup));
                },
              },
              classicMode,
              initTargetArmor:
                (settingsSetup.targetbasearmor as number) ||
                defaultTargetBaseArmor,
              playerLevel: (settingsSetup.level as number) || 60,
              runesSetup,
              settingsSetup,
            }}
            statsProps={{ report }}
          />
        </div>
      </div>
    </div>
  );
}

export default Warrior;
