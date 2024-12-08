"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { ClassicMode } from "../utils/types";

type ClassicModeContextType = {
  classicMode: ClassicMode;
  setClassicMode: Dispatch<SetStateAction<ClassicMode>>;
};

export const ClassicModeContext = createContext<ClassicModeContextType>({
  classicMode: "Classic",
  setClassicMode: () => {},
});

export const ClassicModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [classicMode, setClassicMode] = useState<ClassicMode>("Classic");

  return (
    <ClassicModeContext.Provider value={{ classicMode, setClassicMode }}>
      {children}
    </ClassicModeContext.Provider>
  );
};
