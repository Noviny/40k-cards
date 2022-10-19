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

const users: UserCreateInput[] = [];

export const createRules: RuleCreateInput[] = [
  {
    name: "Precision of the Hunter",
    details:
      "Each time this WARLORD makes an attack, you can re-roll the hit roll and you can re-roll the wound roll.",
  },
  {
    name: "Aggressive Tactics",
    details:
      'In your Command phase, you can select one friendly <SEPT> CRISIS CORE unit within 9" of this unit\'s COLDSTAR BATTLESUIT COMMANDER model. Until the end of the turn, each time this unit Advances, do not make an Advance roll. Instead, until the end of the phase, add 8" to the Move characteristic of models in this unit.',
  },
  {
    name: "High-altitude Manoeuvres",
    details: `Once per battle, at the start of your Movement phase, you can remove this unit from the battlefield. If you do, then in the Reinforcements step of that phase, you can do one of the following:

- Set this unit back up on the battlefield, anywhere that is more than 9" away from any enemy models.
- If the mission you are playing is using the Strategic Reserves rule, place this unit into Strategic Reserves`,
  },
  {
    name: "Master of War",
    details:
      "While a friendly T'AU EMPIRE CORE unit is within 6\" of this unit's COLDSTAR BATTLESUIT COMMANDER model, each time a CORE model in this unit makes an attack, re-roll a hit-roll of 1.",
  },
  {
    name: "Solid-image Projection Unit",
    details: `- Once per turn, the first time a saving throw is failed for the bearer, the Damage characteristic of that attack is changed to 0.
- The bearer has a 4+ invulnerable save.`,
  },
  {
    name: "Target Lock",
    details: "*ignore light cover",
    // details:
    //   "Each time the bearer makes a ranged attack, the target does not receive the benefits of Light Cover against that attack.",
  },
  {
    name: "Markerlight",
    details:
      "'Fire Markerlights (Action): One or more MARKERLIGHT units from your army can start to perform this action at the start of your Movement phase. AIRCRAFT MARKERLIGHT units can perform this action. The action is completed at the start of your next Shooting phase. If this action is successfully completed, for each model in that unit that is equipped with one or more markerlights, for each markerlight that model is equipped with, select one enemy unit within 36\" of that model that would be an eligible target for that model if its unit had been selected to shoot, and roll one D6: on a 3+, that enemy unit gains one Markerlight token.'",
  },
  {
    name: "Camouflage Fields",
    details:
      "Each time an attack is made against this unit, subtract 1 from that attack's hit roll. Each time a ranged attack is allocated to a model in this unit while it is receiving the benefits of cover, add an additional 1 to any armour saving throw made against that attack.",
  },
  {
    name: "Infiltrator",
    details:
      '	During deployment, when you set up this unit, it can be set up anywhere on the battlefield that is more than 9" away from the enemy deployment zone and any enemy models.',
  },
  {
    name: "Advanced Targeting System",
    details: "*Auto-wound on 6s to hit",
  },
  {
    name: "Shield Generator",
    details: "The bearer has a 4+ invulnerable save.",
  },
  {
    name: "Failure is Not an Option",
    details: "*CORE units within 6\" can use the ethereal's leadership",
  },
  {
    name: "The Humble Stave",
    details: "*Intone 2 invocations, - get +1 to intone",
  },
  {
    name: "Early Warning Override",
    details: "See page 111",
  },
  {
    name: "Master of War,High Altitude Manouevres,Aggressive Tactics",
    details:
      'core within 6" reroll 1s to hit,redeploy once per battle,command phase crisis team advances 8" (p102)',
  },
  { name: "Exemplar of Mont'ka", details: "Command phase ability" },
  {
    name: "Armoured Aggression",
    details: "* Mont'ka pregame move p123",
  },
  {
    name: "Tactical Disengagement",
    details: "*Kauyon redeploy p123",
  },
];

export const tags: TagCreateInput[] = [
  { name: "infantry" },
  { name: "fly" },
  { name: "battlesuit" },
  { name: "jet-pack" },
  { name: "character" },
  { name: "core" },
  { name: "warlord" },
  { name: "tau" },
];

