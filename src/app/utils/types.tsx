import { Buff } from "../sim_lib/buffs";
import { Gear } from "../sim_lib/gear";
import { Rune } from "../sim_lib/runes";
import { Spell } from "../sim_lib/spells";
import { equipmentStats, races } from "./constants";

export type GearStat = {
  statName: (typeof equipmentStats)[number]; // An array of stat names
  statValue: number;
};

export type GearSlotData = {
  slotName: string;
  imageName: string;
  gearJsSlotName: string;
};

export type ClassicMode = "Season of Discovery" | "Classic";

export type GearItem = {
  imageId: string | number | undefined;
  name: string;
};

export type DropdownSettingField = {
  id: string;
  label: string;
  fieldType: "dropdown";
  defaultDropdownValue: string;
  dropdownValues: { dropdownLabel: string; dropdownValue: string }[];
};

export type SettingsField =
  | {
      id: string;
      label: string;
      fieldType: "number";
      defaultValue: number;
    }
  | {
      id: string;
      label: string;
      fieldType: "slider";
      defaultValue: number;
      minValue: number;
      maxValue: number;
    }
  | {
      id: string;
      label: string;
      fieldType: "checkbox";
      defaultValue: boolean;
    }
  | DropdownSettingField;

export type Race = (typeof races)[number];

export type GearSelectionProps = {
  gearSetup: { [key: string]: Gear | null };
  handleGearUpdate: (slotName: string, gearPiece: Gear) => void;
  resetGear: () => void;
};

export type SettingsProps = {
  settingsSetup: {
    [key: string]: {
      checkbox?: boolean;
      number?: number;
      slider?: number;
      dropdown?: string;
    };
  };
  handleSettingsUpdate: (
    settingName: string,
    val: {
      checkbox?: boolean;
      number?: number;
      slider?: number;
      dropdown?: string;
    },
  ) => void;
};

export type TalentsProps = {
  talentsSetup: { [key: string]: number };
  handleTalentPointUpdate: (
    talentName: string,
    operation: "add" | "remove",
  ) => void;
  resetTalentPoints: () => void;
  talentPointsRemaining: number;
};

export type RotationProps = {
  classicMode: ClassicMode;
  playerLevel: number;
  settingsSetup: {
    [settingsFieldName: string]: {
      checkbox?: boolean;
      number?: number;
      slider?: number;
      dropdown?: string;
    };
  };
  rotationSetup: Spell[];
  handleRotationUpdate: (spellId: number, updates: Partial<Spell>) => void;
  resetRotation: () => void;
  runesSetup: { [key: string]: (Rune & { active: boolean })[] };
  gearSetup: { [key: string]: Gear | null };
};

export type BuffsProps = {
  classicMode: ClassicMode;
  playerLevel: number;
  initTargetArmor: number;
  buffsSetup: (Buff & { active: boolean })[];
  resetBuffs: () => void;
  handleBuffUpdate: (buffId: number, toggle: boolean) => void;
  settingsSetup: {
    [settingsFieldName: string]: {
      checkbox?: boolean;
      number?: number;
      slider?: number;
      dropdown?: string;
    };
  };
  runesSetup: { [key: string]: (Rune & { active: boolean })[] };
};

export type RunesProps = {
  runesSetup: { [key: string]: (Rune & { active: boolean })[] };
  handleRunesUpdate: (
    runeId: number,
    toggle: boolean,
    runeSlotName: string,
  ) => void;
  resetRunes: () => void;
};
