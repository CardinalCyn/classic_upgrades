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
    val: {
      checkbox?: boolean;
      number?: number;
      slider?: number;
      dropdown?: string;
    },
  ) => void;
};

function CustomDropdown({
  settingsField,
  currentValue,
  handleSettingsUpdate,
}: CustomDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{currentValue}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select {settingsField.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentValue}
          onValueChange={(pos) =>
            handleSettingsUpdate(settingsField.id, { dropdown: pos })
          }
        >
          {settingsField.dropdownValues.map((val) => {
            return (
              <DropdownMenuRadioItem
                key={val.dropdownLabel}
                value={val.dropdownLabel}
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
