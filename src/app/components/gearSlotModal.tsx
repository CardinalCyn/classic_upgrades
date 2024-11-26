"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import Image from "next/image";
import { GearItem, GearSlotData } from "../utils/types";
import gearData from "../utils/gearData.json";
import gearDataSOM from "../utils/gearDataSOM.json";
import { imageDomain } from "../utils/constants";

interface GearSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGear: (gear: GearItem) => void;
  gearSlot: GearSlotData;
}

const GearSelectModal = ({
  isOpen,
  onClose,
  onSelectGear,
  gearSlot,
}: GearSelectModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize filtered gear to prevent unnecessary recalculations
  const filteredGear = useMemo(() => {
    const gearSlotItems =
      gearData[gearSlot.gearJsSlotName as keyof typeof gearData] || [];
    const gearSOMSlotItems =
      gearDataSOM[gearSlot.gearJsSlotName as keyof typeof gearDataSOM] || [];

    const filteredSomGear = gearSOMSlotItems.filter((gear) =>
      gear.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return gearSlotItems
      .filter((gear) =>
        gear.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .map((piece) => {
        const somPiece = filteredSomGear.find(
          (somGear) => somGear.name === piece.name,
        );
        return {
          ...piece,
          p: "p" in piece ? piece.p : somPiece?.p || "",
        };
      })
      .filter((gear) => gear.p); // Only return items with a valid 'p' property
  }, [searchQuery, gearSlot.gearJsSlotName]);

  const handleSelectGear = useCallback(
    (gear: GearItem) => {
      try {
        onSelectGear(gear);
        onClose();
      } catch (error) {
        console.error("Error selecting gear:", error);
      }
    },
    [onSelectGear, onClose],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Select {gearSlot.slotName}</DialogTitle>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="grid grid-cols-1 gap-2" key={"asdf"}>
            {filteredGear.map((gear) => {
              if (!gear.p) return <></>;

              return (
                <div
                  key={gear.id}
                  onClick={() =>
                    handleSelectGear({ imageId: gear.p, name: gear.name })
                  }
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-full">
                    {gear.id ? (
                      <Image
                        src={imageDomain + `${gear.p}.jpg`}
                        alt={gear.name || "Item icon"}
                        width={56}
                        height={56}
                        className="object-contain rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">
                      {gear.name || "Unknown Item"}
                    </h4>
                  </div>
                </div>
              );
            })}
            {filteredGear.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No items found{searchQuery ? ` matching "${searchQuery}"` : ""}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GearSelectModal;
