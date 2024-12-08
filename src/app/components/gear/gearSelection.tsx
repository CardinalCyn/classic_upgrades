import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gearSlotData } from "../../utils/constants";
import { GearSlot } from "./gearSlot";
import { Gear } from "@/app/sim_lib/gear";

type GearSelectionProps = {
  gearSetup: { [key: string]: Gear | null };
  handleGearUpdate: (slotName: string, gearPiece: Gear) => void;
  resetGear: () => void;
};

export default function GearSelection({
  gearSetup,
  handleGearUpdate: updateGearSelection,
  resetGear,
}: GearSelectionProps) {
  return (
    <Card className="border-none rounded-none shadow-none text-2xl font-bold mb-6 text-center flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-center">Gear</CardTitle>
        <div className="flex flex-col justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={resetGear}>Reset Gear</Button>
            <Button>Save Gear</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Gear</h1>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-96 max-w-2xl">
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
