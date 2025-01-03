import { Player } from "../sim_lib/classes/player";
import { SimulationStartParams } from "../sim_lib/classes/simulation";
import * as SpellModules from "../sim_lib/classes/spell";

type AnyFunction = (...args: any[]) => any;

function isFunction(value: unknown): value is AnyFunction {
  return typeof value === "function";
}

export function sanitizeSimulationParams(
  params: SimulationStartParams,
): SimulationStartParams {
  function sanitizeValue(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (isFunction(value)) {
      return null;
    }

    if (Array.isArray(value)) {
      return value.map((item) => sanitizeValue(item));
    }

    if (typeof value === "object") {
      const sanitizedObj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitizedObj[key] = sanitizeValue(val);
      }
      return sanitizedObj;
    }

    return value;
  }

  const sanitized = sanitizeValue(params) as SimulationStartParams;

  if (!sanitized.player || !sanitized.sim || !sanitized.globals) {
    throw new Error("Required properties missing after sanitization");
  }

  return sanitized;
}

type SpellConstructor = new (player: Player, id: number) => SpellModules.Spell;

// Create a lazy-loaded registry
class LazySpellRegistry {
  private registry: Record<string, SpellConstructor> | null = null;

  private initializeRegistry(): Record<string, SpellConstructor> {
    if (this.registry === null) {
      this.registry = Object.entries(SpellModules)
        .filter(([_, value]) => {
          return (
            typeof value === "function" &&
            value.prototype instanceof SpellModules.Spell &&
            value !== SpellModules.Spell
          );
        })
        .reduce(
          (registry, [className, SpellClass]) => ({
            ...registry,
            [className]: SpellClass as SpellConstructor,
          }),
          {},
        );
    }
    return this.registry;
  }

  public getRegistry(): Record<string, SpellConstructor> {
    return this.initializeRegistry();
  }

  public createSpell(
    className: string,
    player: Player,
    id: number,
  ): SpellModules.Spell {
    const registry = this.getRegistry();
    const SpellClass = registry[className];

    if (!SpellClass) {
      console.error(`Failed to create spell: ${className}`);
      console.log("Available spells:", Object.keys(registry));
      throw new Error(`Unknown spell class: ${className}`);
    }

    try {
      return new SpellClass(player, id);
    } catch (error) {
      console.error(`Error creating spell ${className}:`, error);
      throw error;
    }
  }

  public listAvailableSpells(): string[] {
    return Object.keys(this.getRegistry());
  }
}

// Create a single instance of the registry
export const spellRegistry = new LazySpellRegistry();

// Exported functions that use the registry instance
export function createSpell(
  className: string,
  player: Player,
  id: number,
): SpellModules.Spell {
  return spellRegistry.createSpell(className, player, id);
}

export function listAvailableSpells(): string[] {
  return spellRegistry.listAvailableSpells();
}

// Export the type for use in other files
export type SpellClassName = keyof ReturnType<LazySpellRegistry["getRegistry"]>;
