import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GearSelection from "./gear/gearSelection";
import Settings from "./settings";
import Talents from "./talents";
import { useEffect, useState } from "react";
import { ClassicMode } from "../utils/types";
import {
  defaultTargetBaseArmor,
  gearSlotData,
  runeSlotData,
  tabs,
} from "../utils/constants";
import { warriorTalents } from "../utils/warriorTalents";
import Rotation from "./rotation";
import Buffs from "./buffs";
import { settingsFields } from "../utils/constants";
import { Buff, buffs } from "../sim_lib/buffs";
import { Gear } from "../sim_lib/gear";
import { Rune, runes } from "../sim_lib/runes";
import Runes from "./runes";
import { Spell, spells } from "../sim_lib/spells";

type CustomizeProps = {
  classicMode: ClassicMode;
};

function Customize({ classicMode }: CustomizeProps) {
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

  const handleRotationUpdate = (spellId: number, toggle: boolean) => {
    setRotationSetup((prev) =>
      prev.map((spell) => {
        return spell.id === spellId
          ? ({ ...spell, active: toggle } as Spell)
          : spell;
      }),
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

  useEffect(() => {
    console.log(rotationSetup);
  }, [rotationSetup]);
  return (
    <Tabs className="border-none" defaultValue="gear">
      <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 w-full rounded-none border-b">
        {tabs
          .filter(
            (tab) =>
              tab.classicMode === "Classic" || classicMode === tab.classicMode,
          )
          .map((tab) => (
            <TabsTrigger
              key={tab.tabValue}
              value={tab.tabValue}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground m-1"
            >
              {tab.tabLabel}
            </TabsTrigger>
          ))}
      </TabsList>
      <TabsContent value="gear">
        <GearSelection
          gearSetup={gearSetup}
          handleGearUpdate={handleGearUpdate}
          resetGear={resetGear}
        />
      </TabsContent>
      <TabsContent className="border-none" value="settings">
        <Settings
          settingsSetup={settingsSetup}
          handleSettingsUpdate={handleSettingsUpdate}
        />
      </TabsContent>
      <TabsContent className="border-none" value="talents">
        <Talents
          handleTalentPointUpdate={handleTalentPointUpdate}
          resetTalentPoints={resetTalentPoints}
          talentPointsRemaining={talentPointsRemaining}
          talentsSetup={talentsSetup}
        />
      </TabsContent>
      <TabsContent className="border-none" value="rotation">
        <Rotation
          classicMode={classicMode}
          playerLevel={settingsSetup.level.slider || 60}
          settingsSetup={settingsSetup}
          rotationSetup={rotationSetup}
          handleRotationUpdate={handleRotationUpdate}
          resetRotation={resetRotation}
          runesSetup={runesSetup}
          gearSetup={gearSetup}
        />
      </TabsContent>
      <TabsContent className="border-none" value="buffs">
        <Buffs
          classicMode={classicMode}
          playerLevel={settingsSetup.level.slider || 60}
          initTargetArmor={
            settingsSetup.targetbasearmor.number || defaultTargetBaseArmor
          }
          settingsSetup={settingsSetup}
          buffsSetup={buffsSetup}
          resetBuffs={resetBuffs}
          handleBuffUpdate={handleBuffUpdate}
          runesSetup={runesSetup}
        />
      </TabsContent>
      {classicMode === "Season of Discovery" && (
        <TabsContent className="border-none" value="runes">
          <Runes
            runesSetup={runesSetup}
            resetRunes={resetRunes}
            handleRunesUpdate={handleRunesUpdate}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}

export default Customize;
