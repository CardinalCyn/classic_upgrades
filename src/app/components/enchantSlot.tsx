"use client";

import React, { useState } from "react";
import { Enchant } from "../sim_lib/enchants";
import EnchantModal from "./enchantModal";

type EnchantSlotProps = {
  selectedEnchants: [Enchant | null, Enchant | null];
  gearSlotName: string;
  handleEnchantUpdate: (slotName: string, enchant: Enchant) => void;
};

function EnchantSlot({
  gearSlotName,
  selectedEnchants,
  handleEnchantUpdate,
}: EnchantSlotProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTempModalOpen, setIsTempModalOpen] = useState(false);

  function handleSelectEnchant(enchant: Enchant) {
    handleEnchantUpdate(gearSlotName, enchant);
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col">
      <div>
        <div onClick={() => setIsModalOpen(true)}>
          {selectedEnchants && selectedEnchants.length
            ? selectedEnchants[0]?.name
              ? selectedEnchants[0].name
              : "No Enchant"
            : "No Enchant"}
        </div>
        <EnchantModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          gearSlotName={gearSlotName}
          onSelectEnchant={handleSelectEnchant}
          isTemp={false}
        />
      </div>
      {(gearSlotName === "mainhand" ||
        gearSlotName === "offhand" ||
        gearSlotName === "twohand") && (
        <div>
          <div onClick={() => setIsTempModalOpen(true)}>
            {selectedEnchants && selectedEnchants.length
              ? selectedEnchants[1]?.name
                ? selectedEnchants[1].name
                : "No Enchant"
              : "No Enchant"}
          </div>
          <EnchantModal
            isOpen={isTempModalOpen}
            onClose={() => setIsTempModalOpen(false)}
            gearSlotName={gearSlotName}
            onSelectEnchant={handleSelectEnchant}
            isTemp={true}
          />
        </div>
      )}
    </div>
  );
}

export default EnchantSlot;
