// components/GearSlot.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import GearSelectModal from "./gearSlotModal";
import { GearItem, GearSlotData } from "../utils/types";
import { imageDomain } from "../utils/constants";

interface GearSlotProps {
  gearSlot: GearSlotData;
}

export function GearSlot({ gearSlot }: GearSlotProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null);

  function openGearSelectModal() {
    setIsModalOpen(true);
  }

  function handleSelectGear(gear: GearItem) {
    setSelectedGear(gear);
  }

  useEffect(() => {
    console.log(selectedGear);
  }, [selectedGear]);

  return (
    <>
      <div className="flex items-center p-2 rounded-lg">
        <div
          className="relative w-12 h-12 flex items-center justify-center rounded-full mb-2"
          onClick={openGearSelectModal}
        >
          <Image
            src={
              selectedGear?.imageId
                ? imageDomain + selectedGear?.imageId + ".jpg"
                : `/images/gearSlotIcons/${gearSlot.imageName}`
            }
            alt={`${gearSlot.slotName} icon`}
            width={56}
            height={56}
            className="object-contain min-w-[56px] min-h-[56px] w-14 h-14" // Added minimum size classes
          />
        </div>
        <div className="flex flex-col">
          <span>{selectedGear ? selectedGear.name : ""}</span>
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
