// components/GearSlot.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import GearSelectModal from "./gearSlotModal";
import { GearSlotData } from "../../utils/types";
import { imageDomain, WEB_DB_URL } from "../../utils/constants";
import { Gear } from "@/app/sim_lib/gear";
import EnchantSlot from "../enchantSlot";
import { Enchant, enchants } from "@/app/sim_lib/enchants";

interface GearSlotProps {
  gearSlot: GearSlotData;
  selectedGear: Gear | null;
  handleGearUpdate: (slotName: string, gearPiece: Gear) => void;
  handleEnchantUpdate: (slotName: string, enchant: Enchant) => void;
  selectedEnchants: [Enchant | null, Enchant | null];
}

export function GearSlot({
  gearSlot,
  selectedGear,
  handleGearUpdate,
  handleEnchantUpdate,
  selectedEnchants,
}: GearSlotProps): React.JSX.Element {
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);

  function openGearSelectModal() {
    setIsGearModalOpen(true);
  }

  function handleSelectGear(gear: Gear) {
    handleGearUpdate(gearSlot.gearJsSlotName, gear);
    setIsGearModalOpen(false);
  }

  return (
    <>
      <div className="grid grid-cols-2 items-center p-2 rounded-lg">
        <div
          className="relative w-12 h-12 flex items-center justify-center rounded-full mb-2"
          onClick={openGearSelectModal}
        >
          <a
            href={
              selectedGear
                ? `${WEB_DB_URL}item=${selectedGear.id}${
                    selectedEnchants[0]
                      ? `?ench=${selectedEnchants[0].ench}`
                      : ""
                  }`
                : ""
            }
          >
            <Image
              src={
                selectedGear?.p
                  ? imageDomain + selectedGear?.p + ".jpg"
                  : `/images/gearSlotIcons/${gearSlot.imageName}`
              }
              alt={`${gearSlot.slotName} icon`}
              width={30}
              height={30}
              className="object-contain min-w-[30px] min-h-[30px] w-14 h-14"
              onClick={(e) => e.preventDefault()}
            />
          </a>
        </div>
        <div className="flex flex-col text-sm">
          <span onClick={openGearSelectModal}>
            {selectedGear ? selectedGear.name : gearSlot.slotName}
          </span>
          {gearSlot.gearJsSlotName in enchants && (
            <EnchantSlot
              gearSlotName={gearSlot.gearJsSlotName}
              selectedEnchants={selectedEnchants}
              handleEnchantUpdate={handleEnchantUpdate}
            />
          )}
        </div>
      </div>

      <GearSelectModal
        isOpen={isGearModalOpen}
        onClose={() => setIsGearModalOpen(false)}
        onSelectGear={handleSelectGear}
        gearSlot={gearSlot}
      />
    </>
  );
}
