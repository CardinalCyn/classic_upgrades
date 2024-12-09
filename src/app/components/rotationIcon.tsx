"use client";

import Image from "next/image";
import React, { useState } from "react";
import { imageDomain, WEB_DB_URL } from "../utils/constants";
import { Spell } from "../sim_lib/spells";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type BuffIconProps = {
  spell: Spell;
  handleRotationUpdate: (spellId: number, updates: Partial<Spell>) => void;
  spellStatus: boolean;
};

function RotationIcon({
  spell,
  handleRotationUpdate,
  spellStatus,
}: BuffIconProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localSpell, setLocalSpell] = useState<Spell>({ ...spell });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleInputChange = (key: keyof Spell, value: any) => {
    setLocalSpell((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    handleRotationUpdate(spell.id, localSpell);
    setIsDialogOpen(false);
  };

  const spellProperties = [
    { key: "priority", type: "number", label: "Priority" },
    {
      key: "expriority",
      type: "number",
      label: "Execute Priority",
    },
    {
      key: "active",
      label: "Enabled",
      type: "checkbox",
      condition: !spell.noactiveoption,
    },
    {
      key: "afterswing",
      label: "Use only after a swing reset",
      type: "checkbox",
    },
    {
      key: "minrageactive",
      label:
        spell.name === "Heroic Strike" ? "Queue when above" : "Use when above",
      type: "checkbox",
      subInput: {
        key: "minrage",
        label: "when above",
        type: "number",
        unit: "rage",
      },
    },
    {
      key: "maxrageactive",
      label: "Don't switch stance when above",
      type: "checkbox",
      subInput: { key: "maxrage", type: "number", unit: "rage" },
    },
    {
      key: "maincdactive",
      label: `Don't ${
        spell.name === "Heroic Strike" ? "queue" : "use"
      } if BT / MS cooldown shorter than`,
      type: "checkbox",
      subInput: { key: "maincd", type: "number", unit: "seconds" },
    },
    {
      key: "durationactive",
      label: "Only use every",
      type: "checkbox",
      subInput: { key: "duration", type: "number", unit: "seconds" },
    },
    {
      key: "unqueueactive",
      label: "Unqueue if below",
      type: "checkbox",
      subInput: {
        key: "unqueue",
        type: "number",
        unit: "rage before MH swing",
      },
    },
    {
      key: "exmacro",
      label: "Always queue when casting Execute",
      type: "checkbox",
    },
    {
      key: "timetostartactive",
      label: "Use",
      type: "checkbox",
      subInput: {
        key: "timetostart",
        type: "number",
        unit: "seconds from the start of the fight",
      },
    },
    {
      key: "timetoendactive",
      label: "Use",
      type: "checkbox",
      subInput: {
        key: "timetoend",
        type: "number",
        unit: "seconds from the end of the fight",
      },
    },
    {
      key: "priorityapactive",
      label: "Don't use if Attack Power is higher than",
      type: "checkbox",
      subInput: { key: "priorityap", type: "number" },
    },
    {
      key: "procblock",
      label: "Don't use rage until it procs",
      type: "checkbox",
    },
    {
      key: "rageblockactive",
      label: "Don't use rage below",
      type: "checkbox",
      subInput: { key: "rageblock", type: "number", unit: "rage" },
    },
    {
      key: "globalsactive",
      label: "Only use on first",
      type: "checkbox",
      subInput: { key: "globals", type: "number", unit: "globals" },
    },
    {
      key: "chargeblockactive",
      label: "Don't use rage below",
      type: "checkbox",
      subInput: { key: "chargeblock", type: "number", unit: "CbR charges" },
    },
    {
      key: "erageblockactive",
      label: "Don't use rage below (Execute Phase)",
      type: "checkbox",
      subInput: { key: "erageblock", type: "number", unit: "rage" },
    },
    {
      key: "echargeblockactive",
      label: "Don't use rage below (Execute Phase)",
      type: "checkbox",
      subInput: { key: "echargeblock", type: "number", unit: "CbR charges" },
    },
    { key: "alwaysheads", label: "Always heads", type: "checkbox" },
    { key: "alwaystails", label: "Always tails", type: "checkbox" },
    {
      key: "zerkerpriority",
      label: "Prioritize over Bloodrage",
      type: "checkbox",
    },
    {
      key: "resolve",
      label: "Only use if Defender's Resolve is not up",
      type: "checkbox",
    },
    {
      key: "swordboard",
      label: "Only use after a Sword & Board proc",
      type: "checkbox",
    },
    {
      key: "swingtimeractive",
      label: "Don't use if swing timer longer than",
      type: "checkbox",
      subInput: { key: "swingtimer", type: "number", unit: "secs" },
    },
  ];

  type SpellProp = (typeof spellProperties)[number];

  const renderSpellProperty = (prop: SpellProp) => {
    const key = prop.key as keyof typeof localSpell;
    const subInputKey = prop.subInput?.key as
      | keyof typeof localSpell
      | undefined;

    // Skip rendering if the main key or subInput key is undefined
    if (localSpell[key] === undefined) return null;

    // Special handling for properties with conditions
    if (prop.condition === false) return null;

    return (
      <div key={prop.key} className="flex items-center space-x-2 mb-2">
        {prop.type === "checkbox" ? (
          <Checkbox
            id={`${spell.id}-${prop.key}`}
            checked={localSpell[key] as boolean}
            onCheckedChange={(checked: boolean) =>
              handleInputChange(key, checked)
            }
          />
        ) : (
          <Input
            id={`${spell.id}-${prop.key}`}
            type={prop.type}
            value={localSpell[key] as string}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-20"
          />
        )}
        <Label htmlFor={`${spell.id}-${prop.key}`}>{prop.label}</Label>
        {prop.subInput && subInputKey && (
          <div className="flex items-center space-x-2">
            <Input
              id={`${spell.id}-${prop.subInput.key}`}
              type={prop.subInput.type}
              value={localSpell[subInputKey] as string}
              onChange={(e) => handleInputChange(subInputKey, e.target.value)}
              className="w-20"
              disabled={prop.type === "checkbox" && !localSpell[key]}
            />
            {prop.subInput.unit && <Label>{prop.subInput.unit}</Label>}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <a
        href={`${WEB_DB_URL}${spell.item ? "item" : "spell"}=${spell.id}`}
        onClick={handleClick}
      >
        <Image
          src={imageDomain + spell.iconname.toLowerCase() + `.jpg`}
          alt={spell.name}
          width={56}
          height={56}
          className={`${!spellStatus && "grayscale"}`}
        />
      </a>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{spell.name}</DialogTitle>
            <DialogDescription>
              Adjust the settings for this spell in your rotation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {spellProperties.map(renderSpellProperty)}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RotationIcon;
