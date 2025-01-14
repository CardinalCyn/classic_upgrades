import React from "react";
import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonFunctions } from "../utils/types";

type CustomizeButtonsProps = {
  sectionName: string;
  buttonFunctions: ButtonFunctions;
};

function CustomizeButtons({
  buttonFunctions,
  sectionName,
}: CustomizeButtonsProps) {
  return (
    <CardDescription className="pt-5 flex gap-4">
      <Button onClick={buttonFunctions.save}>Save {sectionName}</Button>
      <Button onClick={buttonFunctions.reset}>Reset {sectionName}</Button>
      <Button onClick={buttonFunctions.clear}>Clear {sectionName}</Button>
    </CardDescription>
  );
}

export default CustomizeButtons;
