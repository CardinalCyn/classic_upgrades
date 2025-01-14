import { Buff } from "../sim_lib/buffs";
import { Gear } from "../sim_lib/gear";
import { Rune } from "../sim_lib/runes";
import { Spell } from "../sim_lib/spells";
import { TalentTreeItem } from "../sim_lib/talents";
import { races } from "./constants";

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
  buttonFunctions: ButtonFunctions;
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
  buttonFunctions: ButtonFunctions;
};

export type TalentsProps = {
  talentsSetup: { talents: TalentTreeItem[]; talentPointsRemaining: number };
  handleTalentPointUpdate: (
    talentToUpdateId: number,
    operation: "add" | "remove",
  ) => void;
  buttonFunctions: ButtonFunctions;
};

export type RotationProps = {
  classicMode: ClassicMode;
  playerLevel: number;
  settingsSetup: SettingsSetup;
  rotationSetup: Spell[];
  handleRotationUpdate: (spellId: number, updates: Partial<Spell>) => void;
  buttonFunctions: ButtonFunctions;
  runesSetup: { [key: string]: (Rune & { active: boolean })[] };
  gearSetup: { [key: string]: Gear | null };
};

export type BuffsProps = {
  classicMode: ClassicMode;
  playerLevel: number;
  initTargetArmor: number;
  buffsSetup: (Buff & { active: boolean })[];
  buttonFunctions: ButtonFunctions;
  handleBuffUpdate: (buffId: number, toggle: boolean) => void;
  settingsSetup: SettingsSetup;
  runesSetup: { [key: string]: (Rune & { active: boolean })[] };
};

export type ButtonFunctions = {
  clear: () => void;
  reset: () => void;
  save: () => void;
};

export type RunesProps = {
  runesSetup: { [key: string]: (Rune & { active: boolean })[] };
  handleRunesUpdate: (
    runeId: number,
    toggle: boolean,
    runeSlotName: string,
  ) => void;
  buttonFunctions: ButtonFunctions;
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
  talents: TalentTreeItem[];
  gear: { [key: string]: Gear | null };
  buffs: (Buff & { active: boolean })[];
  spells: Spell[];
};

export type Report = {
  endtime: number;
  iterations: number;
  maxdps: number;
  mindps: number;
  starttime: number;
  sumdps: number;
  sumdps2: number;
  totaldmg: number;
  totalduration: number;
};
