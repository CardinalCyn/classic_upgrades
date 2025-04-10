import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableCaption,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { StatsProps } from "../utils/types";
import type { Rend, Spell } from "../sim_lib/classes/spell";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// Custom tooltip component for DPS percentile
const DPSPercentileTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const { dps, quantity, percentile } = payload[0].payload;
    return (
      <div className="p-2 border rounded shadow-sm">
        <p className="font-medium">{`DPS: ${dps}`}</p>
        <p>{`Quantity: ${quantity}`}</p>
        <p>{`Percentile: ${percentile.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

function Stats({ report }: StatsProps) {
  if (!report) return <>No report currently.</>;
  const auraUptimePercentage: { name: string; percentage: number }[] = [];
  const spellDPS: { [key: string]: number } = {};

  for (const auraName in report.player.auras) {
    const aura = report.player.auras[auraName];
    auraUptimePercentage.push({
      name: auraName,
      percentage: aura.uptime / report.totalduration / 10,
    });
  }

  for (const spellName in report.player.spells) {
    const spell = report.player.spells[spellName];
    spellDPS[spell.name] = spell.totaldmg / report.totalduration;
  }

  if (report.player.mh) {
    spellDPS["Main Hand"] =
      report.player.mh.totalprocdmg / report.totalduration;
  }
  if (report.player.oh) {
    spellDPS["Off Hand"] = report.player.oh.totalprocdmg / report.totalduration;
  }

  // Process DPS spread data and calculate percentiles
  const dpsSpreadRaw = [];
  for (const dps in report.spread) {
    dpsSpreadRaw.push({ dps: Number(dps), quantity: report.spread[dps] });
  }

  // Sort by DPS value for percentile calculation
  dpsSpreadRaw.sort((a, b) => a.dps - b.dps);

  // Calculate total quantity for percentile calculation
  const totalQuantity = dpsSpreadRaw.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  // Calculate cumulative quantities and percentiles
  let cumulativeQuantity = 0;
  const dpsSpread = dpsSpreadRaw.map((item) => {
    cumulativeQuantity += item.quantity;
    const percentile = (cumulativeQuantity / totalQuantity) * 100;
    return {
      ...item,
      percentile,
    };
  });

  const spellStats: {
    action: string;
    hitPercentage: string | null;
    critPercentage: string | null;
    missPercentage: string | null;
    dodgePercentage: string | null;
    glancePercentage: string | null;
    uses: string;
    DPR: string | null;
    DPS: string;
  }[] = [];

  const mhData = report.player.mh.data;
  const mhTotal = mhData.reduce((acc, current) => acc + current);
  spellStats.push({
    action: "Main Hand",
    hitPercentage: ((mhData[0] / mhTotal) * 100).toFixed(2),
    critPercentage: ((mhData[3] / mhTotal) * 100).toFixed(2),
    missPercentage: ((mhData[1] / mhTotal) * 100).toFixed(2),
    dodgePercentage: ((mhData[2] / mhTotal) * 100).toFixed(2),
    glancePercentage: ((mhData[4] / mhTotal) * 100).toFixed(2),
    uses: (mhTotal / report.iterations).toFixed(2),
    DPR: null,
    DPS: (report.player.mh.totaldmg / report.totalduration).toFixed(2),
  });

  if (report.player.oh) {
    const ohData = report.player.oh.data;
    const ohTotal = ohData.reduce((acc, current) => acc + current);

    spellStats.push({
      action: "Off Hand",
      hitPercentage: ((ohData[0] / ohTotal) * 100).toFixed(2),
      critPercentage: ((ohData[3] / ohTotal) * 100).toFixed(2),
      missPercentage: ((ohData[1] / ohTotal) * 100).toFixed(2),
      dodgePercentage: ((ohData[2] / ohTotal) * 100).toFixed(2),
      glancePercentage: ((ohData[4] / ohTotal) * 100).toFixed(2),
      uses: (ohTotal / report.iterations).toFixed(2),
      DPR: null,
      DPS: (report.player.oh.totaldmg / report.totalduration).toFixed(2),
    });

    for (const spellName in report.player.spells) {
      const spell: Spell = report.player.spells[spellName];
      const spellData = spell.data;
      const spellTotal = spellData.reduce((acc, current) => acc + current);

      if (!spellTotal) continue;

      const spellDPS = (spell.totaldmg / report.totalduration).toFixed(2);
      let spellDPR =
        spell.totaldmg /
        report.iterations /
        (spell.cost * (spellTotal / report.iterations));

      if (spell.name === "slam" && report.player.bloodsurge) {
        spellDPR = Number.POSITIVE_INFINITY;
      } else if (spell.name === "execute" && spell.totalusedrage) {
        spellDPR =
          spell.totaldmg /
          report.iterations /
          (spell.cost * (spellTotal / report.iterations) +
            spell.totalusedrage / report.iterations);
      }
      spellStats.push({
        action: spell.name,
        hitPercentage: ((spellData[0] / spellTotal) * 100).toFixed(2),
        critPercentage: ((spellData[3] / spellTotal) * 100).toFixed(2),
        missPercentage: ((spellData[1] / spellTotal) * 100).toFixed(2),
        dodgePercentage: ((spellData[2] / spellTotal) * 100).toFixed(2),
        glancePercentage: ((spellData[4] / spellTotal) * 100).toFixed(2),
        uses: (spellTotal / report.iterations).toFixed(2),
        DPR: spellDPR.toFixed(2),
        DPS: spellDPS,
      });
    }

    const rendSpell = report.player.auras["rend"] as Rend;
    if (rendSpell && rendSpell.data) {
      const data: [number, number, number, number, number] = rendSpell.data;
      const rendTotal = data.reduce(
        (acc: number, curr: number) => acc + curr,
        0,
      );
      const totaldmg: number = rendSpell.totaldmg;

      const DPS = (totaldmg / report.totalduration).toFixed(2);
      const damagePerRage = (
        rendSpell.totaldmg /
        report.iterations /
        (rendSpell.cost * (rendTotal / report.iterations))
      ).toFixed(2);

      spellStats.push({
        action: "Rend",
        hitPercentage: null,
        critPercentage: null,
        missPercentage: ((data[1] / rendTotal) * 100).toFixed(2),
        dodgePercentage: ((data[2] / rendTotal) * 100).toFixed(2),
        glancePercentage: null,
        uses: (rendTotal / report.iterations).toFixed(2),
        DPR: damagePerRage,
        DPS,
      });
    }
  }

  return (
    <Card className="border-none rounded-none shadow-none w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-center">Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Hit %</TableHead>
                <TableHead>Crit %</TableHead>
                <TableHead>Miss %</TableHead>
                <TableHead>Dodge %</TableHead>
                <TableHead>Glance %</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>DPR</TableHead>
                <TableHead>DPS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spellStats.map((spellStat) => (
                <TableRow key={spellStat.action}>
                  <TableCell>{spellStat.action}</TableCell>
                  <TableCell>{spellStat.hitPercentage}</TableCell>
                  <TableCell>{spellStat.critPercentage}</TableCell>
                  <TableCell>{spellStat.missPercentage}</TableCell>
                  <TableCell>{spellStat.dodgePercentage}</TableCell>
                  <TableCell>{spellStat.glancePercentage}</TableCell>
                  <TableCell>{spellStat.uses}</TableCell>
                  <TableCell>{spellStat.DPR}</TableCell>
                  <TableCell>{spellStat.DPS}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
        <ChartContainer
          config={{
            uptime: {
              label: "Uptime %",
              color: "#2563eb",
            },
          }}
        >
          <BarChart
            accessibilityLayer
            className="h-[200px] w-full"
            data={auraUptimePercentage}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="percentage" fill="var(--color-uptime)" radius={4} />
          </BarChart>
        </ChartContainer>
        <ChartContainer
          config={{
            quantity: {
              label: "DPS Spread",
              color: "#2563eb",
            },
          }}
        >
          <BarChart
            accessibilityLayer
            className="h-[200px] w-full"
            data={dpsSpread}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dps"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<DPSPercentileTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="quantity" fill="var(--color-quantity)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default Stats;
