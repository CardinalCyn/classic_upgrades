import { equipmentStats } from "./constants";

export type GearStat = {
  statName: (typeof equipmentStats)[number]; // An array of stat names
  statValue: number;
};

export type GearSlotData = {
  slotName: string;
  imageName: string;
  gearJsSlotName: string | null;
};

export type GearItem = {
  imageId: string | number | undefined;
  name: string;
};
