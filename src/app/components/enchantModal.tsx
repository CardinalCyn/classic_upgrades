import React, { useCallback, useMemo, useRef, useState } from "react";
import { Enchant, enchants } from "../sim_lib/enchants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type EnchantModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectEnchant: (enchant: Enchant) => void;
  gearSlotName: string;
  isTemp: boolean;
};

function EnchantModal({
  isOpen,
  onClose,
  gearSlotName,
  onSelectEnchant,
  isTemp,
}: EnchantModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredEnchants: Enchant[] = useMemo(() => {
    const enchantSlotItems = enchants[gearSlotName as keyof typeof enchants]
      .map((enchant) => {
        return { ...enchant };
      })
      .filter((ench) => ench.temp === isTemp);

    return enchantSlotItems.filter((enchant) =>
      enchant.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, gearSlotName]);

  const handleSelectEnchant = useCallback(
    (enchant: Enchant, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      try {
        e.preventDefault();
        onSelectEnchant(enchant);
        onClose();
      } catch (error) {
        console.error("Error selecting enchant: ", error);
      }
    },
    [onSelectEnchant, onClose],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              Select {gearSlotName} {isTemp ? "temporary" : "permanent"} enchant
            </DialogTitle>
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
            {filteredEnchants.map((enchant) => {
              if (!enchant) return null;
              return (
                <div
                  key={enchant.id}
                  onClick={(e) => handleSelectEnchant(enchant, e)}
                  className="flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-secondary"
                >
                  <div className="ml-3">
                    <h4 className="font-medium">
                      {enchant.name || "Unknown Item"}
                    </h4>
                  </div>
                </div>
              );
            })}
            {filteredEnchants.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No items found{searchQuery ? ` matching "${searchQuery}"` : ""}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EnchantModal;
