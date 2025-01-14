"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Buff,
  buffs,
  exposedArmorId,
  improvedExposedArmorId,
  leaderOfThePackId,
  sebaciousId,
} from "../sim_lib/buffs";
import BuffIcon from "./buffIcon";
import { BuffsProps } from "../utils/types";
import { gladiatorStanceId } from "../utils/constants";
import CustomizeButtons from "./customizeButtons";

function Buffs({
  classicMode,
  playerLevel,
  initTargetArmor,
  buffsSetup,
  buttonFunctions,
  handleBuffUpdate: handleBuffUpdate,
  settingsSetup,
  runesSetup,
}: BuffsProps) {
  const [targetArmor, setTargetArmor] = useState(initTargetArmor);
  useEffect(() => {
    let armor = initTargetArmor;
    const improvedExposedArmorActive = buffsSetup.some(
      (buff) => buff.id === improvedExposedArmorId && buff.active,
    );

    for (const buff of buffsSetup) {
      if (!buff.active || !buff.armor || typeof buff.armor !== "number")
        continue;

      if (buff.id === exposedArmorId || buff.id === sebaciousId) {
        armor -= improvedExposedArmorActive ? 1.5 * buff.armor : buff.armor;
      } else if (buff.armor) {
        armor -= buff.armor;
      }
    }

    setTargetArmor(Math.max(armor, 0));
  }, [buffsSetup, setTargetArmor, initTargetArmor]);

  const buffSections = [
    {
      title: "Raid Buffs",
      filter: (buff: Buff) =>
        (buff.group &&
          [
            "motw",
            "trueshot",
            "kings",
            "blessingmight",
            "windfury",
            "graceair",
            "strengthearth",
          ].includes(buff.group)) ||
        buff.motwmod ||
        buff.mightmod ||
        buff.id === leaderOfThePackId,
    },
    {
      title: "World Buffs",
      filter: (buff: Buff) => buff.worldbuff,
    },
    {
      title: "Consumables",
      filter: (buff: Buff) => buff.consume,
    },
    {
      title: "Other",
      filter: (buff: Buff) => buff.other,
    },
    {
      title: `Target Armor: ${targetArmor}`,
      filter: (buff: Buff) => {
        return (
          (buff.group && ["sunder", "faerie", "reck"].includes(buff.group)) ||
          buff.id === improvedExposedArmorId
        );
      },
    },
    {
      title: "Stances",
      filter: (buff: Buff) => {
        return (
          buff.group === "stance" &&
          (!buff.rune ||
            runesSetup.feet.find(
              (rune) => rune.id === gladiatorStanceId && rune.active === true,
            ))
        );
      },
    },
    {
      title: "Specializations",
      filter: (buff: Buff) => {
        return buff.skill;
      },
    },
  ];

  function runesFilter(buff: Buff): boolean {
    if (!buff.rune) return true;

    for (const prop in runesSetup) {
      for (const val of runesSetup[prop]) {
        if (buff.id !== val.id) continue;
        return val.active;
      }
    }

    return true;
  }

  function levelFilter(buff: Buff): boolean {
    const minLevel = buff.minlevel;
    if (!minLevel && minLevel !== 0) return true;
    if (buff.minlevel > playerLevel) return false;
    const maxLevel = buff.maxlevel;
    if (!maxLevel && maxLevel !== 0) return true;
    if (playerLevel > maxLevel) return false;
    return true;
  }

  function aqBooksFilter(buff: Buff): boolean {
    if (!buff.aq && buff.aq !== false) return true;
    return buff.aq === settingsSetup.aqbooks;
  }

  return (
    <Card className="border-none rounded-none shadow-none text-2xl font-bold mb-6 text-center flex flex-col items-center">
      <CardHeader>
        <CardTitle>Buffs</CardTitle>
        <CustomizeButtons
          sectionName="Buffs"
          buttonFunctions={buttonFunctions}
        />
      </CardHeader>
      <CardContent className="md:mx-32">
        {buffSections.map(({ title, filter }, index) => (
          <div className="pb-10" key={title + index.toString()}>
            <h1 className="text-center">{title}</h1>
            <div
              key={index.toString() + title}
              className="text-sm flex flex-wrap gap-4"
            >
              {buffs
                .filter((buff) =>
                  classicMode === "Classic" ? !buff.sod : true,
                )
                .filter(runesFilter)
                .filter(levelFilter)
                .filter(aqBooksFilter)
                .filter(filter)
                .map((buff) => {
                  const foundBuff = buffsSetup.find(
                    (buffSetupVal) => buff.id === buffSetupVal.id,
                  );
                  return foundBuff ? (
                    <BuffIcon
                      key={buff.id}
                      buff={foundBuff}
                      handleBuffUpdate={handleBuffUpdate}
                      buffStatus={foundBuff.active}
                    />
                  ) : null;
                })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default Buffs;
