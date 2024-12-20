import { RuneSlot } from "../sim_lib/runes";
import {
  CheckboxSettingField,
  ClassicMode,
  DropdownSettingField,
  GearSlotData,
  NumberSettingField,
  PlayerConfig,
  Race,
  SettingsField,
  SliderSettingField,
  TargetConfig,
} from "./types";

export const gearSlotData: GearSlotData[] = [
  { slotName: "Head", imageName: "Head.jpg", gearJsSlotName: "head" },
  { slotName: "Hands", imageName: "Hands.jpg", gearJsSlotName: "hands" },
  { slotName: "Neck", imageName: "Neck.jpg", gearJsSlotName: "neck" },
  { slotName: "Waist", imageName: "Waist.jpg", gearJsSlotName: "waist" },
  {
    slotName: "Shoulders",
    imageName: "Shoulders.jpg",
    gearJsSlotName: "shoulder",
  },
  { slotName: "Legs", imageName: "Legs.jpg", gearJsSlotName: "legs" },
  { slotName: "Back", imageName: "Back.jpg", gearJsSlotName: "back" },
  { slotName: "Feet", imageName: "Feet.jpg", gearJsSlotName: "feet" },
  { slotName: "Chest", imageName: "Chest.jpg", gearJsSlotName: "chest" },
  { slotName: "Finger 1", imageName: "Finger.jpg", gearJsSlotName: "finger1" },
  { slotName: "Wrists", imageName: "Wrists.jpg", gearJsSlotName: "wrist" },

  { slotName: "Finger 2", imageName: "Finger.jpg", gearJsSlotName: "finger2" },
  {
    slotName: "Main Hand",
    imageName: "MainHand.jpg",
    gearJsSlotName: "mainhand",
  },
  {
    slotName: "Trinket 1",
    imageName: "Trinket.jpg",
    gearJsSlotName: "trinket1",
  },
  { slotName: "Off Hand", imageName: "OffHand.jpg", gearJsSlotName: "offhand" },
  {
    slotName: "Trinket 2",
    imageName: "Trinket.jpg",
    gearJsSlotName: "trinket2",
  },

  { slotName: "Ranged", imageName: "Ranged.jpg", gearJsSlotName: "ranged" },
];

export const classNames = ["Warrior", "Rogue"];

export const equipmentStats = [
  "Attack Power",
  "Strength",
  "Agility",
  "Hit",
  "Skill",
  "Miss",
  "Crit",
  "Crit Cap",
  "Dmg %",
  "Haste",
  "Sets",
] as const;

export const raceData = [
  {
    name: "Human",
    str: 120,
    agi: 80,
    sta: 110,
    int: 30,
    skill_0: 5,
    skill_1: 5,
    skill_2: 0,
    skill_3: 0,
  },
  {
    name: "Dwarf",
    str: 122,
    agi: 76,
    sta: 113,
    int: 29,
    skill_0: 0,
    skill_1: 0,
    skill_2: 0,
    skill_3: 0,
  },
  {
    name: "Gnome",
    str: 115,
    agi: 83,
    sta: 109,
    int: 35,
    skill_0: 0,
    skill_1: 0,
    skill_2: 0,
    skill_3: 0,
  },
  {
    name: "Night Elf",
    str: 117,
    agi: 85,
    sta: 109,
    int: 30,
    skill_0: 0,
    skill_1: 0,
    skill_2: 0,
    skill_3: 0,
  },
  {
    name: "Orc",
    str: 123,
    agi: 77,
    sta: 112,
    int: 27,
    skill_0: 0,
    skill_1: 0,
    skill_2: 0,
    skill_3: 5,
  },
  {
    name: "Tauren",
    str: 125,
    agi: 75,
    sta: 112,
    int: 25,
    skill_0: 0,
    skill_1: 0,
    skill_2: 0,
    skill_3: 0,
  },
  {
    name: "Troll",
    str: 121,
    agi: 82,
    sta: 111,
    int: 26,
    skill_0: 0,
    skill_1: 0,
    skill_2: 0,
    skill_3: 0,
  },
  {
    name: "Undead",
    str: 119,
    agi: 78,
    sta: 111,
    int: 28,
    skill_0: 0,
    skill_1: 0,
    skill_2: 0,
    skill_3: 0,
  },
];

export const races = [
  "Human",
  "Dwarf",
  "Gnome",
  "Night Elf",
  "Undead",
  "Orc",
  "Tauren",
  "Troll",
] as const;

export const imageDomain = "https://wow.zamimg.com/images/wow/icons/medium/";

export const WEB_DB_URL = "https://classic.wowhead.com/";

