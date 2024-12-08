import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { settingsFields } from "../utils/constants";
import { SettingsField } from "../utils/types";
import CustomDropdown from "./ui/custom-dropdown";
import CustomSlider from "./ui/custom-slider";

type SettingsProps = {
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

function Settings({ settingsSetup, handleSettingsUpdate }: SettingsProps) {
  function renderField(settingsField: SettingsField): React.JSX.Element {
    const currentValue = settingsSetup[settingsField.id];
    switch (settingsField.fieldType) {
      case "number":
        return (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={settingsField.id}>{settingsField.label}</Label>
            <Input
              id={settingsField.id}
              type="number"
              value={currentValue.number}
              placeholder={settingsField.defaultValue.toString()}
              onChange={(e) =>
                handleSettingsUpdate(settingsField.id, {
                  number: Number(e.target.value),
                })
              }
            />
          </div>
        );
      case "slider":
        return (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={settingsField.label}>{settingsField.label}</Label>
            <CustomSlider
              settingsField={settingsField}
              currentValue={currentValue.slider}
              handleSettingsUpdate={handleSettingsUpdate}
            />
          </div>
        );
      case "checkbox":
        return (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={settingsField.label}>{settingsField.label}</Label>
            <Checkbox
              id={settingsField.id}
              checked={currentValue.checkbox || false}
              onCheckedChange={(checked) =>
                handleSettingsUpdate(settingsField.id, {
                  checkbox: !!checked, // Convert to boolean
                })
              }
            />
          </div>
        );
      case "dropdown":
        return (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={settingsField.label}>{settingsField.label}</Label>
            <CustomDropdown
              settingsField={settingsField}
              currentValue={currentValue.dropdown}
              handleSettingsUpdate={handleSettingsUpdate}
            />
          </div>
        );
      default:
        return <>Invalid Field</>;
    }
  }
  return (
    <Card className="border-none rounded-none shadow-none text-2xl font-bold mb-6 text-center flex flex-col items-center">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription className="pt-5">
          <Button>Save Settings</Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 text-left text-sm gap-x-20 gap-y-2 align-middle w-full">
        {settingsFields.map((settingsField) => {
          return (
            <div key={settingsField.label}>{renderField(settingsField)}</div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default Settings;