export const weapons: WeaponProfileCreateInput[] = [
  {
    name: "Fusion Blaster",
    AP: "-4",
    dmg: "D6",
    range: '18"',
    type: "Assault",
    shots: "1",
    strength: "8",
    notes:
      "Each time an attack made with this weapon targets a unit within half range, that attack has a Damage characteristic of D6+2.",
  },
  {
    name: "High-output Burst Cannon",
    AP: "-1",
    dmg: "1",
    range: '18"',
    type: "Assault",
    shots: "10",
    strength: "5",
  },
  {
    name: "Missile Pod",
    range: '30"',
    type: "Assault",
    shots: "2",
    strength: "7",
    AP: "-2",
    dmg: "2",
  },
  {
    name: "Pulse Blaster",
    range: '14/8"',
    type: "Assault",
    shots: "2",
    strength: "5/6",
    AP: "-1/-2",
    dmg: "1",
  },
  {
    name: "Pulse Pistol",
    range: '12"',
    type: "Pistol",
    shots: "1",
    strength: "5",
    AP: "0",
    dmg: "1",
  },
  {
    name: "Pulse Rifle",
    range: '36"',
    type: "Rapid Fire",
    shots: "1",
    strength: "5",
    AP: "-1",
    dmg: "1",
  },
  {
    name: "Burst Cannon",
    range: '18"',
    type: "Assault",
    shots: "6",
    strength: "5",
    AP: "0",
    dmg: "1",
  },
  {
    name: "Plasma Rifle",
    range: '30"',
    type: "Assault 1",
    shots: "1",
    strength: "8",
    AP: "-4",
    dmg: "3",
  },
  {
    name: "Tau Flamer",
    range: '12"',
    type: "Assault",
    shots: "d6+2",
    strength: "4",
    AP: "0",
    dmg: "1",
    notes: "*flamer (p111)",
    // notes:
    //   "Each time an attack is made with this weapon, that attack automatically hits the target.",
  },
  {
    name: "Heavy Rail Rifle",
    range: '60"',
    type: "Heavy",
    shots: "2",
    strength: "9",
    AP: "-4",
    dmg: "D3+3",
    notes:
      "Each time a successful wound roll is made for an attack with this weapon, the target suffers 1 mortal wound in addition to any other damage.",
  },
  {
    name: "Cyclic Ion Blaster (standard)",
    range: '18"',
    type: "Assault",
    shots: "3",
    strength: "7",
    AP: "-2",
    dmg: "1",
  },
  {
    name: "Cyclic Ion Blaster (overcharge)",
    range: '18"',
    type: "Assault",
    shots: "3",
    strength: "8",
    AP: "-2",
    dmg: "2",
    notes:
      "Each time an unmodified hit roll of 1 is made for an attack with this weapon profile, the bearer's unit suffers 1 mortal wound after shooting with this weapon",
  },
  {
    name: "Twin SMS",
    range: '30"',
    type: "Heavy",
    shots: "8",
    strength: "5",
    AP: "-1",
    dmg: "1",
    notes:
      "This weapon can target units that are not visible to the bearer. Each time an attack is made with this weapon, the target unit does not receive the benefits of Light Cover against that attack.",
  },
  {
    name: "Accelerator Burst Cannon",
    range: '18"',
    type: "Assault",
    shots: "8",
    strength: "6",
    AP: "-1",
    dmg: "1",
  },
  {
    name: "Pulse Carbine",
    range: '24"',
    type: "Assault",
    shots: "2",
    strength: "5",
    AP: "0",
    dmg: "1",
  },
  {
    name: "Thermoneutronic Projector",
    range: '12"',
    type: "Assault",
    shots: "d6+2",
    strength: "4",
    AP: "-2",
    dmg: "2",
  },
  {
    name: "Thermoneutronic Projector (melee)",
    range: "Melee",
    type: "Melee",
    strength: "4",
    AP: "-2",
    dmg: "2",
    notes:
      "Each time the bearer fights, it makes D6+2 additional attacks with this weapon",
  },
  {
    name: "Onager Gauntlet",
    range: "Melee",
    type: "Melee",
    strength: "12",
    AP: "-4",
    dmg: "3",
  },
  {
    name: "Honour Blade",
    range: "Melee",
    type: "Melee",
    strength: "+2",
    AP: "-1",
    dmg: "2",
    notes:
      "Each time an attack is made with this weapon, subtract 1 from that attack's hit roll.",
  },
  {
    name: "Crushing Bulk",
    range: "Melee",
    type: "Melee",
    strength: "+1",
    AP: "-1",
    dmg: "1",
  },
];

