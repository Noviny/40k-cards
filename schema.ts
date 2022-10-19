// Let's set up a schema for writing army lists

type Detachment = {
  name: string;
  restrictions: Array<any>;
  rules: Rule[];
};

type Rule = {};

type faction = "Tau" | "Necron" | "Adeptus Astartes" | "Adeptus Mechanicus";
type subfaction = "Tau Sept" | "Farsight Enclaves";
type NewUnit = {
  name: string;
  selections: Array<any>;
};

type detachments =
  | "Auxiliary Support"
  | "Battalion"
  | "Brigade"
  | "Fortification Network"
  | "Outrider"
  | "Patrol"
  | "Spearhead"
  | "Super-Heavy"
  | "Super-Heavy Auxiliary"
  | "Supreme Command"
  | "Vanguard";

// the stored roster data
type Roster = {
  army: {
    faction: string;
    subfaction: string;
  };
  detachements: Array<{ type: detachments; units: Array<NewUnit> }>;
};

// the frontend things

// const crisisHardpoint = [
//   { name: "burst cannon", cost: ({ roster, unit, model, option }) => model.options.filter() },
//   { name: "plasma rifle", cost: () => 10 },
// ];

// things that change dynamically
// hidden options 'show' | 'hide'
// costs for things

const costTable = {
  "burst cannon": [5, 10, 15],
  "plasma rifle": [10, 15, 20],
  "Airbursting Fragmentation Projector": [10, 15, 20],
  "Cyclic Ion Blaster": [10, 20, 25],
  "Fusion Blaster": [10, 15, 25],
  "Missile Pod": [10, 15, 20],
  "Plasma Rifle": [10, 15, 20],
  "Tau Flamer": [5, 10, 15],
} as const;

const genericSystems = {
  "Counterfire Defence System": 0,
  "Early Warning Override": 0,
  "Multi-Tracker": 0,
  "Target Lock": 0,
  "Velocity Tracker": 0,
} as const;
const crisisTeamSystems = { ...genericSystems, "shield generator": 5 } as const;

const hpOptions = { ...costTable, ...crisisTeamSystems };

// { roster, unit, model, self }

const crisisCostFunc = ({
  model,
  self,
}: {
  model: { name: string; options: Array<{ name: string; selected: keyof typeof hpOptions }> };
  self: { name: string; selected: keyof typeof hpOptions };
}): number => {
  const selection = hpOptions[self.selected];

  if (typeof selection === "number") {
    return selection;
  }

  const hp1 = model.options.find(({ name }) => name === "hardpoint 1")?.selected === self.selected;
  const hp2 = model.options.find(({ name }) => name === "hardpoint 2")?.selected === self.selected;

  if (self.name === "hardpoint 1") {
    return selection[0];
  }

  if (self.name === "hardpoint 2" && hp1) {
    return selection[1];
  }
  if (self.name === "hardpoint 2" && hp1) {
    return selection[1];
  }
  if ((self.name === "hardpoint 3" && hp1) || hp2) {
    return hp1 && hp2 ? selection[2] : selection[1];
  }
  throw new Error("could not find cost for thingy");
};

const hardpoint = (num: number) => ({
  name: `hardpoint ${num}`,
  options: Object.keys(hpOptions).map((name) => ({ name, points: crisisCostFunc })),
  selected: "burst cannon",
});

const supports = () => ({
  name: "support system",
  options: Object.keys(crisisTeamSystems).map((name) => ({ name, points: crisisCostFunc })),
  selected: null,
});

const TauUnits = [
  {
    name: "Crisis Suit",
    models: [
      {
        name: "Shas'vre",
        points: 40,
        optionsDisplay: "field",
        options: [hardpoint(1), hardpoint(2), hardpoint(3), supports()],
      },
      {
        name: "Shas'ui",
        points: 40,
        options: [hardpoint(1), hardpoint(2), hardpoint(3), supports()],
      },
      {
        name: "Shas'ui",
        points: 40,
        options: [hardpoint(1), hardpoint(2), hardpoint(3), supports()],
      },
    ],
    optionsDisplay: "field",
    options: [],
  },
];

