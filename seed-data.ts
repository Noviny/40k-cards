import { KeystoneContext } from "@keystone-6/core/types";
import {
  RuleCreateInput,
  UserCreateInput,
  UnitCreateInput,
  StratagemCreateInput,
  UnitStatCreateInput,
  WeaponProfileCreateInput,
  TagCreateInput,
} from ".keystone/types";
import { UnitCardDetails, WeaponDetail } from "./types";

const users: UserCreateInput[] = [];

const createRules: RuleCreateInput[] = [
  {
    name: "Living Metal",
    details:
      " At the start of your Command phase, each model in this unit regains 1 lost wound",
  },
  {
    name: "Reanimation Protocols",
    details:
      "After a unit is shot or fought, it begins to reanimate. Anything killed by that fight rolls a d6 for each wound of dead models. If you get 5+s equal to the wounds of a model, that model reanimates.",
  },
  {
    name: "Eternal Conquerors",
    details:
      "Units with this code have the Objective Secured ability. If a model in such a unit already has this ability, that model counts as one additional model when determining control of an objective marker.",
  },
  {
    name: "Relentlessly Expansionist",
    details:
      'At the start of the first battle round, before the first turn begins, units with this code can make a Normal Move of up to 6".',
  },
  {
    name: "Chronometron",
    details:
      'In your Command phase, you can select one friendly <DYNASTY> unit within 9" of this model. Until the start of your next Command phase, you can re-roll charge rolls made for that unit and models in that unit have a 5+ invulnerable save.',
  },
  {
    name: "Veil of Darkness",
    details:
      'Once per battle, in your Movement phase, the bearer can use this Relic. If it does, the bearer\'s unit and up to one friendly <DYNASTY> CORE unit within 3" of the bearer can be removed from the battlefield and set back up anywhere on the battlefield that is more than 9" away from any enemy models. If two units are set back up on the battlefield using this Relic, both units must be placed wholly within 6" of each other.',
  },
  {
    name: "Hardwired for Destruction",
    details: "Each time this model makes an attack, re-roll a hit roll of 1.",
  },
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
    name: "Thrall of the Silent King",
    details:
      'Add 3" to the range of this WARLORD\'s aura abilities (to a maximum of 9"). In addition, when this WARLORD uses its My Will Be Done, The Lord\'s Will or Adaptive Strategy abilities, you can select one friendly <DYNASTY> CORE unit within 12" of this WARLORD instead of 9"',
  },
  {
    name: "Adaptive Strategy",
    details:
      'In your Command phase, you can select one friendly <DYNASTY> CORE unit within 9" of this model. Until the end of the turn, that unit is eligible to shoot and declare a charge with in a turn in which they Fell Back.',
  },
  {
    name: "Their Number is Legion",
    details: "Re-roll reanimation protocol rolls of 1 for this unit",
  },
  {
    name: "Guardian Protocols",
    details:
      'While a friendly <DYNASTY> INFANTRY NOBLE or DYNASTIC AGENT INFANTRY NOBLE unit is within 3" of this unit, enemy units cannot target that unit with ranged weapons.',
  },
];

const tags: TagCreateInput[] = [
  { name: "infantry" },
  { name: "fly" },
  { name: "character" },
  { name: "cryptek" },
  { name: "core" },
  { name: "noble" },
  { name: "warlord" },
  { name: "canoptek" },
  { name: "swarm" },
  { name: "necron" },
];

const weapons: WeaponProfileCreateInput[] = [
  {
    name: "Chronotendrils",
    AP: "0",
    dmg: "1",
    range: "melee",
    type: "Melee",
    strength: "user",
    notes:
      "Each time the bearer fights, it makes 3 additional attacks with this weapon.",
  },
  {
    name: "Entropic Lance (melee)",
    AP: "-3",
    dmg: "3",
    range: "melee",
    strength: "user",
    type: "Melee",
  },
  {
    name: "Hyperphase Sword",
    AP: "-3",
    dmg: "1",
    range: "melee",
    strength: "+1",
    type: "Melee",
  },
  {
    name: "Entropic Lance (shooting)",
    AP: "-3",
    dmg: "D3+3",
    range: '18"',
    strength: "8",
    type: "Assault",
    shots: "1",
  },
  {
    name: "hyperphase thresher",
    AP: "-3",
    dmg: "2",
    range: "Melee",
    strength: "user",
    type: "Melee",
    notes:
      "Each time the bearer fights, it makes 1 additional attack with this weapon.",
  },
  {
    name: "hyperphase reap-blade",
    AP: "-4",
    dmg: "3",
    range: "Melee",
    strength: "+2",
    type: "Melee",
  },
  {
    name: "Voltaic Staff (melee)",
    AP: "-2",
    dmg: "2",
    range: "melee",
    strength: "+1",
    type: "Melee",
  },
  {
    name: "Voltaic Staff (shooting)",
    AP: "-2",
    dmg: "2",
    range: '18"',
    strength: "6",
    type: "Assault",
    shots: "4",
    notes:
      "Each time an attack is made with this weapon, an unmodified hit roll of 6 scores 2 additional hits.",
  },
  {
    name: "Relic Gauss Blaster",
    AP: "-2",
    dmg: "2",
    range: '30"',
    strength: "5",
    type: "Rapid Fire",
    shots: "2",
  },
  {
    name: "Gauss Flayer",
    AP: "-1",
    dmg: "1",
    range: '24"',
    strength: "4",
    type: "Rapid Fire",
    shots: "1",
  },
  {
    name: "Gauss Reaper",
    AP: "-2",
    dmg: "1",
    range: '12"',
    strength: "5",
    type: "Assault",
    shots: "2",
  },
  {
    name: "Feeder Mandibles",
    AP: "0",
    dmg: "1",
    range: "melee",
    strength: "user",
    type: "Melee",
    notes:
      "Each time an attack is made with this weapon, an unmodified hit roll of 6 automatically wounds the target.",
  },
];

