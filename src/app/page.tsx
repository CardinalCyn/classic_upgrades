"use client";

import { ClassCard } from "./components/classCard";
import Link from "next/link";
import { classNames } from "./utils/constants";
import Navbar from "./components/navbar";
import { useContext } from "react";
import { ClassicModeContext } from "./providers/modeContext";

export default function Page(): JSX.Element {
  const { classicMode, setClassicMode } = useContext(ClassicModeContext);
  return (
    <div className="min-h-screen bg-background">
      <Navbar classicMode={classicMode} setClassicMode={setClassicMode} />
      <div className="container mx-auto px-4 pt-20">
        <div>
          <h1 className="text-4xl font-bold text-foreground text-center">
            Choose Your Class
          </h1>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          {classNames.map((className: string) => (
            <div key={className} className="w-full max-w-[350px] group">
              <Link href={`/${className.toLowerCase()}`} className="block">
                <div
                  className="transition-all duration-300 ease-in-out
                  group-hover:scale-105
                  group-hover:shadow-xl
                  rounded-lg
                  overflow-hidden"
                >
                  <ClassCard className={className} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
