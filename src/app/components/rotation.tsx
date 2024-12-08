import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Spell, spells } from "../sim_lib/spells";

import { Button } from "@/components/ui/button";
function Rotation() {
  const [spellSetup, setSpellSetup] = useState<Spell[]>(spells);

  return (
    <Card className="border-none rounded-none shadow-none text-2xl font-bold mb-6 text-center flex flex-col items-center">
      <CardHeader>
        <CardTitle>Rotation</CardTitle>
        <Button>Reset Rotation</Button>
        <CardDescription className="pt-5">
          <Button>Save Rotation</Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="md:mx-32"></CardContent>
    </Card>
  );
}

export default Rotation;
