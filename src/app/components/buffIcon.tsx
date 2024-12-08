"use client";

import Image from "next/image";
import React from "react";
import {
  invalidBattleSquawkIds,
  imageDomain,
  WEB_DB_URL,
  validBattleSquawkId,
} from "../utils/constants";
import { Buff } from "../sim_lib/buffs";

type BuffIconProps = {
  buff: Buff;
  updateBuffSelection: (buffId: number, toggle: boolean) => void;
  buffStatus: boolean;
};

function BuffIcon({ buff, updateBuffSelection, buffStatus }: BuffIconProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    updateBuffSelection(buff.id, !buffStatus);
  };

  return (
    <a
      key={buff.id}
      href={`${WEB_DB_URL}${buff.spellid ? "spell" : "item"}=${
        invalidBattleSquawkIds.includes(buff.id) ? validBattleSquawkId : buff.id
      }`}
      aria-disabled="true"
      onClick={handleClick}
    >
      <Image
        src={imageDomain + buff.iconname.toLowerCase() + `.jpg`}
        alt={buff.name}
        width={56}
        height={56}
        className={`${!buffStatus && "grayscale"}`}
      />
    </a>
  );
}

export default BuffIcon;
