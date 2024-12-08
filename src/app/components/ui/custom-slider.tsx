"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

type SettingsField = {
  id: string;
  label: string;
  defaultValue: number;
  minValue: number;
  maxValue: number;
};

type CustomSliderProps = {
  settingsField: SettingsField;
  currentValue: number | undefined;
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

export default function CustomSlider({
  settingsField,
  currentValue,
  handleSettingsUpdate,
}: CustomSliderProps) {
  return (
    <div className="flex items-center gap-4">
      <Slider
        id={settingsField.label}
        defaultValue={[settingsField.defaultValue]}
        value={[currentValue || settingsField.defaultValue]}
        min={settingsField.minValue}
        max={settingsField.maxValue}
        step={1}
        onValueChange={(values) =>
          handleSettingsUpdate(settingsField.id, {
            slider: Number(values[0]),
          })
        }
        className="flex-grow"
      />
      <span className="w-12 text-right font-mono text-sm">{currentValue}</span>
    </div>
  );
}
