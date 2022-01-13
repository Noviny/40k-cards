import { StratagemInfo, UnitCardDetails, WeaponDetail } from "../types";

const markerLight = {
  name: "Markerlight",
  line: `36" Heavy 1 *`,
  details: "a hit adds a markerlight to the target",
};

const burstCannon = {
  name: "Burst Cannon",
  line: '18" assault 4 5 0 1',
};

const Fireblade: UnitCardDetails = {
  name: "Cadre Fireblade",
  keywords: ["character", "infantry"],
  weapons: [
    { name: "Pulse Rifle", line: `30" Rapid Fire 1 5 0 1` },
    {
      name: "Markerlight",
      line: `36" Heavy 1 *`,
      details: "a hit adds a markerlight to the target",
    },
  ],
  aggressiveStats: {
    M: '6"',
    WS: "3+",
    BS: "2+",
    S: "3",
    A: "3",
  },
  defensiveStats: { T: "3", W: "5", Ld: "8", Sv: "4+" },
  abilities: [
    {
      name: "Volley Fire",
      details: `pulse pistols, pulse carbines and pulse rifles within
      6" fire an extra shot within half range`,
    },
  ],
  points: 45,
};

const TaShi: UnitCardDetails = {
  name: "Ta'Shi",
  keywords: ["battlesuit", "character", "fly", "jet pack", "warlord"],
  aggressiveStats: {
    M: '20"',
    WS: "3+",
    BS: "2+",
    S: "5",
    A: "4",
  },
  defensiveStats: { T: "5", W: "6", Ld: "9", Sv: "3+" },
  gear: "4x fusion blasters",
  points: 180,
  weapons: [
    {
      name: "Fusion Blaster",
      line: `18" Assault 1 8 -4 D6`,
      details: "advantage on attacks within half range",
    },
  ],
  abilities: [
    {
      name: "exemplar of mont'ka",
      details: "Can shoot as if it hadn't advances",
    },
    {
      name: "Coldstar",
      details: 'Advances 20"',
    },
    {
      name: "Master of War",
      details: " ¯\\_(ツ)_/¯",
    },
  ],
};

const droneStats = {
  aggressiveStats: { M: '8"', WS: "5+", BS: "5+", S: "3", A: "1" },
  defensiveStats: { T: "4", W: "1", Ld: "6", Sv: "4+" },
};

const CrisisCommander: UnitCardDetails = {
  name: "Crisis Commander",
  keywords: ["battlesuit", "character", "fly", "jet pack"],
  abilities: [],
  weapons: [{ name: "Missile pod", line: '36" Assault 2 7 -2 D3' }],
  gear: "3x missile pod, ATS, 2x marker drones",
  defensiveStats: { T: "5", W: "5", Ld: "9", Sv: "3+" },
  aggressiveStats: { M: '8"', WS: "3+", BS: "2+", S: "5", A: "4" },
  points: 135,
};

const markerDrones: UnitCardDetails = {
  name: "Marker Drones",
  gear: "card for all marker drones",
  abilities: [
    {
      name: "Stable Platform",
      details: "no penalty for firing heavy weapons after moving",
    },
    {
      name: "broadsides",
      details: "1x marker drone",
    },
  ],
  weapons: [markerLight],
  ...droneStats,
  points: 0,
};

const pulsePistol = {
  name: "Pulse pistol",
  line: '12" Pistol 2 5 0 1',
};
const photonGrenade = {
  name: "Photon Grenade",
  line: '12" Grenade D6 -',
  details: "Blast - no damage but infantry get -1 to hit",
};

const fireWarrior = {
  keywords: ["troops", "infantry"],
  points: 45,
  aggressiveStats: { M: '6"', WS: "5+", BS: "4+", S: "3", A: "1" },
  defensiveStats: { T: "3", W: "1", Ld: "6/7", Sv: "4+" },
};

const getBreachers = (
  overwrites: Partial<UnitCardDetails> = {}
): UnitCardDetails => ({
  name: "breachers",
  ...fireWarrior,
  weapons: [
    {
      name: "Pulse blaster",
      line: '15" Assault 2 4 0 1',
      details: '5 -1 1 within 10", 6 -2 1 within 5"',
    },
    photonGrenade,
    pulsePistol,
  ],
  abilities: [
    {
      name: "squads",
      details: "2 squads of 5 breachers",
    },
  ],
  points: 90,
  ...overwrites,
});

const getStrikeTeam = (
  overwrites: Partial<UnitCardDetails>
): UnitCardDetails => ({
  ...fireWarrior,
  name: "strike team",
  weapons: [
    {
      name: "Pulse rifle",
      line: '30" Rapid fire 1 5 0 1',
    },
    pulsePistol,
    photonGrenade,
  ],
  abilities: [
    {
      name: "squads",
      details: "2 squads of 5 fire warriors",
    },
  ],
  points: 90,
  ...overwrites,
});

