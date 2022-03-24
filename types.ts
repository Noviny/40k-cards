import {
  Rule,
  Tag,
  UnitStat,
  WeaponProfile,
} from "./__generated__/ts-gql/@schema";

export type WeaponDetail = {
  name: string;
  profile: string;
  notes?: string;
};

export type AbilityDetail = { name: string; details: string };
export type Ability = { name: string; text: string };

type Factions = "DA" | "Tau" | "DG" | "Necrons" | "CSM" | "GSC" | "GK";

export type UnitCardDetails = {
  name: string;
  details?: string;
  keywords?: Tag[];
  gear?: string;
  points: number;
  weapons?: WeaponProfile[];
  abilities?: Rule[];
  hide?: boolean;
  role: Role;
  stats: UnitStat;
};

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
