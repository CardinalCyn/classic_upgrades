import React from "react";
import Image from "next/image";
import { imageDomain, WEB_DB_URL } from "../utils/constants";

type TalentIconProps = {
  talent: any;
  currentCount: number;
  talentPointsRemaining: number;
  onAddPoint: () => void;
  onRemovePoint: () => void;
};

const TalentIcon = ({
  talent,
  currentCount,
  talentPointsRemaining,
  onAddPoint,
  onRemovePoint,
}: TalentIconProps) => {
  const handleLeftClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (talentPointsRemaining > 0 && currentCount < talent.m) {
      onAddPoint();
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentCount > 0) {
      onRemovePoint();
    }
  };

  return (
    <a
      key={talent.s}
      href={`${WEB_DB_URL}${"spell"}=${
        typeof talent.s === "object"
          ? talent.s[Math.max(0, Math.min(currentCount - 1, talent.m))]
          : talent.s
      }`}
      aria-disabled="true"
      className={`relative cursor-pointer select-none
            `}
      data-count={currentCount}
      data-x={talent.x}
      data-y={talent.y}
      onContextMenu={handleRightClick}
      onClick={handleLeftClick}
    >
      <Image
        src={imageDomain + talent.iconname.toLowerCase() + `.jpg`}
        alt={talent.n}
        width={40}
        height={40}
      />
      <div
        className={`absolute bottom-0 right-0 bg-black/70 ${
          currentCount === talent.m ? "text-yellow-500" : "text-white"
        } text-xs px-1 rounded`}
      >
        {currentCount}/{talent.m}
      </div>
    </a>
  );
};

export default TalentIcon;
