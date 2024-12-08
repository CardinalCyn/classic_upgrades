// components/GearSlot.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import GearSelectModal from "./gearSlotModal";
import { GearSlotData } from "../../utils/types";
import { imageDomain, WEB_DB_URL } from "../../utils/constants";
import { Gear } from "@/app/sim_lib/gear";

interface GearSlotProps {
  gearSlot: GearSlotData;
  selectedGear: Gear | null;
  updateGearSelection: (slotName: string, gearPiece: Gear) => void;
}

export function GearSlot({
  gearSlot,
  selectedGear,
  updateGearSelection,
}: GearSlotProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openGearSelectModal() {
    setIsModalOpen(true);
  }

  function handleSelectGear(gear: Gear) {
    updateGearSelection(gearSlot.gearJsSlotName, gear);
    setIsModalOpen(false);
  }

  return (
    <>
      <div className="grid grid-cols-2 items-center p-2 rounded-lg">
        <div
          className="relative w-12 h-12 flex items-center justify-center rounded-full mb-2"
          onClick={openGearSelectModal}
        >
          <a href={selectedGear ? `${WEB_DB_URL}item=${selectedGear.id}` : ""}>
            <Image
              src={
                selectedGear?.p
                  ? imageDomain + selectedGear?.p + ".jpg"
                  : `/images/gearSlotIcons/${gearSlot.imageName}`
              }
              alt={`${gearSlot.slotName} icon`}
              width={56}
              height={56}
              className="object-contain min-w-[56px] min-h-[56px] w-14 h-14"
              onClick={(e) => e.preventDefault()}
            />
          </a>
        </div>
        <div className="flex flex-col">
          <span>{selectedGear ? selectedGear.name : gearSlot.slotName}</span>
        </div>
      </div>

      <GearSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectGear={handleSelectGear}
        gearSlot={gearSlot}
      />
    </>
  );
}