export const statBlocks: UnitStatCreateInput[] = [
  {
    name: "Coldstar Commander",
    M: '14"',
    WS: "3+",
    BS: "2+",
    S: "5",
    T: "5",
    W: "7",
    A: "4",
    Ld: "10",
    Sv: "3+",
  },
  {
    name: "Fire Warrior",
    M: '6"',
    WS: "5+",
    BS: "4+",
    S: "3",
    T: "3",
    W: "1",
    A: "1/2",
    Ld: "7/8",
    Sv: "4+",
  },
  {
    name: "Drone",
    M: '10"',
    WS: "5+",
    BS: "5+",
    S: "3",
    T: "4",
    W: "1",
    A: "1",
    Ld: "6",
    Sv: "4+",
  },
  {
    name: "Shield Drone",
    M: '10"',
    WS: "5+",
    BS: "5+",
    S: "3",
    T: "4",
    W: "2",
    A: "1",
    Ld: "6",
    Sv: "4+/4++",
  },
  {
    name: "Crisis Suit",
    M: '10"',
    WS: "5+",
    BS: "4+",
    S: "5",
    T: "5",
    W: "4",
    A: "3/4",
    Ld: "8/9",
    Sv: "3+",
  },
  {
    name: "Stealth Suit",
    M: '8"',
    WS: "5+",
    BS: "4+",
    S: "4",
    T: "4",
    W: "2",
    A: "2/3",
    Ld: "8/9",
    Sv: "3+",
  },
  {
    name: "Broadside",
    M: '5"',
    WS: "5+",
    BS: "4+",
    S: "5",
    T: "5",
    W: "8",
    A: "3/4",
    Ld: "8/9",
    Sv: "2+",
  },
  {
    name: "Devilfish (7+)",
    M: '12"',
    WS: "6+",
    BS: "4+",
    S: "6",
    T: "7",
    W: "13",
    A: "3",
    Ld: "8",
    Sv: "3+",
  },
  {
    name: "Devilfish (4-6)",
    M: '8"',
    WS: "6+",
    BS: "5+",
    S: "6",
    T: "7",
    W: "*",
    A: "D3",
    Ld: "8",
    Sv: "3+",
  },
  {
    name: "Devilfish (<3)",
    M: '4"',
    WS: "6+",
    BS: "6+",
    S: "6",
    T: "7",
    W: "*",
    A: "1",
    Ld: "8",
    Sv: "3+",
  },
  {
    name: "Ethereal",
    M: '10"',
    WS: "3+",
    BS: "4+",
    S: "3",
    T: "3",
    W: "4",
    A: "3",
    Ld: "10",
    Sv: "5+",
  },
];

