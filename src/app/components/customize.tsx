import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GearSelection from "./gear/gearSelection";
import Settings from "./settings";
import Talents from "./talents";
import {
  BuffsProps,
  ClassicMode,
  GearSelectionProps,
  RotationProps,
  RunesProps,
  SettingsProps,
  TalentsProps,
} from "../utils/types";
import { defaultTargetBaseArmor, tabs } from "../utils/constants";
import Rotation from "./rotation";
import Buffs from "./buffs";

import Runes from "./runes";

type CustomizeProps = {
  classicMode: ClassicMode;
  gearSelectionProps: GearSelectionProps;
  settingsProps: SettingsProps;
  talentSelectionProps: TalentsProps;
  rotationProps: RotationProps;
  buffsProps: BuffsProps;
  runesProps: RunesProps;
};

function Customize({
  classicMode,
  gearSelectionProps,
  settingsProps,
  talentSelectionProps,
  rotationProps,
  buffsProps,
  runesProps,
}: CustomizeProps) {
  return (
    <Tabs className="border-none" defaultValue="gear">
      <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 w-full rounded-none border-b">
        {tabs
          .filter(
            (tab) =>
              tab.classicMode === "Classic" || classicMode === tab.classicMode,
          )
          .map((tab) => (
            <TabsTrigger
              key={tab.tabValue}
              value={tab.tabValue}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground m-1"
            >
              {tab.tabLabel}
            </TabsTrigger>
          ))}
      </TabsList>
      <TabsContent value="gear">
        <GearSelection
          gearSetup={gearSelectionProps.gearSetup}
          handleGearUpdate={gearSelectionProps.handleGearUpdate}
          resetGear={gearSelectionProps.resetGear}
        />
      </TabsContent>
      <TabsContent className="border-none" value="settings">
        <Settings
          settingsSetup={settingsProps.settingsSetup}
          handleSettingsUpdate={settingsProps.handleSettingsUpdate}
        />
      </TabsContent>
      <TabsContent className="border-none" value="talents">
        <Talents
          handleTalentPointUpdate={talentSelectionProps.handleTalentPointUpdate}
          resetTalentPoints={talentSelectionProps.resetTalentPoints}
          talentPointsRemaining={talentSelectionProps.talentPointsRemaining}
          talentsSetup={talentSelectionProps.talentsSetup}
        />
      </TabsContent>
      <TabsContent className="border-none" value="rotation">
        <Rotation
          classicMode={classicMode}
          playerLevel={rotationProps.settingsSetup.level.slider || 60}
          settingsSetup={rotationProps.settingsSetup}
          rotationSetup={rotationProps.rotationSetup}
          handleRotationUpdate={rotationProps.handleRotationUpdate}
          resetRotation={rotationProps.resetRotation}
          runesSetup={rotationProps.runesSetup}
          gearSetup={gearSelectionProps.gearSetup}
        />
      </TabsContent>
      <TabsContent className="border-none" value="buffs">
        <Buffs
          classicMode={classicMode}
          playerLevel={settingsProps.settingsSetup.level.slider || 60}
          initTargetArmor={
            settingsProps.settingsSetup.targetbasearmor.number ||
            defaultTargetBaseArmor
          }
          settingsSetup={settingsProps.settingsSetup}
          buffsSetup={buffsProps.buffsSetup}
          resetBuffs={buffsProps.resetBuffs}
          handleBuffUpdate={buffsProps.handleBuffUpdate}
          runesSetup={runesProps.runesSetup}
        />
      </TabsContent>
      {classicMode === "Season of Discovery" && (
        <TabsContent className="border-none" value="runes">
          <Runes
            runesSetup={runesProps.runesSetup}
            resetRunes={runesProps.resetRunes}
            handleRunesUpdate={runesProps.handleRunesUpdate}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}

export default Customize;
