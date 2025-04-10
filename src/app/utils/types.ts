import { Buff } from "../sim_lib/buffs";
import { Aura, Spell } from "../sim_lib/classes/spell";
import { Weapon } from "../sim_lib/classes/weapon";
import { Enchant } from "../sim_lib/enchants";
import { Gear } from "../sim_lib/gear";
import { Rune } from "../sim_lib/runes";
import { WarrSpell } from "../sim_lib/spells";
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

export type RotationSetup = WarrSpell[];
export type GearSetup = { [key: string]: Gear | null };
export type RunesSetup = {
  [key: string]: (Rune & { active: boolean })[];
};
export type SettingsSetup = {
  [key: string]: boolean | number | string;
};
export type TalentsSetup = {
  talents: TalentTreeItem[];
  talentPointsRemaining: number;
};
export type BuffsSetup = (Buff & { active: boolean })[];
export type EnchantSetup = { [key: string]: [Enchant | null, Enchant | null] };
export type GearSelectionProps = {
  gearSetup: GearSetup;
  handleGearUpdate: (slotName: string, gearPiece: Gear) => void;
  buttonFunctions: ButtonFunctions;
  enchantSetup: EnchantSetup;
  handleEnchantUpdate: (slotName: string, enchant: Enchant) => void;
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
  talentsSetup: TalentsSetup;
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
  rotationSetup: RotationSetup;
  handleRotationUpdate: (spellId: number, updates: Partial<WarrSpell>) => void;
  buttonFunctions: ButtonFunctions;
  runesSetup: RunesSetup;
  gearSetup: GearSetup;
};

export type BuffsProps = {
  classicMode: ClassicMode;
  playerLevel: number;
  initTargetArmor: number;
  buffsSetup: BuffsSetup;
  buttonFunctions: ButtonFunctions;
  handleBuffUpdate: (buffId: number, toggle: boolean) => void;
  settingsSetup: SettingsSetup;
  runesSetup: RunesSetup;
};

export type ButtonFunctions = {
  clear: () => void;
  reset: () => void;
  save: () => void;
};

export type RunesProps = {
  runesSetup: RunesSetup;
  handleRunesUpdate: (
    runeId: number,
    toggle: boolean,
    runeSlotName: string,
  ) => void;
  buttonFunctions: ButtonFunctions;
};

export type StatsProps = {
  report: Report | undefined;
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
  player: {
    auras: { [key: string]: Aura };
    spells: { [key: string]: Spell };
    mh: Weapon;
    oh: Weapon | null;
    bloodsurge?: boolean;
  };
  spread: {
    [key: number]: number;
  };
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
  misschance?: number;
  mitigation?: number;
  binaryresist?: number;
  dodge?: number;
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
  gear: GearSetup;
  enchants: EnchantSetup;
  buffs: (Buff & { active: boolean })[];
  spells: RotationSetup;
};
