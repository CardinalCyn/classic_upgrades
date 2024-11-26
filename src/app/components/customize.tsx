import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GearSelection from "./gearSelection";

function Customize() {
  return (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="gear">Gear</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="gear">
        <GearSelection />
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Modify settings here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">hi</div>
          </CardContent>
          <CardFooter>
            <Button>Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Customize;