export const settingsFields: SettingsField[] = [
  {
    id: "level",
    label: "Level",
    fieldType: "slider",
    defaultValue: 60,
    minValue: 1,
    maxValue: 60,
  },
  {
    id: "targetlevel",
    label: "Target Level",
    fieldType: "slider",
    defaultValue: 63,
    minValue: 1,
    maxValue: 63,
  },
  {
    id: "race",
    label: "Race",
    fieldType: "dropdown",
    defaultDropdownValue: "Human",
    dropdownValues: races.map((raceName) => {
      return { dropdownLabel: raceName, dropdownValue: raceName };
    }),
  },
  {
    id: "simulations",
    label: "Simulations",
    fieldType: "number",
    defaultValue: 50000,
  },
  {
    id: "timesecsmin",
    label: "Fight Duration (min in seconds)",
    fieldType: "number",
    defaultValue: 50,
  },
  {
    id: "timesecsmax",
    label: "Fight Duration (max in seconds)",
    fieldType: "number",
    defaultValue: 60,
  },
  {
    id: "executeperc",
    label: "Execute Phase Percentage",
    fieldType: "number",
    defaultValue: 20,
  },
  {
    id: "startrage",
    label: "Initial Rage",
    fieldType: "number",
    defaultValue: 0,
  },
  {
    id: "targetresistance",
    label: "Target Magic Resistance",
    fieldType: "number",
    defaultValue: 24,
  },
  {
    id: "targetbasearmor",
    label: "Target Base Armor",
    fieldType: "number",
    defaultValue: 3731,
  },
  {
    id: "targetspeed",
    label: "Target Attack Speed",
    fieldType: "number",
    defaultValue: 0,
  },
  {
    id: "targetmindmg",
    label: "Target Min Damage",
    fieldType: "number",
    defaultValue: 200,
  },
  {
    id: "targetmaxdmg",
    label: "Target Max Damage",
    fieldType: "number",
    defaultValue: 300,
  },
  {
    id: "aqbooks",
    label: "AQ Books",
    fieldType: "checkbox",
    defaultValue: true,
  },
  {
    id: "batching",
    label: "Spell Batching",
    fieldType: "number",
    defaultValue: 10,
  },
  {
    id: "reactionmin",
    label: "Reaction Time (min)",
    fieldType: "number",
    defaultValue: 200,
  },
  {
    id: "reactionmax",
    label: "Reaction Time (max)",
    fieldType: "number",
    defaultValue: 300,
  },
  {
    id: "adjacent",
    label: "Adjacent Mobs",
    fieldType: "slider",
    defaultValue: 0,
    minValue: 0,
    maxValue: 3,
  },
  {
    id: "bleedreduction",
    label: "Bleed Reduction",
    fieldType: "dropdown",
    defaultDropdownValue: "0",
    dropdownValues: [
      { dropdownLabel: "None", dropdownValue: "1" },
      { dropdownLabel: "20%", dropdownValue: "0.8" },
      { dropdownLabel: "100%", dropdownValue: "0" },
    ],
  },
  {
    id: "spellqueueing",
    label: "Spell Queueing",
    fieldType: "checkbox",
    defaultValue: true,
  },
];

export const runeSlotData: RuneSlot[] = [
  "back",
  "chest",
  "feet",
  "hands",
  "head",
  "legs",
  "waist",
  "wrist",
];

export const tabs: {
  tabLabel: string;
  tabValue: string;
  classicMode: ClassicMode;
}[] = [
  { tabValue: "gear", tabLabel: "Gear", classicMode: "Classic" },
  { tabValue: "settings", tabLabel: "Settings", classicMode: "Classic" },
  { tabValue: "talents", tabLabel: "Talents", classicMode: "Classic" },
  { tabValue: "rotation", tabLabel: "Rotation", classicMode: "Classic" },
  { tabValue: "buffs", tabLabel: "Buffs", classicMode: "Classic" },
  { tabValue: "runes", tabLabel: "Runes", classicMode: "Season of Discovery" },
];

export const defaultTargetBaseArmor = 3731;

export const invalidBattleSquawkIds = [9923060, 9823060, 9723060, 9623060];

export const validBattleSquawkId = 23060;

export const gladiatorStanceId = 413479;

