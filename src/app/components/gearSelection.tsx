import { gearSlotData } from "../utils/constants";
import { GearSlot } from "./gearSlot";

export default function GearSelection() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Gear</h1>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-x-40 max-w-2xl">
          {gearSlotData.map((gearSlot) => {
            return <GearSlot key={gearSlot.slotName} gearSlot={gearSlot} />;
          })}
        </div>
      </div>
    </div>
  );
}
