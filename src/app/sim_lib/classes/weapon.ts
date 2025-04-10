import { BuffsSetup } from "@/app/utils/types";
import { Enchant } from "../enchants";
import { Gear, Proc } from "../gear";
import { Player } from "./player";
import { rng } from "./simulation";
import * as Classes from "./spell";

export const WEAPONTYPE = {
  MACE: 0,
  SWORD: 1,
  DAGGER: 2,
  AXE: 3,
  FIST: 4,
  POLEARM: 5,
  STAFF: 6,
  FISHINGPOLE: 7,
  MACE_1H: 10,
  SWORD_1H: 11,
  AXE_1H: 13,
  MACE_2H: 20,
  SWORD_2H: 21,
  AXE_2H: 23,
};

export class Weapon {
  data: [number, number, number, number, number];
  totaldmg: number;
  totalprocdmg: number;
  timer: number;
  speed: number;
  player: Player;
  id: number;
  name: string;
  mindmg: number;
  maxdmg: number;
  basemindmg: number;
  basemaxdmg: number;
  type: string | number;
  modifier: number;
  normSpeed: number;
  offhand: boolean;
  twohand: boolean;
  crit: number;
  basebonusdmg: number;
  bonusdmg: number;
  proc1?: Proc;
  proc2?: Proc;
  windfury?: Classes.Windfury;
  constructor(
    player: Player,
    item: Gear,
    enchant: Enchant,
    tempenchant: Enchant,
    offhand: boolean,
    twohand: boolean,
    buffs: BuffsSetup,
  ) {
    this.player = player;
    this.id = item.id;
    this.name = item.name;
    this.mindmg = ("mindmg" in item && item.mindmg) || 0;
    this.maxdmg = ("maxdmg" in item && item.maxdmg) || 0;
    this.basemindmg = ("mindmg" in item && item.mindmg) || 0;
    this.basemaxdmg = ("maxdmg" in item && item.maxdmg) || 0;
    this.type = ("type" in item && item.type) || "";
    this.modifier = offhand
      ? 0.5 * (1 + player.talents.offmod) * (1 + player.talents.onemod)
      : 1 + player.talents.onemod;
    if (twohand) this.modifier = 1 + player.talents.twomod;
    this.speed = ("speed" in item && item.speed) || 0;
    this.timer = 0;
    this.normSpeed = 2.4;
    this.offhand = offhand;
    this.twohand = twohand;
    this.crit = 0;
    this.basebonusdmg = 0;
    this.bonusdmg = 0;
    const itemType = this.type;
    this.type =
      WEAPONTYPE[
        itemType.replace(" ", "").toUpperCase() as keyof typeof WEAPONTYPE
      ] || 0;
    this.totaldmg = 0;
    this.totalprocdmg = 0;
    this.data = [0, 0, 0, 0, 0];
    if (this.type == WEAPONTYPE.AXE) this.crit += player.talents.axecrit;
    if (this.type == WEAPONTYPE.POLEARM)
      this.crit += player.talents.polearmcrit;
    if (this.type == WEAPONTYPE.DAGGER) this.normSpeed = 1.7;
    if (this.twohand) this.normSpeed = 3.3;

    if ("proc" in item && item.proc) {
      this.proc1 = {} as Proc;
      const itemProc = item.proc;
      if (!("speed" in item) || !item.speed) return;
      this.proc1.chance =
        "chance" in itemProc && itemProc
          ? itemProc.chance * 100
          : ~~((item.speed * (itemProc.ppm || 1)) / 0.006);
      if (itemProc.dmg && !itemProc.magic) this.proc1.physdmg = itemProc.dmg;
      if (itemProc.dmg && itemProc.magic) this.proc1.magicdmg = itemProc.dmg;
      if ("binaryspell" in itemProc && itemProc.binaryspell)
        this.proc1.binaryspell = true;
      if ("coeff" in itemProc && itemProc.coeff)
        this.proc1.coeff = itemProc.coeff;
      if ("procgcd" in itemProc && itemProc.procgcd)
        this.proc1.gcd = itemProc.procgcd;
      if ("extra" in itemProc && itemProc.extra)
        this.proc1.extra = itemProc.extra;
      if (
        itemProc.dmg &&
        !itemProc.magic &&
        (!("tick" in itemProc) || !itemProc.tick) &&
        item.id != 231848
      )
        this.proc1.phantom = true;

      // dont need an aura, just add the dmg
      if (
        "tick" in itemProc &&
        itemProc.tick &&
        (!("bleed" in itemProc) || !itemProc.bleed) &&
        "duration" in itemProc &&
        "interval" in itemProc
      ) {
        const tick = itemProc.tick as number;
        let ticks =
          parseInt(itemProc.duration as string) /
          parseInt(itemProc.interval as string);
        if (itemProc.magic)
          this.proc1.magicdmg = (itemProc.dmg || 0) + tick * ticks;
        else this.proc1.physdmg = (itemProc.dmg || 0) + tick * ticks;
      }
      // bleeds need aura
      if (
        "tick" in itemProc &&
        itemProc.tick &&
        "bleed" in itemProc &&
        itemProc.bleed &&
        "duration" in itemProc &&
        "interval" in itemProc
      ) {
        player.auras["weaponbleed" + (this.offhand ? "oh" : "mh")] =
          new Classes.WeaponBleed(
            player,
            0,
            itemProc.duration as string,
            itemProc.interval as string,
            itemProc.tick as number,
            this.offhand,
          );
        this.proc1.spell =
          player.auras["weaponbleed" + (this.offhand ? "oh" : "mh")];
      }
      // custom spells
      if ("spell" in itemProc && itemProc.spell) {
        if (!player.auras[itemProc.spell.toLowerCase()]) {
          const ClassConstructor =
            Classes[itemProc.spell as keyof typeof Classes];
          if (ClassConstructor) {
            player.auras[itemProc.spell.toLowerCase()] = new ClassConstructor(
              player,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
            ) as Classes.Aura;
          } else {
            console.error(`Class ${item.proc.spell} not found`);
          }
        }
        this.proc1.spell = player.auras[itemProc.spell.toLowerCase()];
      }
    }

    if (
      enchant &&
      (("ppm" in enchant && enchant.ppm) ||
        ("chance" in enchant && enchant.chance))
    ) {
      this.proc2 = {} as Proc;
      if (enchant.ppm)
        this.proc2.chance = ~~((this.speed * enchant.ppm) / 0.006);
      if (enchant.chance) this.proc2.chance = enchant.chance * 100;
      if (enchant.magicdmg) this.proc2.magicdmg = enchant.magicdmg;
      if (enchant.procspell && !offhand) {
        player.auras.crusader1 = new Classes.Crusader(player, undefined);
        player.auras.crusader1.name = "Crusader (MH)";
        this.proc2.spell = player.auras.crusader1;
      }
      if (enchant.procspell && offhand) {
        player.auras.crusader2 = new Classes.Crusader(player, undefined);
        player.auras.crusader2.name = "Crusader (OH)";
        this.proc2.spell = player.auras.crusader2;
      }
    }

    for (let buff of buffs) {
      if (buff.group == "windfury" && buff.active) {
        if (!this.player.auras.windfury && !this.offhand) {
          this.player.auras.windfury = new Classes.Windfury(
            this.player,
            buff.id,
          );
          this.windfury = this.player.auras.windfury as Classes.Windfury;
        }
      }
    }

    if (
      !this.windfury &&
      !this.proc2 &&
      tempenchant &&
      (("ppm" in tempenchant && tempenchant.ppm) ||
        ("chance" in tempenchant && tempenchant.chance))
    ) {
      this.proc2 = {} as Proc;
      if (tempenchant.ppm)
        this.proc2.chance = ~~((this.speed * tempenchant.ppm) / 0.006);
      if (tempenchant.chance) this.proc2.chance = tempenchant.chance * 100;
      if (tempenchant.magicdmg) this.proc2.magicdmg = tempenchant.magicdmg;
    }

    for (let buff of buffs)
      if ("bonusdmg" in buff && buff.bonusdmg && buff.active)
        this.basebonusdmg += buff.bonusdmg as number;
    if (enchant && "bonusdmg" in enchant && enchant.bonusdmg)
      this.basebonusdmg += enchant.bonusdmg;
    if (
      !this.windfury &&
      tempenchant &&
      "bonusdmg" in tempenchant &&
      tempenchant.bonusdmg
    )
      this.basebonusdmg += tempenchant.bonusdmg;
    this.bonusdmg = this.basebonusdmg;
  }
  dmg(heroicstrike: Classes.Spell) {
    let dmg;
    let mod = 1;
    dmg =
      rng(this.mindmg + this.bonusdmg, this.maxdmg + this.bonusdmg) +
      (this.player.stats.ap / 14) * this.speed +
      this.player.stats.moddmgdone;
    if (heroicstrike) dmg += heroicstrike.bonus as number;
    if (
      heroicstrike &&
      heroicstrike instanceof Classes.HeroicStrike &&
      this.player.heroicbonus
    )
      mod = 1.25;
    return (
      dmg * this.modifier * this.player.stats.dmgmod * mod +
      this.player.stats.moddmgtaken
    );
  }
  avgdmg() {
    let dmg =
      (this.mindmg + this.bonusdmg + this.maxdmg + this.bonusdmg) / 2 +
      (this.player.stats.ap / 14) * this.normSpeed +
      this.player.stats.moddmgdone;
    dmg =
      dmg * this.modifier * this.player.stats.dmgmod +
      this.player.stats.moddmgtaken;
    return dmg * (1 - this.player.armorReduction);
  }
  use() {
    this.timer = Math.round((this.speed * 1000) / this.player.stats.haste);
    if (
      !this.offhand &&
      this.player.spells.slam &&
      this.player.spells.slam.afterswing
    )
      this.player.spells.slam.mhthreshold = this.timer - 1000;
  }
  step(next: number) {
    this.timer -= next;
  }
}
