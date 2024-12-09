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

export type NumberSettingField = {
  id: string;
  label: string;
  fieldType: "number";
  defaultValue: number;
};

export type SliderSettingField = {
  id: string;
  label: string;
  fieldType: "slider";
  defaultValue: number;
  minValue: number;
  maxValue: number;
};

export type CheckboxSettingField = {
  id: string;
  label: string;
  fieldType: "checkbox";
  defaultValue: boolean;
};

export type SettingsField =
  | NumberSettingField
  | SliderSettingField
  | CheckboxSettingField
  | DropdownSettingField;

export type Race = (typeof races)[number];

export type GearSelectionProps = {
  gearSetup: { [key: string]: Gear | null };
  handleGearUpdate: (slotName: string, gearPiece: Gear) => void;
  resetGear: () => void;
};

type SettingsSetup = {
  [key: string]: boolean | number | string;
};

export type SettingsProps = {
  settingsSetup: SettingsSetup;
  handleSettingsUpdate: (
    settingName: string,
    val: boolean | number | string,
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
  settingsSetup: SettingsSetup;
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
  settingsSetup: SettingsSetup;
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

export type TargetConfig = {
  level: number;
  basearmor: number;
  defense: number;
  resistance: number;
  speed: number;
  mindmg: number;
  maxdmg: number;
  bleedreduction: number;
};
export type PlayerConfig = {
  level: number;
  race: Race;
  aqbooks: boolean;
  reactionmin: number;
  reactionmax: number;
  adjacent: number;
  spellqueueing: boolean;
};

export type GetConfig = {
  mode: "classic" | "sod";
  playerConfig: PlayerConfig;
  targetConfig: TargetConfig;
  talents: { [key: string]: number };
  gear: { [key: string]: Gear | null };
};