export const getPlayerConfig = (settingsSetup: {
  [settingsFieldName: string]: string | number | boolean;
}): PlayerConfig => {
  return {
    adjacent:
      settingsSetup.adjacent ||
      (settingsFields.find((field) => field.id === "adjacent") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "adjacent")!)
        ? (
            settingsFields.find(
              (field) => field.id === "adjacent",
            )! as SliderSettingField
          ).defaultValue
        : 0,
    aqbooks:
      settingsSetup.aqbooks ||
      (settingsFields.find((field) => field.id === "aqbooks") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "aqbooks")!)
        ? (
            settingsFields.find(
              (field) => field.id === "aqbooks",
            )! as CheckboxSettingField
          ).defaultValue
        : false,
    level:
      settingsSetup.level ||
      (settingsFields.find((field) => field.id === "level") &&
        "defaultValue" in settingsFields.find((field) => field.id === "level")!)
        ? (
            settingsFields.find(
              (field) => field.id === "level",
            )! as SliderSettingField
          ).defaultValue
        : 60,
    race:
      settingsSetup.race ||
      (settingsFields.find((field) => field.id === "race") &&
        "defaultDropdownValue" in
          settingsFields.find((field) => field.id === "race")!)
        ? ((
            settingsFields.find(
              (field) => field.id === "race",
            )! as DropdownSettingField
          ).defaultDropdownValue as Race)
        : "Human",
    reactionmax:
      settingsSetup.reactionmax ||
      (settingsFields.find((field) => field.id === "reactionmax") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "reactionmax")!)
        ? (
            settingsFields.find(
              (field) => field.id === "reactionmax",
            )! as NumberSettingField
          ).defaultValue
        : 60,
    reactionmin:
      settingsSetup.reactionmin ||
      (settingsFields.find((field) => field.id === "reactionmin") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "reactionmin")!)
        ? (
            settingsFields.find(
              (field) => field.id === "reactionmin",
            )! as NumberSettingField
          ).defaultValue
        : 60,
    spellqueueing:
      settingsSetup.spellqueueing ||
      (settingsFields.find((field) => field.id === "spellqueueing") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "spellqueueing")!)
        ? (
            settingsFields.find(
              (field) => field.id === "spellqueueing",
            )! as CheckboxSettingField
          ).defaultValue
        : false,
  };
};

export const getTargetConfig = (settingsSetup: {
  [settingsFieldName: string]: string | number | boolean;
}): TargetConfig => {
  const targetLevel =
    settingsSetup.targetlevel ||
    (settingsFields.find((field) => field.id === "targetlevel") &&
      "defaultValue" in
        settingsFields.find((field) => field.id === "targetlevel")!)
      ? (
          settingsFields.find(
            (field) => field.id === "targetlevel",
          )! as NumberSettingField
        ).defaultValue
      : 63;
  return {
    basearmor:
      settingsSetup.targetbasearmor ||
      (settingsFields.find((field) => field.id === "targetbasearmor") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "targetbasearmor")!)
        ? (
            settingsFields.find(
              (field) => field.id === "targetbasearmor",
            )! as NumberSettingField
          ).defaultValue
        : defaultTargetBaseArmor,
    bleedreduction:
      Number(settingsSetup.bleedreduction) ||
      (settingsFields.find((field) => field.id === "bleedreduction") &&
        "defaultDropdownValue" in
          settingsFields.find((field) => field.id === "bleedreduction")!)
        ? Number(
            (
              settingsFields.find(
                (field) => field.id === "bleedreduction",
              )! as DropdownSettingField
            ).defaultDropdownValue,
          )
        : Number("0"),
    defense: targetLevel * 5,
    maxdmg:
      settingsSetup.targetmaxdmg ||
      (settingsFields.find((field) => field.id === "targetmaxdmg") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "targetmaxdmg")!)
        ? (
            settingsFields.find(
              (field) => field.id === "targetmaxdmg",
            )! as NumberSettingField
          ).defaultValue
        : 300,
    mindmg:
      settingsSetup.targetmindmg ||
      (settingsFields.find((field) => field.id === "targetmindmg") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "targetmindmg")!)
        ? (
            settingsFields.find(
              (field) => field.id === "targetmindmg",
            )! as NumberSettingField
          ).defaultValue
        : 200,
    level: targetLevel,
    resistance:
      settingsSetup.targetresistance ||
      (settingsFields.find((field) => field.id === "targetresistance") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "targetresistance")!)
        ? (
            settingsFields.find(
              (field) => field.id === "targetresistance",
            )! as NumberSettingField
          ).defaultValue
        : 24,
    speed:
      settingsSetup.targetspeed ||
      (settingsFields.find((field) => field.id === "targetspeed") &&
        "defaultValue" in
          settingsFields.find((field) => field.id === "targetspeed")!)
        ? (
            settingsFields.find(
              (field) => field.id === "targetspeed",
            )! as NumberSettingField
          ).defaultValue
        : 24,
  };
};
