import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gearSlotData } from "../../utils/constants";
import { GearSlot } from "./gearSlot";
import { GearSelectionProps } from "@/app/utils/types";
import CustomizeButtons from "../customizeButtons";

export default function GearSelection({
  gearSetup,
  handleGearUpdate: updateGearSelection,
  buttonFunctions,
}: GearSelectionProps) {
  return (
    <Card className="border-none rounded-none shadow-none text-2xl font-bold mb-6 text-center flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-center">Gear</CardTitle>
        <CustomizeButtons
          sectionName="Gear"
          buttonFunctions={buttonFunctions}
        />
      </CardHeader>
      <CardContent>
        <div className="container mx-auto p-4">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-48 max-w-2xl">
              {gearSlotData.map((gearSlot) => {
                return (
                  <GearSlot
                    key={gearSlot.slotName}
                    gearSlot={gearSlot}
                    selectedGear={gearSetup[gearSlot.gearJsSlotName]}
                    updateGearSelection={updateGearSelection}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
