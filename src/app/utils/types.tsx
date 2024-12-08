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