const SMS: WeaponDetail = {
  name: "Smart Missile System",
  line: '30" heavy 4 5 0 1',
  details: "ignores line-of-sight and saving throws from cover",
};

const nova = { name: "nova reactor", details: "see rule card" };

const riptideAbilities = [
  { name: "7-14 wounds", details: 'M: 12", A: 3' },
  { name: "4-6 wounds", details: "M: 8, A: 3" },
  { name: "1-3 wounds", details: 'M: 12", A: 2' },
  { name: "nova reactor", details: "see rule card" },
];

const riptideAIA: UnitCardDetails = {
  name: "AIA Riptide",
  gear: "2x SMS, Amplified Ion Accelerator",
  points: 319,
  keywords: ["fly", "battlesuit", "jet pack", "monster"],
  aggressiveStats: { M: "*", WS: "5+", BS: "4+", S: "6", A: "*" },
  defensiveStats: { T: "7", W: "14", Ld: "8", Sv: "2+/5++" },
  abilities: riptideAbilities,
  weapons: [
    SMS,
    { name: "AIA (standard)", line: '72" Heavy 6 8 -4 3' },
    {
      name: "AIA (overcharge)",
      line: '72" Heavy 6 8 -4 3+D3',
      details: "unmodified 1s to hit deal 1 mortal wound",
    },
  ],
};

const riptideHBC: UnitCardDetails = {
  name: "HBC Riptide",
  gear: "2x SMS, Heavy Burst Cannon",
  points: 309,
  keywords: ["fly", "battlesuit", "jet pack", "monster"],
  aggressiveStats: { M: "*", WS: "5+", BS: "4+", S: "6", A: "*" },
  defensiveStats: { T: "7", W: "14", Ld: "8", Sv: "2+/5++" },
  abilities: [
    ...riptideAbilities,
    {
      name: "Advanced Targeting System",
      details: "-1 AP for the weapons",
    },
  ],
  weapons: [
    {
      name: "Smart Missile System",
      line: '30" heavy 4 5 -1 1',
      details: "ignores line-of-sight and saving throws from cover",
    },
    {
      name: "HBC",
      line: '36" heavy 12 6 -2 2',
    },
  ],
};

const shieldedMissileDrones: UnitCardDetails = {
  name: "Shielded Missile Drone",
  points: 0,
  keywords: ["fly"],
  aggressiveStats: { M: '*12"', WS: "5+", BS: "5+", S: "4", A: "1" },
  defensiveStats: { T: "4", W: "1", Ld: "6", Sv: "4+/4++/5+++" },
  abilities: [
    { name: "AIA riptide", details: "2 drones" },
    { name: "HBC riptide", details: "1 drone" },
  ],
  weapons: [{ name: "Missile pod", line: '36" Assault 2 7 -1 D3' }],
};

const getStealthSuit = (
  overwrites: Partial<UnitCardDetails>
): UnitCardDetails => ({
  keywords: ["battlesuit", "infantry", "fly", "jet pack"],
  points: 156,
  aggressiveStats: { M: '8"', WS: "5+", BS: "4+", S: "4", A: "2/3" },
  defensiveStats: { T: "4", W: "2", Ld: "7/8", Sv: "3+" },
  name: "stealth team",
  weapons: [burstCannon],
  abilities: [
    {
      name: "Camouflage Fields",
      details: "-1 to hit against this unit",
    },
    {
      name: "Infiltrator",
      details:
        'during deployment, set up anywhere no in opponents deployment, more than 12" from enemy models',
    },
    { name: "squads", details: "2 squads of 3 stealth suits" },
  ],
  ...overwrites,
});

const crisisTeam: UnitCardDetails = {
  keywords: ["battlesuit", "fly", "jet pack"],
  points: 245,
  aggressiveStats: { M: '8"', WS: "4+", BS: "3+", S: "5", A: "2/3" },
  defensiveStats: { T: "5", W: "3", Ld: "7/8", Sv: "3+" },
  name: "XV8 Team",
  gear: "5 suits w/ 3x burst cannons",
  weapons: [burstCannon],
  abilities: [
    {
      name: "Veteran Cadre",
      details: "this is granting improved WS and BS",
    },
  ],
};
const broadsides: UnitCardDetails = {
  keywords: ["battlesuit"],
  points: 250,
  aggressiveStats: { M: '5"', WS: "5+", BS: "4+", S: "5", A: "2/3" },
  defensiveStats: { T: "5", W: "6", Ld: "7/8", Sv: "2+" },
  name: "Broadsides",
  gear: "3 suits, 2x SMS, Magna Rail Rifle",
  weapons: [
    SMS,
    {
      name: "Magna Rail Rifle",
      line: "Heavy 2 9 -4 D6",
      details:
        "rolling a 6+ to wound inflicts a mortal wound; minimum damage 3",
    },
  ],
};

