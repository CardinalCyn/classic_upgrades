import { gearSlotData } from "../../utils/constants";
import { GearSlot } from "./gearSlot";
import { Gear } from "@/app/sim_lib/gear";

type GearSelectionProps = {
  gearSetup: { [key: string]: Gear | null };
  updateGearSelection: (slotName: string, gearPiece: Gear) => void;
};

export default function GearSelection({
  gearSetup,
  updateGearSelection,
}: GearSelectionProps) {
  return (
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
  );
}
