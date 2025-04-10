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
  StatsProps,
  TalentsProps,
} from "../utils/types";
import { defaultTargetBaseArmor, tabs } from "../utils/constants";
import Rotation from "./rotation";
import Buffs from "./buffs";

import Runes from "./runes";
import Stats from "./stats";

type CustomizeProps = {
  classicMode: ClassicMode;
  gearSelectionProps: GearSelectionProps;
  settingsProps: SettingsProps;
  talentSelectionProps: TalentsProps;
  rotationProps: RotationProps;
  buffsProps: BuffsProps;
  runesProps: RunesProps;
  statsProps: StatsProps;
};

function Customize({
  classicMode,
  gearSelectionProps,
  settingsProps,
  talentSelectionProps,
  rotationProps,
  buffsProps,
  runesProps,
  statsProps,
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
          buttonFunctions={gearSelectionProps.buttonFunctions}
          enchantSetup={gearSelectionProps.enchantSetup}
          handleEnchantUpdate={gearSelectionProps.handleEnchantUpdate}
        />
      </TabsContent>
      <TabsContent className="border-none" value="settings">
        <Settings
          settingsSetup={settingsProps.settingsSetup}
          handleSettingsUpdate={settingsProps.handleSettingsUpdate}
          buttonFunctions={settingsProps.buttonFunctions}
        />
      </TabsContent>
      <TabsContent className="border-none" value="talents">
        <Talents
          handleTalentPointUpdate={talentSelectionProps.handleTalentPointUpdate}
          buttonFunctions={talentSelectionProps.buttonFunctions}
          talentsSetup={talentSelectionProps.talentsSetup}
        />
      </TabsContent>
      <TabsContent className="border-none" value="rotation">
        <Rotation
          classicMode={classicMode}
          playerLevel={(rotationProps.settingsSetup.level as number) || 60}
          settingsSetup={rotationProps.settingsSetup}
          rotationSetup={rotationProps.rotationSetup}
          handleRotationUpdate={rotationProps.handleRotationUpdate}
          buttonFunctions={rotationProps.buttonFunctions}
          runesSetup={rotationProps.runesSetup}
          gearSetup={gearSelectionProps.gearSetup}
        />
      </TabsContent>
      <TabsContent className="border-none" value="buffs">
        <Buffs
          classicMode={classicMode}
          playerLevel={(settingsProps.settingsSetup.level as number) || 60}
          initTargetArmor={
            (settingsProps.settingsSetup.targetbasearmor as number) ||
            defaultTargetBaseArmor
          }
          settingsSetup={settingsProps.settingsSetup}
          buffsSetup={buffsProps.buffsSetup}
          buttonFunctions={buffsProps.buttonFunctions}
          handleBuffUpdate={buffsProps.handleBuffUpdate}
          runesSetup={runesProps.runesSetup}
        />
      </TabsContent>
      {classicMode === "Season of Discovery" && (
        <TabsContent className="border-none" value="runes">
          <Runes
            runesSetup={runesProps.runesSetup}
            buttonFunctions={runesProps.buttonFunctions}
            handleRunesUpdate={runesProps.handleRunesUpdate}
          />
        </TabsContent>
      )}
      <TabsContent className="border-none" value="stats">
        <Stats report={statsProps.report} />
      </TabsContent>
    </Tabs>
  );
}

export default Customize;
