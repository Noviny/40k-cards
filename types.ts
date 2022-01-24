export type WeaponDetail = {
  name: string;
  line: string;
  details?: string;
};

export type AbilityDetail = { name: string; details: string };
export type Ability = { name: string; text: string };

type Factions = "DA" | "Tau" | "DG" | "Necrons" | "CSM" | "GSC" | "GK";

type detailedWeapon = {
  name: string;
  range: number;
  AP: number;
  dmg: string;
  profile: string;
  strength: number;
  notes: string;
};

export type AggressiveStats = {
  M: string;
  WS: string;
  BS: string;
  S: string;
  A: string;
};

export type DefensiveStats = {
  T: string;
  W: string;
  Ld: string;
  Sv: string;
};

export type UnitStats = AggressiveStats & DefensiveStats;

export type UnitCardDetails = {
  name: string;
  keywords?: string[];
  gear?: string;
  points: number;
  weapons?: WeaponDetail[];
  abilities?: AbilityDetail[];
  hide?: boolean;
  role: Role;
} & AggressiveStats &
  DefensiveStats;

export type Role =
  | "HQ"
  | "Flyer"
  | "Elite"
  | "Troop"
  | "Drone"
  | "Transport"
  | "Heavy"
  | "Fast"
  | "misc";

export type StratagemInfo = {
  name: string;
  phase: string;
  conditions: string;
  CP: string;
  text: string;
  faction: Factions;
};