const roster = {
  detachments: [],
};

type Option<T> = Array<T>;

export const unitType = [
  "HQ",
  "TROOPS",
  "ELITES",
  "FAST ATTACK",
  "HEAVY SUPPORT",
  "DEDICATED TRANSPORTS",
  "FLYERS",
  "FORTIFICATIONS",
  "LORDS OF WAR",
  "FLYER",
] as const;

type Profile = {
  name: string;
  // Default to 0
  points?: number;
  // will be defaulted to 0
  min?: number;
  // will be defaulted to max
  max?: number;
  // defaults to to true if min is 0, if min is not 0, you have to take the min number if you pick it
  optional?: boolean;
  // TODO define conditional better - likely use key ref to a prop, maybe use a path
  conditional?: string;
  options?: Array<NewOption>;
  between?: Array<Profile>;
};

type NewOption = {
  name: string;
  points: number;
  variablePoints?: string;
  CP?: number;
  options?: Array<NewOption>;
  between?: Array<NewOption>;
};

export type Unit = {
  name: string;
  points: number;
  role: typeof unitType[number];
  profiles?: Array<Profile>;
  options?: Array<NewOption>;
  conditional?: string;
};

const drones: Unit["profiles"] = [
  // TODO validation on this
  { name: "Gun Drone", max: 2, points: 10 },
  { name: "Marker Drone", max: 2, points: 10 },
  { name: "Shield Drone", max: 2, points: 15 },
];

const DS8: NewOption = {
  name: "DS8 Tactical Support Turret",
  points: 0,
  between: [
    { name: "w/ missile pod", points: 20 },
    { name: "w/ SMS", points: 10 },
  ],
};

const prototypeSystems = [
  {
    name: "Alternating Fusion Blaster",
    points: 25,
    conditional: {
      ANY: ["options.hardpoint 1", "options.hardpoint 2", "options.hardpoint 3"],
      EQUALS: "Fusion Blaster",
    },
  },
  { name: "Dominator Fragmentation Launcher", points: 25 },
  { name: "DW-02 Advanced Burst Cannon", points: 15 },
  { name: "E-H Disruption Suite", points: 30 },
  { name: "Internal Grenade Racks", points: 15 },
  { name: "Novasurge Plasma Rifle", points: 20 },
  { name: "Resonator Warheads", points: 30 },
  { name: "Sensory Negation Countermeasures", points: 15 },
  { name: "Starflare Ignition System", points: 15 },
  { name: "Stimm Injectors", points: 10 },
  { name: "Thermoneutronic Projector", points: 20 },
  { name: "Wide-Spectrum Scanners", points: 20 },
];

const crisisTeamWeapons = [
  {
    name: "Airbursting Fragmentation Projector",
    points: 0,
    variablePoints: "10/15/20",
  },
  { name: "Burst Cannon", points: 0, variablePoints: "5/10/20" },
  { name: "Cyclic Ion Blaster", points: 0, variablePoints: "10/20/25" },
  { name: "Fusion Blaster", points: 0, variablePoints: "10/15/25" },
  { name: "Missile Pod", points: 0, variablePoints: "10/15/20" },
  { name: "Plasma Rifle", points: 0, variablePoints: "10/15/20" },
  { name: "Tau Flamer", points: 0, variablePoints: "5/10/15" },
];

const commanderWeapons = [
  {
    name: "Airbursting Fragmentation Projector",
    points: 0,
    variablePoints: "10/15/20",
  },
  { name: "Burst Cannon", points: 0, variablePoints: "10/15/20" },
  //   { name: "Cyclic Ion Blaster", points: 0, variablePoints: "10/20/25" },
  { name: "Fusion Blaster", points: 0, variablePoints: "15/20/25" },
  { name: "Missile Pod", points: 0, variablePoints: "10/15/25" },
  { name: "Plasma Rifle", points: 0, variablePoints: "10/15/25" },
  { name: "Tau Flamer", points: 0, variablePoints: "5/10/15" },
];

