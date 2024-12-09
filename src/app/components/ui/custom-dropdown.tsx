"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownSettingField } from "@/app/utils/types";

type CustomDropdownProps = {
  settingsField: DropdownSettingField;
  currentValue: string | undefined;
  handleSettingsUpdate: (
    settingName: string,
    val: boolean | string | number,
  ) => void;
};

function CustomDropdown({
  settingsField,
  currentValue,
  handleSettingsUpdate,
}: CustomDropdownProps) {
  // Find the label for the current value
  const currentLabel =
    settingsField.dropdownValues.find(
      (val) => val.dropdownValue === currentValue,
    )?.dropdownLabel || currentValue;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{currentLabel}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select {settingsField.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentValue}
          onValueChange={(pos) => handleSettingsUpdate(settingsField.id, pos)}
        >
          {settingsField.dropdownValues.map((val) => {
            return (
              <DropdownMenuRadioItem
                key={val.dropdownLabel}
                value={val.dropdownValue.toString()}
              >
                {val.dropdownLabel}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CustomDropdown;