const gunDrone: UnitCardDetails = {
  ...droneStats,
  name: "Gun Drones",
  gear: "2x on each devilfish",
  points: 0,
  weapons: [{ name: "pulse carbine", line: "assault 2 5 0 1" }],
};

const devilfish: UnitCardDetails = {
  name: "Devilfish",
  gear: "2 equipped w/ burst cannon and 2 gun drones",
  points: 180,
  keywords: ["fly", "vehicle", "transport"],
  aggressiveStats: { M: "*", WS: "6+", BS: "4+", S: "6", A: "*" },
  defensiveStats: { T: "7", W: "12", Ld: "8", Sv: "3+" },
  abilities: [
    { name: "squads", details: "2 devilfish" },
    { name: "7-12 wounds", details: 'M: 12", A: 3' },
    { name: "4-6 wounds", details: "M: 6, A: D3" },
    { name: "1-3 wounds", details: 'M: 3", A: 1' },
    {
      name: "explodes",
      details: 'roll a D6, on a 6, every model within 6" suffers D3 mortals',
    },
  ],
  weapons: [burstCannon],
};

export const stratagems: StratagemInfo[] = [
  {
    name: "Aerial Targeting",
    CP: "1",
    phase: "shooting phase, enemy unit",
    details: "treat the target as if it had an extra markerlight",
  },
  {
    name: "uplinked markerlight",
    CP: "1",
    phase: "on markerlight hit",
    details: "they get D3 extra markerlight",
  },
  {
    name: "Coordinated Engagement",
    CP: "2",
    phase: "shooting phase, an XV8 team",
    details: "treat the target as if it had five markerlights",
  },
  {
    name: "stimulant injector",
    CP: "1",
    phase: "command phase a battlesuit",
    details: "Until end of turn, it acts on best profile",
  },
  {
    name: "fail-safe detonator",
    CP: "1",
    phase: "on death in fight phase, battlesuit",
    details:
      'For each unit within 3", on a 4+ that unit suffers one mortal wound',
  },
  {
    name: "Point Blank Volley",
    CP: "1",
    phase: "shooting phase, a unit",
    details:
      "pulse blasters, pulse carbines and pulse blasters are pistol 2 (but don't gain volley fire)",
  },
  {
    name: "Pulse Onslaught",
    CP: "1",
    phase: "shooting phase, an breacher team",
    details: 'use close profile out to 15"',
  },

  {
    name: "automated repair system",
    CP: "2",
    phase: "commad phase vehicle or battlesuit",
    details: "regain D3 lost wounds",
  },
  {
    name: "neuroweb system jammer",
    CP: "2",
    phase: 'enemy shooting, enemy unit within 18" of a commander',
    details: "Unit gets -1 to hit",
  },
  {
    name: "Repulsor Impact Field",
    CP: "1",
    phase: "enemy charged a battlesuit",
    details:
      'For each enemy model within 3", roll a die and deal a mortal wound on a 6+',
  },
  {
    name: "point-defence targeting relay",
    CP: "1",
    phase: "when a vehicle is charged",
    details: "its overwatch is now 5+",
  },
  {
    name: "Breach and Clear",
    CP: "1",
    phase: "shooting phase breachers shoot at an enemy in cover",
    details: "ignores save from cover, breachers reroll failed wounds",
  },
  {
    name: "Drop Zone Clear",
    CP: "2",
    phase: "shooting phase battlesuit that deep struck",
    details: "+1 to hit",
  },
  {
    name: "Furious Assault",
    CP: "1",
    phase: "charge phase jet pack finishing a charge",
    details: 'D6 roll for units within 1", 3+ causes a mortal wound',
  },
  {
    name: "Drop Zone Clear",
    CP: "2",
    phase: "shooting phase battlesuit that deep struck",
    details: "+1 to hit",
  },
  {
    name: "Danger Close",
    CP: "1",
    phase: "shooting phase, fire warrior unit shooting",
    details: "reroll wounds against enemies within 12 inches",
  },
  {
    name: "Focused Fury",
    CP: "1",
    phase: "shooting phase, a character",
    details: "reroll wounds",
  },
  {
    name: "multi-spectrum sensor suite",
    CP: "1",
    phase: "shooting phase, battlesuit",
    details: "Ignore save bonus from cover",
  },
];

export const units = [
  Fireblade,
  TaShi,
  CrisisCommander,
  markerDrones,
  getBreachers({ name: "Breachers squads" }),
  getStrikeTeam({ name: "Strike squads" }),
  shieldedMissileDrones,
  riptideAIA,
  riptideHBC,
  getStealthSuit({ name: "Stealth teams" }),
  crisisTeam,
  broadsides,
  devilfish,
  gunDrone,
];
