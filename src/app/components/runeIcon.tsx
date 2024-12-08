import React from "react";
import { Rune } from "../sim_lib/runes";
import { imageDomain, WEB_DB_URL } from "../utils/constants";
import Image from "next/image";

type RuneIconProps = {
  rune: Rune;
  updateruneSelection: (
    runeId: number,
    toggle: boolean,
    runeSlotName: string,
  ) => void;
  runeStatus: boolean;
  runeSlotName: string;
};

function RuneIcon({
  rune,
  updateruneSelection,
  runeStatus,
  runeSlotName,
}: RuneIconProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    updateruneSelection(rune.id, !runeStatus, runeSlotName);
  };

  return (
    <a
      key={rune.id}
      href={`${WEB_DB_URL}spell=${rune.id}`}
      aria-disabled="true"
      onClick={handleClick}
    >
      <Image
        src={imageDomain + rune.iconname.toLowerCase() + `.jpg`}
        alt={rune.name}
        width={50}
        height={50}
        className={`${!runeStatus && "grayscale"}`}
      />
    </a>
  );
}

export default RuneIcon;