const statBlocks: UnitStatCreateInput[] = [
  {
    M: '8"',
    WS: "3+",
    BS: "3+",
    S: "4",
    T: "4",
    W: "4",
    A: "1",
    name: "Chronomancer",
    Sv: "4+/4++",
    Ld: "10",
  },
  {
    M: '8"',
    WS: "3+",
    BS: "3+",
    S: "5",
    T: "5",
    A: "3",
    W: "3",
    name: "Skorpekh Destroyer",
    Sv: "3+",
    Ld: "10",
  },
  {
    name: "Overlord",
    M: '6"',
    WS: "2+",
    BS: "2+",
    S: "5",
    A: "4",
    T: "5",
    W: "5",
    Ld: "10",
    Sv: "3+/4++",
  },
  {
    name: "Royal Warden",
    M: '6"',
    WS: "3+",
    BS: "3+",
    S: "5",
    A: "3",
    T: "5",
    W: "4",
    Ld: "10",
    Sv: "3+",
  },
  {
    name: "Necron Warriors",
    M: '5"',
    WS: "3+",
    BS: "3+",
    S: "4",
    A: "1",
    T: "4",
    W: "1",
    Ld: "10",
    Sv: "4+",
  },
  {
    name: "Lychguard",
    M: '5"',
    WS: "3+",
    BS: "3+",
    S: "5",
    A: "3",
    T: "5",
    W: "2",
    Ld: "10",
    Sv: "3+/4++",
  },
  {
    name: "Canoptek Scarab Swarms",
    M: '10"',
    WS: "-",
    BS: "4+",
    S: "3",
    A: "4",
    T: "3",
    W: "4",
    Ld: "10",
    Sv: "6+",
  },
];

const warriorBase = {
  details: "10x Necron Warriors",
  keywords: {
    connect: [{ name: "infantry" }, { name: "core" }, { name: "necron" }],
  },
  stats: { connect: { name: "Necron Warriors" } },
  abilities: {
    connect: [{ name: "Their Number is Legion" }],
  },
  points: 130,
  role: "Troop",
};

const units: UnitCreateInput[] = [
  {
    name: "Chronomancer",
    points: 90,
    role: "HQ",
    keywords: {
      connect: [
        { name: "infantry" },
        { name: "fly" },
        { name: "character" },
        { name: "cryptek" },
        { name: "necron" },
      ],
    },
    abilities: {
      connect: [{ name: "Chronometron" }, { name: "Veil of Darkness" }],
    },
    stats: {
      connect: { name: "Chronomancer" },
    },
    weapons: {
      connect: [
        { name: "Chronotendrils" },
        { name: "Entropic Lance (melee)" },
        { name: "Entropic Lance (shooting)" },
      ],
    },
  },
  {
    name: "Skorpekh Destroyers",
    keywords: {
      connect: [{ name: "infantry" }, { name: "core" }, { name: "necron" }],
    },
    details: "4x hyperphase thresher, 2x hyperphase reap-blade",
    abilities: {
      connect: [{ name: "Hardwired for Destruction" }],
    },
    weapons: {
      connect: [
        { name: "hyperphase thresher" },
        { name: "hyperphase reap-blade" },
      ],
    },
    points: 210,
    role: "Elite",
  },
  {
    name: "Overlord",
    keywords: {
      connect: [
        { name: "character" },
        { name: "infantry" },
        { name: "noble" },
        { name: "warlord" },
        { name: "necron" },
      ],
    },
    stats: {
      connect: {
        name: "Overlord",
      },
    },
    abilities: {
      connect: [
        { name: "My Will Be Done" },
        { name: "Relentless March" },
        { name: "Thrall of the Silent King" },
      ],
    },
    weapons: {
      connect: [
        { name: "Voltaic Staff (melee)" },
        { name: "Voltaic Staff (shooting)" },
      ],
    },
    points: 95,
    role: "HQ",
  },
  {
    name: "Royal Warden",
    keywords: {
      connect: [
        { name: "infantry" },
        { name: "character" },
        { name: "necron" },
      ],
    },
    stats: { connect: { name: "Royal Warden" } },
    abilities: {
      connect: [{ name: "Relentless March" }, { name: "Adaptive Strategy" }],
    },
    weapons: { connect: [{ name: "Gauss Flayer" }] },
    points: 75,
    role: "HQ",
  },
  // {
  //   name: "Necron Warriors (flayers)",
  //   ...warriorBase,
  //   weapons: { connect: [{ name: "Gauss Flayer" }] },
  // },
  // {
  //   name: "Necron Warriors (reapers)",
  //   ...warriorBase,
  //   weapons: { connect: [{ name: "Gauss Reaper" }] },
  //   points: 260,
  // },
  {
    name: "Lychguard",
    stats: { connect: { name: "Lychguard" } },
    details: "5x Lychguard",
    keywords: {
      connect: [{ name: "infantry" }, { name: "core" }, { name: "necron" }],
    },
    abilities: {
      connect: [{ name: "Guardian Protocols" }],
    },
    weapons: {
      connect: [{ name: "Hyperphase Sword" }],
    },
    points: 140,
    role: "Elite",
  },
  {
    name: "Canoptek Scarab Swarm",
    stats: { connect: { name: "Canoptek Scarab Swarms" } },
    details: "3x swarms",
    keywords: {
      connect: [
        { name: "canoptek" },
        { name: "fly" },
        { name: "swarm" },
        { name: "necron" },
      ],
    },
    weapons: {
      connect: [{ name: "Feeder Mandibles" }],
    },
    points: 45,
    role: "Fast",
  },
];

