import { UnitCardDetails, StratagemInfo } from "../types";

const Overlord: UnitCardDetails = {
  name: "Overlord",
  keywords: ["character", "infantry", "noble", "warlord"],
  aggressiveStats: { M: '6"', WS: "2+", BS: "2+", S: "5", A: "4" },
  defensiveStats: { T: "5", W: "5", Ld: "10", Sv: "3+/4++" },
  abilities: [
    {
      name: "My Will Be Done",
      details:
        'Command phase: select a core unit within 9", until your next command phase, +1 to hit with them',
    },
    {
      name: "Relentless March",
      details: 'Core units within 6" get +1" to move and advance',
    },
    {
      name: "Implacable Conqueror",
      details: 'Core units within 6" can reroll charge rolls',
    },
    // {
    //   name: "Veil of Darkness",
    //   details:
    //     'Once per battle, in the movement phase, teleport Overlord and 1 core unit within 3" and set up as deep strike within 3" of each other',
    // },
    // {
    //   name: "Resurrection Orb",
    //   details:
    //     'Once per battle, command phase, pick a unit within 6", their reanimation protocols kick off for every unit in the model',
    // },
  ],
  weapons: [
    { name: "Staff of Light(melee)", line: "melee user -2 1" },
    { name: "Staff of Light(ranged)", line: '18" assualt 3 5 -2 1' },
  ],
  points: 125,
  role: "HQ",
};

const Warden: UnitCardDetails = {
  name: "Necron Warden",
  gear: "10x Necron Warriors",
  keywords: ["infantry", "core"],
  aggressiveStats: { M: '5"', WS: "3+", BS: "3+", S: "4", A: "1" },
  defensiveStats: { T: "4", W: "1", Ld: "10", Sv: "4+" },
  abilities: [
    {
      name: "Their Number is Legion",
      details: "Re-roll reanimation protocol rolls of 1 for this unit",
    },
  ],
  weapons: [{ name: "Gauss Flayer", line: '24" Rapid Fire 1, 4 -1 1' }],
  points: 130,
  role: "Troop",
};

const Warriors: UnitCardDetails = {
  name: "Necron Warriors",
  gear: "10x Necron Warriors",
  keywords: ["infantry", "core"],
  aggressiveStats: { M: '5"', WS: "3+", BS: "3+", S: "4", A: "1" },
  defensiveStats: { T: "4", W: "1", Ld: "10", Sv: "4+" },
  abilities: [
    {
      name: "Their Number is Legion",
      details: "Re-roll reanimation protocol rolls of 1 for this unit",
    },
  ],
  weapons: [{ name: "Gauss Flayer", line: '24" Rapid Fire 1, 4 -1 1' }],
  points: 130,
  role: "Troop",
};

const warriors2: UnitCardDetails = {
  ...Warriors,
  weapons: [{ name: "Gauss Reaper", line: '12" Assault 2, 5 -2 1 ' }],
};

const Lychguard: UnitCardDetails = {
  name: "Lychguard",
  gear: "5x Lychguard",
  keywords: ["infantry", "core"],
  aggressiveStats: { M: '5"', WS: "3+", BS: "3+", S: "5", A: "3" },
  defensiveStats: { T: "5", W: "3", Ld: "10", Sv: "3+/4++" },
  abilities: [
    {
      name: "Guardian Protocols",
      details:
        'While a friendly <DYNASTY> INFANTRY NOBLE or DYNASTIC AGENT INFANTRY NOBLE unit is within 3" of this unit, enemy units cannot target that unit with ranged weapons.',
    },
  ],
  weapons: [{ name: "Gauss Flayer", line: '24" Rapid Fire 1 4 -1 1' }],
  points: 140,
  role: "Elite",
};

const skorpekhDestroyers: UnitCardDetails = {
  name: "Skorpekh Destroyers",
  keywords: ["infantry", "core"],
  gear: "2x hyperphase thresher, 1x hyperphase reap-blade",
  aggressiveStats: { M: '8"', WS: "3+", BS: "3+", S: "5", A: "3" },
  defensiveStats: { T: "5", W: "3", Ld: "10", Sv: "3+" },
  abilities: [
    {
      name: "Hardwired for Destruction",
      details: "Each time this model makes an attack, re-roll a hit roll of 1.",
    },
  ],
  weapons: [
    {
      name: "hyperphase thresher",
      line: "melee User -3 2",
      details:
        "Each time the bearer fights, it makes 1 additional attack with this weapon.",
    },
    {
      name: "hyperphase reap-blade",
      line: "melee +2 -4 3",
    },
  ],
  points: 105,
  role: "Elite",
};

export const necronArmy: UnitCardDetails[] = [
  Overlord,
  Warriors,
  Lychguard,
  skorpekhDestroyers,
  warriors2,
];

export const stratagems: StratagemInfo[] = [
  {
    name: "techno-oracular targeting",
    CP: "1",
    phase: "shooting phase, necron unit",
    text: "Before making a wound roll for an attack, you instead just auto-wound",
    faction: "Necrons",
    conditions: "",
  },
  //   {
  //     name: "techno-oracular targeting",
  //     CP: "1",
  //     phase: "shooting phase, lokhust destroyer or heavy destroyer",
  //     details:
  //       "Before making a wound roll for an attack, you instead just auto-wound",
  //   },
  {
    name: "Eternal Protectors",
    CP: "1",
    phase: "fight phase, lychguard",
    text: 'While within 3" of a friendly Noble, get an extra attack per model',
    faction: "Necrons",
    conditions: "",
  },
  {
    name: "Resurrection Protocols",
    CP: "1",
    phase: "on death, infantry noble, OPB",
    text: 'At end of phase, roll a d6, on a 4+, set the model back up within 1" of its death place with D3 wounds',
    faction: "Necrons",
    conditions: "",
  },
  {
    name: "Disintegration Capacitors",
    CP: "1",
    phase: "shooting phase, any unit*",
    text: "gauss weapons in the unit auto-wounds on 6s",
    faction: "Necrons",
    conditions: "",
  },
  {
    name: "Disruption Fields",
    CP: "1",
    phase: "fight phase, core unit",
    text: "+1 to strength for the phase",
    faction: "Necrons",
    conditions: "",
  },
  {
    name: "Relentless Onslaught",
    CP: "1",
    phase: "shooting phase, core infantry",
    text: "rapid fire weapons score extra hit on unmodified 6",
    faction: "Necrons",
    conditions: "",
  },
  {
    name: "Whirling Onslaught",
    CP: "1",
    phase: "when a skorphekh destroyer is attacked",
    text: "-1 to wound rolls against them this phase",
    faction: "Necrons",
    conditions: "",
  },
  {
    name: "Solar Pulse",
    CP: "1",
    phase: "shooting phase, one enemy unit",
    text: "the model doesn't gain the benefits of cover",
    faction: "Necrons",
    conditions: "",
  },
];
