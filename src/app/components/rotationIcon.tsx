"use client";

import Image from "next/image";
import React, { useState } from "react";
import { imageDomain, WEB_DB_URL } from "../utils/constants";
import { Spell } from "../sim_lib/spells";

type BuffIconProps = {
  spell: Spell;
  handleRotationUpdate: (spellId: number, toggle: boolean) => void;
  spellStatus: boolean;
};

function RotationIcon({
  spell,
  handleRotationUpdate,
  spellStatus,
}: BuffIconProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenModal(true);
    handleRotationUpdate(spell.id, !spellStatus);
  };

  const [openModal, setOpenModal] = useState(false);
  return (
    <a
      key={spell.id}
      href={`${WEB_DB_URL}${spell.item ? "item" : "spell"}=${spell.id}`}
      aria-disabled="true"
      onClick={handleClick}
    >
      <Image
        src={imageDomain + spell.iconname.toLowerCase() + `.jpg`}
        alt={spell.name}
        width={56}
        height={56}
        className={`${!spellStatus && "grayscale"}`}
      />
    </a>
  );
}

export default RotationIcon;