const stratagems: StratagemCreateInput[] = [];

// const converter = async (
//   {
//     name,
//     keywords,
//     aggressiveStats,
//     defensiveStats,
//     points,
//     role,
//     abilities,
//     gear,
//     hide,
//     weapons,
//   }: UnitCardDetails,
//   context: KeystoneContext
// ): Promise<UnitCreateInput> => {
//   let keywordsQuery = {
//     create: [],
//     connect: [],
//   };

//   if (keywords) {
//     for (const keyword of keywords) {
//       let kw = await context.query.Tag.findOne({
//         where: { name: keyword },
//       });

//       if (kw) {
//         keywordsQuery.connect.push({ name: keyword });
//       } else {
//         keywordsQuery.create.push({ name: keyword });
//       }
//     }
//   }

//   let abilitiesQuery = {
//     create: [],
//     connect: [],
//   };

//   if (abilities) {
//     for (const keyword of abilities) {
//       let kw = await context.query.Tag.findOne({
//         where: { name: keyword },
//       });

//       if (kw) {
//         abilitiesQuery.connect.push({ name: keyword });
//       } else {
//         abilitiesQuery.create.push({ name: keyword });
//       }
//     }
//   }

//   let weaponsQuery = {
//     create: [],
//     connect: [],
//   };

//   if (weapons) {
//     for (const keyword of weapons) {
//       let kw = await context.query.Tag.findOne({
//         where: { name: keyword },
//       });

//       if (kw) {
//         weaponsQuery.connect.push({ name: keyword });
//       } else {
//         weaponsQuery.create.push({ name: keyword });
//       }
//     }
//   }

//   return {
//     name,
//     keywords: keywordsQuery,
//     ...aggressiveStats,
//     ...defensiveStats,
//     points,
//     role,
//     abilities: abilitiesQuery,
//     weapons: weaponsQuery,
//   };
// };

const createTags = async (data: TagCreateInput, context: KeystoneContext) => {
  await context.query.Tag.createMany({ data: tags });
};

const createStats = async (data: TagCreateInput, context: KeystoneContext) => {
  await context.query.UnitStat.createMany({ data: statBlocks });
};
const createWeapons = async (
  data: TagCreateInput,
  context: KeystoneContext
) => {
  await context.query.UnitStat.createMany({ data: weapons });
};

const createUnits = async (data: TagCreateInput, context: KeystoneContext) => {
  await context.query.Unit.createMany({ data: units });
};

const createUser = async (data: UserCreateInput, context: KeystoneContext) => {
  let user = await context.query.User.findOne({ where: { email: data.email } });

  if (!user) {
    await context.query.User.createOne({ data });
  }
};

const createUnit = async (data: UserCreateInput, context: KeystoneContext) => {
  let user = await context.query.User.findOne({ where: { email: data.email } });

  if (!user) {
    await context.query.User.createOne({ data });
  }
};

export const insertSeedData = async (context: KeystoneContext) => {
  // await context.query.Tag.createMany({ data: tags });
  // await context.query.Rule.createMany({ data: createRules });

  // await context.query.UnitStat.createMany({ data: statBlocks });
  // await context.query.WeaponProfile.createMany({ data: weapons });

  let existingUnits = await context.query.Unit.findMany({ query: "name" });

  await context.query.Unit.createMany({
    data: units.filter(
      ({ name }) => !existingUnits.find((u) => u.name === name)
    ),
  });

  for (const user of users) {
    await createUser(user, context);
  }
};