export const units: UnitCreateInput[] = [
  {
    name: "Coldstar Commander",
    points: 160,
    role: "HQ",
    keywords: {
      connect: [
        { name: "infantry" },
        { name: "fly" },
        { name: "character" },
        { name: "tau" },
        { name: "battlesuit" },
        { name: "jet-pack" },
        { name: "warlord" },
      ],
    },
    // abilities: {
    //   connect: [
    //     { name: "Precision of the Hunter" },
    //     { name: "Aggressive Tactics" },
    //     { name: "High-altitude Manoeuvres" },
    //     { name: "Master of War" },
    //     { name: "Shield Generator" },
    //     { name: "Target Lock" },
    //   ],
    // },
    stats: {
      connect: { name: "Coldstar Commander" },
    },
    weapons: {
      connect: [
        { name: "Fusion Blaster" },
        { name: "High-output Burst Cannon" },
        { name: "Thermoneutronic Projector" },
        { name: "Thermoneutronic Projector (melee)" },
        { name: "Onager Gauntlet" },
      ],
    },
  },
  // {
  //   name: "Coldstar Commander (2)",
  //   points: 160,
  //   role: "HQ",
  //   keywords: {
  //     connect: [
  //       { name: "infantry" },
  //       { name: "fly" },
  //       { name: "character" },
  //       { name: "tau" },
  //       { name: "battlesuit" },
  //       { name: "jet-pack" },
  //       { name: "warlord" },
  //     ],
  //   },
  //   abilities: {
  //     connect: [
  //       { name: "Precision of the Hunter" },
  //       { name: "Master of War,High Altitude Manouevres,Aggressive Tactics" },
  //       // { name: "High-altitude Manoeuvres" },
  //       // { name: "Master of War" },
  //       { name: "Shield Generator" },
  //       { name: "Target Lock" },
  //     ],
  //   },
  //   stats: {
  //     connect: { name: "Coldstar Commander" },
  //   },
  //   // weapons: {
  //   //   connect: [
  //   //     { name: "Fusion Blaster" },
  //   //     { name: "High-output Burst Cannon" },
  //   //     { name: "Thermoneutronic Projector" },
  //   //     { name: "Thermoneutronic Projector (melee)" },
  //   //     { name: "Onager Gauntlet" },
  //   //   ],
  //   // },
  // },
  {
    name: "Ethereal",
    points: 85,
    role: "HQ",
    keywords: {
      connect: [
        { name: "infantry" },
        { name: "tau" },
        { name: "character" },
        { name: "fly" },
      ],
    },
    abilities: {
      connect: [
        { name: "Failure is Not an Option" },
        { name: "The Humble Stave" },
        { name: "Exemplar of Mont'ka" },
      ],
    },
    stats: {
      connect: { name: "Ethereal" },
    },
    weapons: {
      connect: [{ name: "Honour Blade" }],
    },
  },
  {
    name: "Breachers",
    points: 85,
    role: "Troop",
    keywords: {
      connect: [{ name: "infantry" }, { name: "tau" }, { name: "core" }],
    },
    abilities: {
      connect: [],
    },
    stats: {
      connect: { name: "Fire Warrior" },
    },
    weapons: {
      connect: [{ name: "Pulse Blaster" }, { name: "Pulse Pistol" }],
    },
  },
  {
    name: "Strike Team",
    points: 80,
    role: "Troop",
    keywords: {
      connect: [{ name: "infantry" }, { name: "tau" }, { name: "core" }],
    },
    abilities: {
      connect: [],
    },
    stats: {
      connect: { name: "Fire Warrior" },
    },
    weapons: {
      connect: [{ name: "Pulse Rifle" }, { name: "Pulse Pistol" }],
    },
  },
  {
    name: "Crisis Team",
    points: 269,
    role: "Elite",
    keywords: {
      connect: [
        { name: "infantry" },
        { name: "tau" },
        { name: "core" },
        { name: "battlesuit" },
        { name: "jet-pack" },
        { name: "fly" },
      ],
    },
    abilities: {
      connect: [{ name: "Target Lock" }, { name: "Early Warning Override" }],
    },
    stats: {
      connect: { name: "Crisis Suit" },
    },
    weapons: {
      connect: [
        { name: "Burst Cannon" },
        { name: "Plasma Rifle" },
        { name: "Tau Flamer" },
        { name: "Cyclic Ion Blaster (standard)" },
        { name: "Cyclic Ion Blaster (overcharge)" },
      ],
    },
  },
  {
    name: "Stealth Battlesuits",
    points: 95,
    role: "Elite",
    keywords: {
      connect: [
        { name: "infantry" },
        { name: "tau" },
        { name: "core" },
        { name: "battlesuit" },
        { name: "jet-pack" },
        { name: "fly" },
      ],
    },
    details: `3x stealth suits
2x marker drones`,
    abilities: {
      connect: [{ name: "Camouflage Fields" }, { name: "Infiltrator" }],
    },
    stats: {
      connect: { name: "Stealth Suit" },
    },
    weapons: {
      connect: [{ name: "Burst Cannon" }],
    },
  },
  {
    name: "Broadside Battlesuits",
    points: 110,
    role: "Heavy",
    keywords: {
      connect: [
        { name: "infantry" },
        { name: "tau" },
        { name: "core" },
        { name: "battlesuit" },
      ],
    },
    abilities: {
      connect: [{ name: "Advanced Targeting System" }],
    },
    details: `1x Broadside
2x marker drones`,
    stats: {
      connect: { name: "Broadside" },
    },
    weapons: {
      connect: [
        { name: "Heavy Rail Rifle" },
        { name: "Twin SMS" },
        { name: "Crushing Bulk" },
      ],
    },
  },
  {
    name: "Devilfish",
    points: 95,
    details:
      "See page 123 for explodes, transport cap, drone rules, degradation",
    role: "Transport",
    keywords: {
      connect: [
        { name: "vehicle" },
        { name: "tau" },
        { name: "dedicated transport" },
        { name: "fly" },
      ],
    },
    abilities: {
      connect: [
        { name: "Armoured Aggression" },
        { name: "Tactical Disengagement" },
      ],
    },
    stats: {
      connect: { name: "Devilfish (7+)" },
    },
    weapons: {
      connect: [
        { name: "Accelerator Burst Cannon" },
        { name: "Pulse Carbine" },
      ],
    },
  },
  {
    name: "Marker Drone",
    points: 0,
    role: "Drone",
    keywords: {
      connect: [{ name: "drone" }, { name: "tau" }, { name: "fly" }],
    },
    stats: {
      connect: { name: "Drone" },
    },
  },
  {
    name: "Shield Drone",
    points: 0,
    role: "Drone",
    keywords: {
      connect: [{ name: "drone" }, { name: "tau" }, { name: "fly" }],
    },
    stats: {
      connect: { name: "Shield Drone" },
    },
  },
];

const stratagems: StratagemCreateInput[] = [];

const createUser = async (data: UserCreateInput, context: KeystoneContext) => {
  let user = await context.query.User.findOne({ where: { email: data.email } });

  if (!user) {
    await context.query.User.createOne({ data });
  }
};

export const insertSeedData = async (context: KeystoneContext) => {
  await context.query.Tag.createMany({ data: tags });
  await context.query.Rule.createMany({ data: createRules });

  await context.query.UnitStat.createMany({ data: statBlocks });
  await context.query.WeaponProfile.createMany({ data: weapons });

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