const RelicAndTrait = [
  { name: "Warlord Trait", points: 0, CP: 1 },
  { name: "Relic", points: 0, CP: 1 },
];

const commanderSystems = [...genericSystems, { name: "shield generator", points: 10 }];

export const Tau: Array<Unit> = [
  {
    name: "Aun'Shi",
    points: 105,
    role: "HQ",
    profiles: [{ name: "Drones", min: 2, max: 2, between: drones, optional: true }],
    conditional: "FIX ME: Tau sept and also only one",
  },
  {
    name: "Aun'Va",
    points: 100,
    role: "HQ",
    profiles: [{ name: "Drones", min: 2, max: 2, between: drones, optional: true }],
    conditional: "FIX ME: Tau sept and also only one",
  },
  {
    name: "Cadre Fireblade",
    points: 45,
    role: "HQ",
    profiles: [{ name: "Drones", min: 2, max: 2, between: drones, optional: true }],
    options: RelicAndTrait,
  },
  {
    name: "Commander Farsight",
    points: 100,
    role: "HQ",
    profiles: [{ name: "Drones", min: 2, max: 2, between: drones, optional: true }],
    conditional: "FIX ME: farsight sept and also only one",
  },
  {
    name: "Commander in Coldstar Battlesuit",
    points: 110,
    role: "HQ",
    profiles: [{ name: "Drones", min: 2, max: 2, between: drones, optional: true }],
    options: [
      { name: "hardpoint_1", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_2", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_3", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_4", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "Prototype_System", points: 0, between: prototypeSystems },
      ...RelicAndTrait,
    ],

    conditional: "FIX ME: one commander per detachment",
  },
  {
    name: "Commander in Crisis Battlesuit",
    points: 110,
    role: "HQ",
    profiles: [{ name: "Drones", min: 2, max: 2, between: drones, optional: true }],
    options: [
      { name: "hardpoint_1", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_2", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_3", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_4", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "Iridium_Battlesuit", points: 10 },
      { name: "Prototype_System", points: 0, between: prototypeSystems },
      ...RelicAndTrait,
    ],
    conditional: "FIX ME: one commander per detachment",
  },
  {
    name: "Commander in Enforcer Battlesuit",
    points: 120,
    role: "HQ",
    profiles: [{ name: "Drones", min: 2, max: 2, between: drones, optional: true }],
    options: [
      { name: "hardpoint_1", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_2", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_3", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "hardpoint_4", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems, ...commanderSystems] },
      { name: "Prototype_System", points: 0, between: prototypeSystems },
      ...RelicAndTrait,
    ],
    conditional: "FIX ME: one commander per detachment",
  },
  {
    name: "Commander Shadowsun",
    points: 150,
    role: "HQ",
    conditional: "FIX ME: Tau sept and also only one",
  },
  {
    name: "Darkstrider",
    points: 60,
    role: "HQ",
    conditional: "FIX ME: Tau sept and also only one",
  },
  {
    name: "Darkstrider",
    points: 25,
    role: "HQ",
    // TODO what options
  },
  {
    name: "Ethereal",
    role: "HQ",
    points: 80,
    options: [{ name: "Hover Drone", points: 5 }, ...RelicAndTrait],
    // TODO enforce you must take 0 or 2 drones
    profiles: [{ name: "Drones", min: 2, max: 2, between: drones, optional: true }],
  },
  {
    name: "Longstrike",
    points: 60,
    role: "HQ",
    conditional: "FIX ME: Tau sept and also only one",
    // TODO: options
    options: [],
  },
  {
    name: "Breacher Team",
    points: 85,
    role: "TROOPS",
    profiles: [
      {
        name: "Breacher Fire Warrior Shas-ui",
        min: 1,
        options: [{ name: "Markerlight", points: 5 }],
      },
      { name: "Breacher Fire Warrior", min: 9, max: 9 },
      { name: "Drones", max: 2, between: [...drones, { name: "Guardian Drone", points: 10 }] },
      DS8,
    ],
  },
  {
    name: "Strike Team",
    points: 80,
    role: "TROOPS",
    profiles: [{ name: "Drones", max: 2, between: [...drones, { name: "Guardian Drone", points: 10 }] }, DS8],
  },
  {
    name: "Kroot Carnivores",
    points: 0,
    role: "TROOPS",
    profiles: [{ name: "Kroot", min: 10, max: 20, points: 6 }],
  },
  {
    name: "Crisis Battlesuits",
    role: "ELITES",
    points: 0,
    profiles: [
      {
        name: "Crisis Shas'vre",
        min: 1,
        points: 40,
        options: [
          { name: "hardpoint_1", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "hardpoint_2", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "hardpoint_3", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "support_system", points: 0, between: crisisTeamSystems },
          { name: "Iridium_Battlesuit", points: 10 },
          { name: "Prototype_System", points: 0, between: prototypeSystems },
        ],
      },
      {
        name: "Crisis Shas'ui",
        min: 2,
        max: 5,
        points: 40,
        options: [
          { name: "hardpoint_1", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "hardpoint_2", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "hardpoint_3", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "support_system", points: 0, between: crisisTeamSystems },
        ],
      },
      // TODO refine this so it's dynamic with suit count
      // TODO - 'drones' here is wrong, as
      {
        name: "Drones",
        max: 10,
        between: drones,
        conditional: "{ COUNT: 'profiles.Shas'ui', SET: { max: ${COUNT}x2 } }",
      },
    ],
  },
  {
    name: "Crisis Bodyguards",
    role: "ELITES",
    points: 0,
    profiles: [
      {
        name: "Crisis Shas'vre",
        min: 1,
        points: 40,
        options: [
          { name: "hardpoint_1", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "hardpoint_2", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "hardpoint_3", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "Iridium_Battlesuit", points: 10 },
          { name: "Prototype_System", points: 0, between: prototypeSystems },
        ],
      },
      {
        name: "Crisis Shas'ui",
        min: 1,
        max: 5,
        points: 40,
        options: [
          { name: "hardpoint_1", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "hardpoint_2", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
          { name: "hardpoint_3", points: 0, between: [...crisisTeamWeapons, ...crisisTeamSystems] },
        ],
      },
      // TODO refine this so it's dynamic with suit count
      // TODO - 'drones' here is wrong, as
      {
        name: "Drones",
        max: 10,
        between: drones,
        conditional: "{ COUNT: 'profiles.Shas'ui', SET: { max: ${COUNT}x2 } }",
      },
    ],
  },
  { name: "Kroot Hounds", role: "FAST ATTACK", points: 0, profiles: [{ name: "hounds", points: 6, min: 4, max: 12 }] },
  // TODO add in the options
  { name: "Pahtfinder Team", role: "FAST ATTACK", points: 90 },
  // TODO add in the options
  { name: "Piranhas", role: "FAST ATTACK", points: 0, profiles: [{ name: "piranha", points: 60, min: 1, max: 5 }] },
  // TODO solve how this
  {
    name: "Tactical Drones",
    role: "FAST ATTACK",
    points: 0,
    profiles: [{ name: "piranha", points: 60, min: 1, max: 5 }],
  },
  {
    name: "Vespid Stingwings",
    role: "FAST ATTACK",
    points: 0,
    profiles: [{ name: "vespid", points: 12, min: 5, max: 13 }],
  },
  {
    name: "Broadside Battlesuits",
    role: "HEAVY SUPPORT",
    points: 0,
    profiles: [
      { name: "broadside", points: 85, min: 1, max: 3 },
      { name: "drones", max: 6, between: drones },
    ],
    options: [],
  },
  {
    name: "Broadside Battlesuits",
    role: "HEAVY SUPPORT",
    points: 145,
    options: [],
  },
  {
    name: "Riptide Battlesuit",
    role: "HEAVY SUPPORT",
    points: 240,
    options: [],
  },
  {
    name: "Sky Ray Gunship",
    role: "HEAVY SUPPORT",
    points: 135,
    options: [
      {
        name: "secondary_weapon",
        points: 0,
        between: [
          { name: "Accelerator Burst Cannon", points: 5 },
          { name: "Smart Missile System", points: 5 },
        ],
      },
    ],
  },
  {
    name: "Devilfish",
    role: "DEDICATED TRANSPORTS",
    points: 95,
    options: [
      { name: "Seeker Missile", points: 5 },
      { name: "Smart Missile System", points: 5 },
    ],
  },
  { name: "Razorshark Strike Fighter", role: "FLYER", points: 155 },
  { name: "Sun Shark Bomber", role: "FLYER", points: 155 },
  { name: "Stormsurge", role: "LORDS OF WAR", points: 400, options: [] },
  { name: "Tidewall Droneport", role: "FORTIFICATIONS", points: 80, options: [] },
  { name: "Tidewall Gunrig", role: "FORTIFICATIONS", points: 80 },
  { name: "Tidewall Shieldline", role: "FORTIFICATIONS", points: 80 },
];

type ArmyRules = {
  name: string;
  version: string;
  rules: Array<Rule | Option<Rule>>;
  units: Unit[];
};

type TypeMapping = {
  string: string;
  number: number;
  //   enum: Array<string>;
};

type Property<T = TypeMapping> = {
  [K in keyof T]: {
    valueType: K;
    name: string;
    format?: string;
    // TODO improve this type so options can only SET known types
    options?: Array<string> | Array<{ value: T[K]; SET?: { [key: string]: any }; validate?: any }>;
    value?: T[K];
    validate?: any;
  };
}[keyof T];

type Ruleset = {
  name: string;
  // semver
  version: string;
  // array of army rules to reference
  armies: ArmyRules[];
  properties: { [key: string]: Property };
  detachments: Detachment[];
  unitSchema: { properties: { [key: string]: Property } };
};

const warhammer: Ruleset = {
  name: "Warhammer 40k",
  version: "9.0.0",
  armies: [],
  properties: {
    CP: { name: "CP", valueType: "number", value: 0 },
    battleSize: {
      name: "Battle Size",
      valueType: "string",
      value: "strike force",
      options: [
        {
          value: "strike force",
          SET: { CP: 6 },
          validate: { units: { points: { SUM: { min: 1001, max: 2000 } } } },
        },
        {
          value: "incursion",
          SET: { CP: 3 },
          validate: { units: { points: { SUM: { min: 500, max: 1001 } } } },
        },
      ],
    },
  },
  unitSchema: {
    properties: {
      type: {
        name: "type",
        valueType: "string",
        options: ["hq", "troops", "elites", "fast attack", "heavy support", "flyer", "transport"],
      },
      name: { name: "name", valueType: "string" },
      points: { name: "points", valueType: "number" },
      //   M: { valueType: "number", name: "M", format: '{M}"' },
      //   WS: { valueType: "number", name: "WS", format: "{WS}+" },
      //   BS: { valueType: "number", name: "BS", format: "{BS}+" },
      //   S: { valueType: "number", name: "S" },
      //   T: { valueType: "number", name: "T" },
      //   W: { valueType: "number", name: "W" },
      //   A: { valueType: "number", name: "A" },
      //   Ld: { valueType: "number", name: "A" },
      //   Save: { valueType: "number", name: "Save", format: "{Save}+" },
    },
  },
  detachments: [
    {
      name: "battalion",
      restrictions: [
        { unit: { type: "hq", minimum: 2, maximum: 3 } },
        { unit: { type: "troops", minimum: 3, maximum: 6 } },
        { unit: { type: "elites", minimum: 0, maximum: 6 } },
        { unit: { type: "fast attack", minimum: 0, maximum: 3 } },
        { unit: { type: "heavy support", minimum: 0, maximum: 3 } },
        { unit: { type: "flyer", minimum: 0, maximum: 2 } },
        {
          unit: {
            type: "transport",
            minimum: 0,
            maximum: { IF: { unit: { type: "troop", apply: "count" } } },
          },
        },
      ],
      rules: [{ IF: { unit: { option: {} } } }],
    },
  ],
};

const TauData = {
  name: "T'au Empire",
  rules: [],
  units: [{ name: "" }],
};

type b = typeof warhammer["detachments"][number]["name"];

export {};
