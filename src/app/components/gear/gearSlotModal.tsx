"use client";

import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { GearSlotData } from "@/app/utils/types";
import { imageDomain, WEB_DB_URL } from "@/app/utils/constants";
import { gear, Gear } from "@/app/sim_lib/gear";

interface GearSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGear: (gear: Gear) => void;
  gearSlot: GearSlotData;
}

const GearSelectModal = ({
  isOpen,
  onClose,
  onSelectGear,
  gearSlot,
}: GearSelectModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredGear = useMemo(() => {
    const gearSlotItems =
      gear[gearSlot.gearJsSlotName as keyof typeof gear].map(
        (gearPiece: any) => {
          return { ...gearPiece, p: gearPiece.p || "" };
        },
      ) || [];

    // Convert to array and filter by search query
    return gearSlotItems.filter(
      (gear) =>
        gear.p && gear.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, gearSlot.gearJsSlotName]);

  const handleSelectGear = useCallback(
    (
      gear: Gear & { p?: any },
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
      try {
        e.preventDefault();
        onSelectGear(gear);
        onClose();
      } catch (error) {
        console.error("Error selecting gear:", error);
      }
    },
    [onSelectGear, onClose],
  );

  // Effect to scroll to top when search query changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Select {gearSlot.slotName}</DialogTitle>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary h-4 w-4" />
            <Input
              placeholder="Search gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </DialogHeader>

        <div
          ref={scrollContainerRef}
          className="mt-4 flex-grow overflow-y-auto"
          style={{ height: "calc(80vh - 200px)" }}
        >
          <div className="grid grid-cols-1 gap-2">
            {filteredGear.map((gear, index) => {
              if (!gear.p) return null;
              return (
                <div
                  key={gear.id}
                  onClick={(e) => handleSelectGear(gear, e)}
                  className="flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-secondary"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-full">
                    {gear.id ? (
                      <a
                        key={gear.id}
                        href={`${WEB_DB_URL}${"item"}=${gear.id}`}
                        onClick={(e) => e.preventDefault()}
                      >
                        <Image
                          src={imageDomain + `${gear.p}.jpg`}
                          alt={gear.name || "Item icon"}
                          width={56}
                          height={56}
                          className="object-contain rounded-lg border-primary border"
                          unoptimized
                        />
                      </a>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GearSelectModal;
