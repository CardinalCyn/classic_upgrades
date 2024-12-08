"use client";

import Link from "next/link";
import { ClassicMode } from "../utils/types";
import { ClassicModeToggle } from "./classicModeToggle";
import { ModeToggle } from "./theme-toggle";

type NavbarProps = {
  classicMode: ClassicMode;
  setClassicMode: (mode: ClassicMode) => void;
};

export default function Navbar({ classicMode, setClassicMode }: NavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-primary backdrop-blur-md shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link href={`/`} className="block">
              <span className="text-sm md:text-lgfont-semibold text-secondary">
                WoW Gear Planner
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <ClassicModeToggle
              classicMode={classicMode}
              setClassicMode={setClassicMode}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
