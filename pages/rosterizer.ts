type AssetTaxonomy = { [key: string]: Taxonomy };
type Taxonomy = {
  keywords?: { Faction: []; General: []; Keywords: [] };
  templateClass?: keyof AssetTaxonomy;
  allowed?: { classifications: string[] };
  aspects?: { [k: string]: boolean | string };
  stats?: { [k: string]: Stat };
  rules?: Rules;
};

type failStates = "pass";
type actions = "add" | "remove";
type operations = "OR" | "AND";

type Eval = {
  paths: [string[]];
  value: string;
  operator: operations;
  not?: boolean;
};

type Action = { paths: [string[]]; actionType: actions; value: string | string[]; not?: boolean; iterations: number };

type Rules = {
  [key: string]: { evals: Array<Eval>; failState: failStates; evaluate: operations; actions: Array<Action> };
};

const unitTypes = ["HQ", "Troops", "Dedicated Transport", "Elites", "Fast Attack", "Heavy Support", "Flyers"];

const getUnitTypes = () => {
  let thing: AssetTaxonomy = {};
  for (let unit of unitTypes) {
    thing[unit] = { templateClass: "Unit" };
  }
  return {
    ...thing,
    "Lords of War": {},
    Fortifications: {},
    "Dedicated Transport": {
      keywords: {
        Faction: [],
        General: [],
        Keywords: [],
      },
      templateClass: "Unit",
    },
  };
};

type TypeMapping = {
  string: string;
  numeric: number;
  rank: string;
  // term: string;
  //   enum: Array<string>;
};

type Stat<T = TypeMapping> = {
  [K in keyof T]: {
    statType: K;
    // name: string;
    group?: string;
    groupOrder?: number;
    statOrder?: number;
    tracked?: boolean;
    icons?: string[];
    format?: string;
    // format?: string;
    // TODO improve this type so options can only SET known types
    // options?: Array<string> | Array<{ value: T[K]; SET?: { [key: string]: any }; validate?: any }>;
    value?: T[K] | null;
    validate?: any;

    // This only applies to rank types, so
    ranks?: {
      [key: string | "-"]: { order: number; format?: string };
    };
    dynamic?: boolean;
  };
}[keyof T];

const assetTaxonomy: AssetTaxonomy = {
  ...getUnitTypes(),
  Detachment: {
    allowed: {
      classifications: ["HQ", "Troops", "Dedicated Transport", "Elites", "Fast Attack", "Heavy Support", "Flyers"],
    },
    aspects: {
      "Group Includes": true,
    },
    stats: {
      CP: {
        value: 0,
        group: "Cost",
        groupOrder: -1,
        tracked: true,
        statType: "numeric",
      },
      "Dedicated Transport": {
        value: null,
        statOrder: 3,
        icons: ["arrow-dunk"],
        statType: "numeric",
      },
      Elites: {
        value: null,
        statOrder: 4,
        icons: ["pirate-flag"],
        statType: "numeric",
      },
      "Fast Attack": {
        value: null,
        statOrder: 5,
        icons: ["power-lightning"],
        statType: "numeric",
      },
      Flyers: {
        value: null,
        statOrder: 7,
        icons: ["bat-blade"],
        statType: "numeric",
      },
      Fortifications: {
        value: null,
        statOrder: 9,
        icons: ["white-tower"],
        statType: "numeric",
      },
      HQ: {
        value: null,
        statOrder: 1,
        icons: ["crowned-skull"],
        tracked: true,
        statType: "numeric",
      },
      "Heavy Support": {
        value: null,
        statOrder: 6,
        icons: ["mine-explosion"],
        statType: "numeric",
      },
      "Lords of War": {
        value: null,
        statOrder: 8,
        icons: ["fist"],
        statType: "numeric",
      },
      Troops: {
        value: null,
        statOrder: 2,
        icons: ["triangle-target"],
        tracked: true,
        statType: "numeric",
      },
      Clan: {
        statType: "rank",
        ranks: {
          "-": {
            order: 0,
          },
          bad: {
            order: 1,
            format: "Bad Moons",
          },
          blood: {
            order: 2,
            format: "Blood Axes",
          },
          death: {
            order: 3,
            format: "Deathskulls",
          },
          evil: {
            order: 4,
            format: "Evil Sunz",
          },
          free: {
            order: 5,
            format: "Freebooterz",
          },
          goff: {
            order: 6,
            format: "Goffs",
          },
          snake: {
            order: 7,
            format: "Snakebites",
          },
        },
        dynamic: true,
      },
    },
    rules: {
      "Clan replacement": {
        evals: [
          {
            paths: [["{self}", "stats", "Clan", "value"]],
            value: "-",
            operator: "AND",
            not: true,
          },
        ],
        failState: "pass",
        evaluate: "OR",
        actions: [
          {
            paths: [["{self}", "assets", "templateClass", "Unit", "keywords", "Faction"]],
            actionType: "remove",
            value: "<clan>",
            iterations: 1,
          },
          {
            paths: [["{self}", "assets", "templateClass", "Unit", "keywords", "Faction"]],
            actionType: "add",
            value: ["{self}", "stats", "Clan", "numbers", "rank", "current"],
            iterations: 1,
          },
        ],
      },
    },
  },
  Models: {
    aspects: {
      "Group Traits": true,
      Type: "game piece",
      "Order Traits A–Z": true,
    },
    stats: {
      A: {
        value: 0,
        statOrder: 7,
        statType: "numeric",
      },
      BS: {
        format: "{v}+",
        value: 0,
        statOrder: 3,
        statType: "numeric",
      },
      Base: {
        statOrder: 10,
        statType: "term",
      },
      Ld: {
        value: 0,
        statOrder: 8,
        statType: "numeric",
      },
      M: {
        format: "{t}″",
        statOrder: 1,
        statType: "term",
      },
      Points: {
        value: 0,
        group: "Cost",
        groupOrder: -1,
        tracked: true,
        statType: "numeric",
      },
      S: {
        value: 0,
        statOrder: 4,
        statType: "numeric",
      },
      Sv: {
        format: "{v}+",
        value: 0,
        statOrder: 9,
        statType: "numeric",
      },
      T: {
        value: 0,
        statOrder: 5,
        statType: "numeric",
      },
      W: {
        value: 0,
        statOrder: 6,
        statType: "numeric",
      },
      WS: {
        format: "{v}+",
        value: 0,
        statOrder: 2,
        statType: "numeric",
      },
    },
  },
  Unit: {
    aspects: {
      Describe: true,
    },
    keywords: {
      Faction: [],
      General: [],
      Keywords: [],
    },
    stats: {
      Points: {
        value: 0,
        statOrder: -1,
        group: "Tracking",
        groupOrder: -1,
        tracked: true,
        statType: "numeric",
      },
      Power: {
        value: 0,
        group: "Tracking",
        groupOrder: -1,
        tracked: true,
        statType: "numeric",
      },
    },
  },
  Wargear: {
    stats: {
      Points: {
        value: 0,
        group: "Cost",
        groupOrder: -1,
        tracked: true,
        statType: "numeric",
      },
    },
  },
  "Warlord Trait": {},
  Weapon: {
    stats: {
      AP: {
        value: 0,
        statOrder: 4,
        statType: "numeric",
      },
      D: {
        value: 0,
        statOrder: 5,
        statType: "numeric",
      },
      Points: {
        value: null,
        format: "+{v}",
        group: "Cost",
        groupOrder: -1,
        tracked: true,
        statType: "numeric",
      },
      Range: {
        statOrder: 1,
        statType: "term",
      },
      S: {
        value: 0,
        statOrder: 3,
        statType: "numeric",
      },
      Type: {
        statOrder: 2,
        statType: "term",
      },
    },
  },
};

const rosterFile: FullManifest = {
  name: "Tau",
  game: "WH40k",
  genre: "sci-fi",
  publisher: "GW",
  url: "https://warhammer40000.com/",
  info: "",
  manifest: {
    assetTaxonomy,
    assetCatalog: {
      "Dedicated Transport§Trukk": {
        classification: "Dedicated Transport",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Trukk"],
        },
        designation: "Trukk",
      },
      "Detachment§Auxiliary Support": {
        classification: "Detachment",
        stats: {
          CP: {
            value: 2,
            statType: "numeric",
          },
          HQ: {},
          asset: {
            value: 0,
            tracked: true,
            max: 1,
            statType: "numeric",
            visibility: "hidden",
          },
        },
        designation: "Auxiliary Support",
      },
      "Detachment§Battalion": {
        classification: "Detachment",
        stats: {
          CP: {
            value: 3,
            statType: "numeric",
          },
          Elites: {
            value: 0,
            tracked: true,
            max: 6,
            statType: "numeric",
          },
          "Fast Attack": {
            value: 0,
            tracked: true,
            max: 3,
            statType: "numeric",
          },
          Flyers: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          HQ: {
            value: 0,
            tracked: true,
            min: 2,
            max: 3,
            statType: "numeric",
          },
          "Heavy Support": {
            value: 0,
            tracked: true,
            max: 3,
            statType: "numeric",
          },
          Troops: {
            value: 0,
            tracked: true,
            min: 3,
            max: 6,
            statType: "numeric",
          },
        },
        designation: "Battalion",
      },
      "Detachment§Brigade": {
        classification: "Detachment",
        stats: {
          CP: {
            value: 4,
            statType: "numeric",
          },
          Elites: {
            value: 0,
            tracked: true,
            min: 3,
            max: 8,
            statType: "numeric",
          },
          "Fast Attack": {
            value: 0,
            tracked: true,
            min: 3,
            max: 5,
            statType: "numeric",
          },
          Flyers: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          HQ: {
            value: 0,
            tracked: true,
            min: 3,
            max: 5,
            statType: "numeric",
          },
          "Heavy Support": {
            value: 0,
            tracked: true,
            min: 3,
            max: 5,
            statType: "numeric",
          },
          Troops: {
            value: 0,
            tracked: true,
            min: 6,
            max: 12,
            statType: "numeric",
          },
        },
        designation: "Brigade",
      },
      "Detachment§Fortification Network": {
        classification: "Detachment",
        stats: {
          CP: {
            value: 1,
            statType: "numeric",
          },
          Fortifications: {
            value: 0,
            tracked: true,
            min: 1,
            max: 3,
            statType: "numeric",
          },
        },
        designation: "Fortification Network",
      },
      "Detachment§Outrider": {
        classification: "Detachment",
        stats: {
          CP: {
            value: 3,
            statType: "numeric",
          },
          Elites: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          "Fast Attack": {
            value: 0,
            tracked: true,
            min: 3,
            max: 6,
            statType: "numeric",
          },
          Flyers: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          HQ: {
            value: 0,
            tracked: true,
            min: 1,
            max: 3,
            statType: "numeric",
          },
          "Heavy Support": {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          Troops: {
            value: 0,
            tracked: true,
            max: 3,
            statType: "numeric",
          },
        },
        designation: "Outrider",
      },
      "Detachment§Patrol": {
        classification: "Detachment",
        stats: {
          CP: {
            value: 2,
            statType: "numeric",
          },
          Elites: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          "Fast Attack": {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          Flyers: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          HQ: {
            value: 0,
            tracked: true,
            min: 1,
            max: 2,
            statType: "numeric",
          },
          "Heavy Support": {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          Troops: {
            value: 0,
            tracked: true,
            min: 1,
            max: 3,
            statType: "numeric",
          },
        },
        designation: "Patrol",
      },
      "Detachment§Spearhead": {
        classification: "Detachment",
        stats: {
          CP: {
            value: 3,
            statType: "numeric",
          },
          Elites: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          "Fast Attack": {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          Flyers: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          HQ: {
            value: 0,
            tracked: true,
            min: 1,
            max: 2,
            statType: "numeric",
          },
          "Heavy Support": {
            value: 0,
            tracked: true,
            min: 3,
            max: 6,
            statType: "numeric",
          },
          Troops: {
            value: 0,
            tracked: true,
            max: 3,
            statType: "numeric",
          },
        },
        designation: "Spearhead",
      },
      "Detachment§Super-Heavy": {
        allowed: {
          classifications: ["Lords of War"],
        },
        classification: "Detachment",
        stats: {
          CP: {
            value: 3,
            statType: "numeric",
          },
          "Lords of War": {
            value: 0,
            tracked: true,
            min: 3,
            max: 5,
            statType: "numeric",
          },
        },
        designation: "Super-Heavy",
      },
      "Detachment§Super-Heavy Auxiliary": {
        allowed: {
          classifications: ["Lords of War"],
        },
        classification: "Detachment",
        stats: {
          CP: {
            value: 3,
            statType: "numeric",
          },
          "Lords of War": {
            value: 0,
            tracked: true,
            min: 1,
            max: 1,
            statType: "numeric",
          },
        },
        designation: "Super-Heavy Auxiliary",
      },
      "Detachment§Supreme Command": {
        allowed: {
          classifications: ["Lords of War", "HQ"],
        },
        classification: "Detachment",
        stats: {
          HQ: {
            value: 0,
            tracked: true,
            max: 1,
            statType: "numeric",
          },
          "Lords of War": {
            value: 0,
            tracked: true,
            max: 1,
            statType: "numeric",
          },
          asset: {
            value: 0,
            tracked: true,
            max: 1,
            statType: "numeric",
            visibility: "hidden",
          },
        },
        designation: "Supreme Command",
      },
      "Detachment§Vanguard": {
        classification: "Detachment",
        stats: {
          CP: {
            value: 3,
            statType: "numeric",
          },
          Elites: {
            value: 0,
            tracked: true,
            min: 3,
            max: 6,
            statType: "numeric",
          },
          "Fast Attack": {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          Flyers: {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          HQ: {
            value: 0,
            tracked: true,
            min: 1,
            max: 2,
            statType: "numeric",
          },
          "Heavy Support": {
            value: 0,
            tracked: true,
            max: 2,
            statType: "numeric",
          },
          Troops: {
            value: 0,
            tracked: true,
            max: 3,
            statType: "numeric",
          },
        },
        designation: "Vanguard",
      },
      "Elites§Burna Boyz": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mob", "Core", "Burna Boyz"],
        },
        designation: "Burna Boyz",
      },
      "Elites§Burna Boyz (Legendary)": {
        classification: "Elites",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Burna Boyz"],
        },
        designation: "Burna Boyz (Legendary)",
      },
      "Elites§Da Red Gobbo": {
        classification: "Elites",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Character", "Gretchin", "Da Red Gobbo"],
        },
        designation: "Da Red Gobbo",
      },
      "Elites§Kommandos": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mob", "Core", "Tankbusta Bombs", "Kommandos"],
        },
        designation: "Kommandos",
      },
      "Elites§Kommandos (Legendary)": {
        classification: "Elites",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Kommandos"],
        },
        designation: "Kommandos (Legendary)",
      },
      "Elites§Mad Dok Grotsnik": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "Deathskulls"],
          General: ["Character", "Infantry", "Painboy", "Mad Dok Grotsnik"],
        },
        designation: "Mad Dok Grotsnik",
      },
      "Elites§Meganobz": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mega Armour", "Nobz", "Mob", "Core", "Meganobz"],
        },
        designation: "Meganobz",
      },
      "Elites§Mek": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Character", "Infantry", "Mek"],
        },
        designation: "Mek",
      },
      "Elites§Mek (Legendary)": {
        classification: "Elites",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Character", "Infantry", "Mek", "Gretchin", "Grot Oiler"],
        },
        designation: "Mek (Legendary)",
      },
      "Elites§Nob with Waaagh! Banner": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Character", "Infantry", "Nob"],
        },
        designation: "Nob with Waaagh! Banner",
      },
      "Elites§Nobz": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mob", "Core", "Nobz"],
        },
        designation: "Nobz",
      },
      "Elites§Painboy": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Character", "Infantry", "Painboy"],
        },
        designation: "Painboy",
      },
      "Elites§Painboy on Warbike": {
        classification: "Elites",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Biker", "Character", "Speed Freeks", "Painboy"],
        },
        designation: "Painboy on Warbike",
      },
      "Elites§Runtherd": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Character", "Infantry", "Runtherd"],
        },
        designation: "Runtherd",
      },
      "Elites§Tankbustas": {
        classification: "Elites",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mob", "Core", "Tankbusta Bombs", "Tankbustas"],
        },
        designation: "Tankbustas",
      },
      "Fast Attack§Boomdakka Snazzwagons": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Speed Freeks", "Boomdakka Snazzwagons"],
        },
        designation: "Boomdakka Snazzwagons",
      },
      "Fast Attack§Deffkoptas": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Fly", "Speed Freeks", "Deffkoptas"],
        },
        designation: "Deffkoptas",
      },
      "Fast Attack§Deffkoptas (Legendary)": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Fly", "Speed Freeks", "Deffkoptas"],
        },
        designation: "Deffkoptas (Legendary)",
      },
      "Fast Attack§Grot Bomm Launcha": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Forge World"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Grot Bomm Launcha"],
        },
        designation: "Grot Bomm Launcha",
      },
      "Fast Attack§Grot Mega-tank": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Gretchin", "Grot Mega-Tank"],
        },
        designation: "Grot Mega-tank",
      },
      "Fast Attack§Grot Tanks": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Gretchin", "Grot Tanks"],
        },
        designation: "Grot Tanks",
      },
      "Fast Attack§Kustom Boosta-blastas": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Speed Freeks", "Kustom Boosta-Blastas"],
        },
        designation: "Kustom Boosta-blastas",
      },
      "Fast Attack§Megatrakk Scrapjets": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Speed Freeks", "Megatrakk Scrapjets"],
        },
        designation: "Megatrakk Scrapjets",
      },
      "Fast Attack§Nob on Smasha Squig": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Cavalry", "Character", "Beast Snagga", "Squig", "Nob", "Nob On Smasha Squig"],
        },
        designation: "Nob on Smasha Squig",
      },
      "Fast Attack§Nobz on Warbikes": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Biker", "Speed Freeks", "Nobz On Warbikes"],
        },
        designation: "Nobz on Warbikes",
      },
      "Fast Attack§Rukkatrukk Squigbuggies": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Speed Freeks", "Rukkatrukk Squigbuggies"],
        },
        designation: "Rukkatrukk Squigbuggies",
      },
      "Fast Attack§Shokkjump Dragstas": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Speed Freeks", "Shokkjump Dragstas"],
        },
        designation: "Shokkjump Dragstas",
      },
      "Fast Attack§Skorchas": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Speed Freeks", "Skorchas"],
        },
        designation: "Skorchas",
      },
      "Fast Attack§Squighog Boyz": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Cavalry", "Beast Snagga", "Squig", "Core", "Squighog Boyz"],
        },
        designation: "Squighog Boyz",
      },
      "Fast Attack§Stormboyz": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Jump Pack", "Fly", "Mob", "Core", "Stormboyz"],
        },
        designation: "Stormboyz",
      },
      "Fast Attack§Warbikers": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Biker", "Speed Freeks", "Core", "Warbikers"],
        },
        designation: "Warbikers",
      },
      "Fast Attack§Warbuggies": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Speed Freeks", "Warbuggies"],
        },
        designation: "Warbuggies",
      },
      "Fast Attack§Wartrakks": {
        classification: "Fast Attack",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Speed Freeks", "Wartrakks"],
        },
        designation: "Wartrakks",
      },
      "Flyers§Attack Fighta": {
        classification: "Flyers",
        keywords: {
          Keywords: ["Forge World"],
          Faction: ["Ork", "<clan>"],
          General: ["Aircraft", "Vehicle", "Fly", "Attack Fighta"],
        },
        designation: "Attack Fighta",
      },
      "Flyers§Blitza-bommer": {
        classification: "Flyers",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Aircraft", "Fly", "Blitza-Bommer"],
        },
        designation: "Blitza-bommer",
      },
      "Flyers§Burna-bommer": {
        classification: "Flyers",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Aircraft", "Fly", "Burna-Bommer"],
        },
        designation: "Burna-bommer",
      },
      "Flyers§Chinork Warkopta": {
        classification: "Flyers",
        keywords: {
          Keywords: ["Forge World"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Aircraft", "Fly", "Transport", "Chinork Warkopta"],
        },
        designation: "Chinork Warkopta",
      },
      "Flyers§Dakkajet": {
        classification: "Flyers",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Aircraft", "Fly", "Dakkajet"],
        },
        designation: "Dakkajet",
      },
      "Flyers§Fighta-bommer": {
        classification: "Flyers",
        keywords: {
          Keywords: ["Forge World"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Aircraft", "Fly", "Fighta-Bommer"],
        },
        designation: "Fighta-bommer",
      },
      "Flyers§Wazbom Blastajet": {
        classification: "Flyers",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Aircraft", "Fly", "Mek", "Wazbom Blastajet"],
        },
        designation: "Wazbom Blastajet",
      },
      "Fortifications§Big’ed Bossbunka": {
        classification: "Fortifications",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Building", "Vehicle", "Transport", "Big’ed Bossbunka"],
        },
        designation: "Big’ed Bossbunka",
      },
      "Fortifications§Mekboy Workshop": {
        classification: "Fortifications",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Mekboy Workshop"],
        },
        designation: "Mekboy Workshop",
      },
      "Heavy Support§Battlewagon": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Wagon", "Battlewagon"],
        },
        designation: "Battlewagon",
      },
      "Heavy Support§Big Gunz": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Legends"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Artillery", "Gretchin", "Big Gunz"],
        },
        designation: "Big Gunz",
      },
      "Heavy Support§Big Trakk": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Big Trakk"],
        },
        designation: "Big Trakk",
      },
      "Heavy Support§Bonebreaka": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Wagon", "Bonebreaka"],
        },
        designation: "Bonebreaka",
      },
      "Heavy Support§Deff Dreads": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Walkerz", "Deff Dreads"],
        },
        designation: "Deff Dreads",
      },
      "Heavy Support§Flash Gitz": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mob", "Flash Gitz"],
        },
        designation: "Flash Gitz",
      },
      "Heavy Support§Gunwagon": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Wagon", "Gunwagon"],
        },
        designation: "Gunwagon",
      },
      "Heavy Support§Hunta Rig": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Beast Snagga", "Hunta Rig"],
        },
        designation: "Hunta Rig",
      },
      "Heavy Support§Kannonwagon": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Kannonwagon"],
        },
        designation: "Kannonwagon",
      },
      "Heavy Support§Kill Rig": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Character", "Psyker", "Beast Snagga", "Weirdboy", "Kill Rig"],
        },
        designation: "Kill Rig",
      },
      "Heavy Support§Killa Kans": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Gretchin", "Walkerz", "Killa Kans"],
        },
        designation: "Killa Kans",
      },
      "Heavy Support§Lifta Wagon": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Forge World"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Battlewagon", "Lifta Wagon"],
        },
        designation: "Lifta Wagon",
      },
      "Heavy Support§Lootas": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mob", "Core", "Lootas"],
        },
        designation: "Lootas",
      },
      "Heavy Support§Mega Dread": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Walkerz", "Mega Dread"],
        },
        designation: "Mega Dread",
      },
      "Heavy Support§Mek Gunz": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Artillery", "Gretchin", "Mek Gunz"],
        },
        designation: "Mek Gunz",
      },
      "Heavy Support§Meka-Dread": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Walkerz", "Meka-Dread"],
        },
        designation: "Meka-Dread",
      },
      "Heavy Support§Squiggoth": {
        classification: "Heavy Support",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Monster", "Transport", "Squiggoth"],
        },
        designation: "Squiggoth",
      },
      "HQ§Beastboss": {
        assets: {
          traits: ["Models§Beastboss"],
          included: [],
        },
        classification: "HQ",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["<Clan>", "Ork"],
          General: ["Beast Snagga", "Beastboss", "Character", "Infantry", "Warboss"],
        },
        stats: {
          Power: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Beastboss",
      },
      "HQ§Beastboss on Squigosaur": {
        assets: {
          traits: ["Models§Beastboss on Squigosaur"],
        },
        classification: "HQ",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["<Clan>", "Ork"],
          General: ["Beast Snagga", "Beastboss", "Cavalry", "Character", "Squig", "Warboss"],
        },
        stats: {
          Power: {
            value: 8,
            statType: "numeric",
          },
          "Thump Gun": {
            statType: "rank",
            ranks: {
              "0": {
                order: 0,
                icons: ["cancel"],
                number: 0,
              },
              "1": {
                order: 1,
                icons: ["bolter-gun"],
                number: 1,
              },
            },
            visibility: "active",
            dynamic: true,
          },
        },
        rules: {
          "Thump gun": {
            evals: [
              {
                paths: [["{self}", "stats", "Thump Gun", "value"]],
                value: "1",
                operator: "AND",
                not: false,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "item", "Models§Beastboss on Squigosaur", "traits"]],
                actionType: "add",
                value: "Weapon§Thump gun 5",
                iterations: 1,
              },
            ],
          },
        },
        designation: "Beastboss on Squigosaur",
      },
      "HQ§Big Mek": {
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Big Mek", "Character", "Gretchin", "Grot Oiler", "Infantry"],
          Keywords: ["Legends"],
        },
        designation: "Big Mek",
      },
      "HQ§Big Mek in Mega Armour": {
        assets: {
          traits: ["Models§Big Mek in Mega Armour"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Big Mek", "Character", "Gretchin", "Grot Oiler", "Infantry", "Mega Armour"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 6,
            statType: "numeric",
          },
          Oiler: {
            statType: "rank",
            ranks: {
              "0": {
                order: 0,
                icons: ["cancel"],
                number: 0,
              },
              "1": {
                order: 1,
                icons: ["goblin-head"],
                number: 1,
              },
            },
            visibility: "active",
            dynamic: true,
          },
          Add: {
            statType: "rank",
            ranks: {
              "-": {
                order: 0,
              },
              telly: {
                order: 1,
              },
              force: {
                order: 2,
              },
            },
            visibility: "active",
            dynamic: true,
          },
          Replace: {
            statType: "rank",
            ranks: {
              "-": {
                order: 0,
              },
              killsaw: {
                order: 1,
              },
              rokkit: {
                order: 2,
              },
              skorcha: {
                order: 3,
              },
              shoota: {
                order: 4,
              },
            },
            visibility: "active",
            dynamic: true,
          },
        },
        rules: {
          "bigmek - remove mega": {
            evals: [
              {
                paths: [["{self}", "stats", "Replace", "value"]],
                value: "-",
                operator: "AND",
                not: true,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "classification", "Models", "traits"]],
                actionType: "remove",
                value: "Weapon§Kustom mega-blasta",
                iterations: 1,
              },
            ],
          },
          "bigmek - add skorcha": {
            evals: [
              {
                paths: [["{self}", "stats", "Replace", "value"]],
                value: "skorcha",
                operator: "AND",
                not: false,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "classification", "Models", "traits"]],
                actionType: "add",
                value: "Wargear§Kombi-skorcha",
                iterations: 1,
              },
            ],
          },
          "bigmek - add killsaw": {
            evals: [
              {
                paths: [["{self}", "stats", "Replace", "value"]],
                value: "killsaw",
                operator: "AND",
                not: false,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "classification", "Models", "traits"]],
                actionType: "add",
                value: "Weapon§Killsaw 5",
                iterations: 1,
              },
            ],
          },
          "bigmek - add rokkit": {
            evals: [
              {
                paths: [["{self}", "stats", "Replace", "value"]],
                value: "rokkit",
                operator: "AND",
                not: false,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "classification", "Models", "traits"]],
                actionType: "add",
                value: "Wargear§Kombi-rokkit",
                iterations: 1,
              },
            ],
          },
          "bigmek - add shoota": {
            evals: [
              {
                paths: [["{self}", "stats", "Replace", "value"]],
                value: "shoota",
                operator: "AND",
                not: false,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "classification", "Models", "traits"]],
                actionType: "add",
                value: "Weapon§Kustom shoota",
                iterations: 1,
              },
            ],
          },
          "bigmek - add telly": {
            evals: [
              {
                paths: [["{self}", "stats", "Add", "value"]],
                value: "telly",
                operator: "AND",
                not: false,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "classification", "Models", "traits"]],
                actionType: "add",
                value: "Weapon§Tellyport blasta",
                iterations: 1,
              },
            ],
          },
          "bigmek - add force": {
            evals: [
              {
                paths: [["{self}", "stats", "Add", "value"]],
                value: "force",
                operator: "AND",
                not: false,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "classification", "Models", "traits"]],
                actionType: "add",
                value: "Wargear§Kustom force field",
                iterations: 1,
              },
            ],
          },
          "bigmek - add oiler": {
            evals: [
              {
                paths: [["{self}", "stats", "Oiler", "value"]],
                value: "1",
                operator: "AND",
                not: false,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            order: 10,
            actions: [
              {
                paths: [["{self}", "traits", "classification", "Models", "traits"]],
                actionType: "add",
                value: "Wargear§Grot Oiler",
                iterations: 1,
              },
            ],
          },
        },
        designation: "Big Mek in Mega Armour",
      },
      "HQ§Big Mek on Warbike": {
        assets: {
          traits: ["Models§Big Mek on Warbike"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Big Mek", "Biker", "Character", "Speed Freeks"],
          Keywords: ["Legends"],
        },
        stats: {
          Power: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Big Mek on Warbike",
      },
      "HQ§Big Mek with Kustom Force Field": {
        assets: {
          traits: ["Models§Big Mek with Kustom Force Field"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Big Mek", "Character", "Gretchin", "Grot Oiler", "Infantry"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Big Mek with Kustom Force Field",
      },
      "HQ§Big Mek with Shokk Attack Gun": {
        assets: {
          traits: ["Models§Big Mek with Shokk Attack Gun"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Big Mek", "Character", "Gretchin", "Grot Oiler", "Infantry"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 6,
            statType: "numeric",
          },
        },
        designation: "Big Mek with Shokk Attack Gun",
      },
      "HQ§Boss Snikrot": {
        assets: {
          traits: ["Models§Boss Snikrot"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Blood Axe", "Ork"],
          General: ["Boss Snikrot", "Character", "Infantry", "Kommando"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Boss Snikrot",
      },
      "HQ§Boss Zagstruk": {
        assets: {
          traits: ["Models§Boss Zagstruk"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Goffs", "Ork"],
          General: ["Boss Zagstruk", "Character", "Fly", "Infantry", "Jump Pack", "Stormboy"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 6,
            statType: "numeric",
          },
        },
        designation: "Boss Zagstruk",
      },
      "HQ§Deffkilla Wartrike": {
        assets: {
          traits: ["Models§Deffkilla Wartrike"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Character", "Defkilla Wartrike", "Speed Freeks", "Speedboss", "Vehicle"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 6,
            statType: "numeric",
          },
        },
        designation: "Deffkilla Wartrike",
      },
      "HQ§Ghazghkull Thraka": {
        assets: {
          traits: ["Models§Ghazghkull Thraka"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Goff", "Ork"],
          General: ["Character", "Ghazghkull Thraka", "Monster", "Warboss"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 15,
            statType: "numeric",
          },
        },
        designation: "Ghazghkull Thraka",
      },
      "HQ§Goff Rocker": {
        assets: {
          traits: ["Models§Goff Rocker"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Goff", "Ork"],
          General: ["Character", "Infantry", "Nob", "Goff Rokker"],
          Keywords: ["Xenos"],
        },
        stats: {
          Power: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Goff Rocker",
      },
      "HQ§Grukk Face-rippa": {
        assets: {
          traits: ["Models§Grukk Face-rippa"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Goff", "Ork"],
          General: ["Character", "Infantry", "Warboss", "Grukk Face-Rippa"],
          Keywords: ["Xenos"],
        },
        stats: {
          Power: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Grukk Face-rippa",
      },
      "HQ§Kaptin Badrukk": {
        assets: {
          traits: ["Models§Kaptin Badrukk"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Freebooterz", "Ork"],
          General: ["Ammo Runts", "Character", "Flash Gitz", "Gretchin", "Infantry", "Kaptin Badrukk"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Kaptin Badrukk",
      },
      "HQ§Makari": {
        assets: {
          traits: ["HQ§Makari"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Goff", "Ork"],
          General: ["Character", "Gretchin", "Infantry", "Makari"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Makari",
      },
      "HQ§Mek Boss Buzzgob": {
        assets: {
          traits: ["Models§Mek Boss Buzzgob"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Goff", "Ork"],
          General: ["Big Mek", "Character", "Gretchin", "Grot Oiler", "Infantry", "Mek Boss Buzzgob"],
          Keywords: ["Imperial Armour"],
        },
        stats: {
          Power: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Mek Boss Buzzgob",
      },
      "HQ§Mozrog Skragbad": {
        assets: {
          traits: ["Models§Mozrog Skragbad"],
        },
        classification: "HQ",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "Snakebites"],
          General: ["Beast Snagga", "Beastboss", "Cavalry", "Character", "Mozrog Skragbad", "Squig", "Warboss"],
        },
        stats: {
          Power: {
            value: 9,
            statType: "numeric",
          },
        },
        designation: "Mozrog Skragbad",
      },
      "HQ§Painboss": {
        assets: {
          traits: ["Models§Painboss"],
        },
        classification: "HQ",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["<Clan>", "Ork"],
          General: ["Beast Snagga", "Character", "Infantry", "Painboss", "Painboy"],
        },
        stats: {
          Power: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Painboss",
      },
      "HQ§Skrak’s Skull-Nobz": {
        assets: {
          traits: ["Models§Skrak’s Skull-Nobz", "Models§Skull-Nob", "Models§Ammo Runt"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Goff", "Ork"],
          General: ["Nobz", "Skrak’s Skull-Nobz", "Infantry", "Gretchin", "Ammo Runts"],
          Keywords: ["Xenos"],
        },
        stats: {
          Power: {
            value: 8,
            statType: "numeric",
          },
        },
        designation: "Skrak’s Skull-Nobz",
      },
      "HQ§Warboss": {
        assets: {
          traits: ["Models§Warboss"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Character", "Infantry", "Warboss"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Warboss",
      },
      "HQ§Warboss in Mega Armour": {
        assets: {
          traits: ["Models§Warboss in Mega Armour"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Character", "Infantry", "Mega Armour", "Warboss"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 6,
            statType: "numeric",
          },
        },
        designation: "Warboss in Mega Armour",
      },
      "HQ§Warboss on Warbike": {
        assets: {
          traits: ["Models§Warboss on Warbike"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Biker", "Character", "Speed Freeks", "Speedboss", "Warboss"],
          Keywords: ["Imperial Armour"],
        },
        stats: {
          Power: {
            value: 6,
            statType: "numeric",
          },
        },
        designation: "Warboss on Warbike",
      },
      "HQ§Weirdboy": {
        assets: {
          traits: ["Models§Weirdboy"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["<Clan>", "Ork"],
          General: ["Character", "Infantry", "Psyker", "Weirdboy"],
          Keywords: ["Codex"],
        },
        stats: {
          Power: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Weirdboy",
      },
      "HQ§Wurrboy": {
        assets: {
          traits: ["Models§Wurrboy"],
        },
        classification: "HQ",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["<Clan>", "Ork"],
          General: ["Beast Snagga", "Character", "Infantry", "Psyker", "Weirdboy", "Wurrboy"],
        },
        stats: {
          Power: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Wurrboy",
      },
      "HQ§Zhadsnark da Ripper": {
        assets: {
          traits: ["Models§Zhadsnark da Ripper"],
        },
        classification: "HQ",
        keywords: {
          Faction: ["Evil Sunz", "Ork"],
          General: ["Biker", "Character", "Speed Freeks", "Warboss", "Zhadsnark da Ripper"],
          Keywords: ["Forge World"],
        },
        stats: {
          Power: {
            value: 6,
            statType: "numeric",
          },
        },
        designation: "Zhadsnark da Ripper",
      },
      "HQ§Zodgrod Wortsnagga": {
        assets: {
          traits: ["Models§Zodgrod Wortsnagga"],
        },
        classification: "HQ",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "Snakebites"],
          General: ["Beast Snagga", "Character", "Infantry", "Runtherd", "Zodgrod Wortsnagga"],
        },
        stats: {
          Power: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Zodgrod Wortsnagga",
      },
      "Lords of War§Dethrolla Battle Fortress": {
        classification: "Lords of War",
        keywords: {
          Keywords: ["Forge World"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Titanic", "Transport", "Dethrolla Battle Fortress"],
        },
        designation: "Dethrolla Battle Fortress",
      },
      "Lords of War§Gargantuan Squiggoth": {
        classification: "Lords of War",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Monster", "Titanic", "Transport", "Gargantuan Squiggoth"],
        },
        designation: "Gargantuan Squiggoth",
      },
      "Lords of War§Gorkanaut": {
        classification: "Lords of War",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Titanic", "Transport", "Walkerz", "Gorkanaut"],
        },
        designation: "Gorkanaut",
      },
      "Lords of War§Kill Krusha": {
        classification: "Lords of War",
        keywords: {
          Keywords: ["Forge World"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Titanic", "Kill Krusha"],
        },
        designation: "Kill Krusha",
      },
      "Lords of War§Kill Tank": {
        classification: "Lords of War",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Titanic", "Kill Tank"],
        },
        designation: "Kill Tank",
      },
      "Lords of War§Kustom Stompa": {
        classification: "Lords of War",
        keywords: {
          Keywords: ["Imperial Armour"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Titanic", "Walkerz", "Kustom Stompa"],
        },
        designation: "Kustom Stompa",
      },
      "Lords of War§Morkanaut": {
        classification: "Lords of War",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Titanic", "Transport", "Walkerz", "Morkanaut"],
        },
        designation: "Morkanaut",
      },
      "Lords of War§Stompa": {
        classification: "Lords of War",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Vehicle", "Transport", "Titanic", "Walkerz", "Stompa"],
        },
        designation: "Stompa",
      },
      "Models§Ammo Runt": {
        classification: "Models",
        stats: {
          A: {
            value: 1,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "25mm",
          },
          Ld: {
            value: 4,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 2,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Ammo Runt",
      },
      "Models§Attack Fighta": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "120 × 92mm flying",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "20-50",
          },
          Points: {
            value: 120,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 12,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Attack Fighta",
      },
      "Models§Battlewagon": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 120,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Battlewagon",
      },
      "Models§Beast Snagga Boy": {
        assets: {
          traits: ["Weapon§Slugga", "Weapon§Choppa"],
        },
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 11,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Beast Snagga Boy",
      },
      "Models§Beast Snagga Nob": {
        assets: {
          traits: ["Weapon§Slugga", "Weapon§Power snappa"],
        },
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 11,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Beast Snagga Nob",
      },
      "Models§Beastboss": {
        allowed: {
          items: [],
        },
        assets: {
          traits: ["Weapon§Shoota", "Weapon§Beast Snagga klaw", "Weapon§Beastchoppa"],
        },
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "50mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 95,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Beastboss",
      },
      "Models§Beastboss on Squigosaur": {
        assets: {
          traits: ["Weapon§Slugga", "Weapon§Beastchoppa", "Weapon§Squigosaur’s jaws"],
        },
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "80mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 145,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 9,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Beastboss on Squigosaur",
      },
      "Models§Big Gun": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 4,
            statType: "numeric",
          },
          M: {
            value: "3",
          },
          Points: {
            value: 8,
            statType: "numeric",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Sv: {
            value: 5,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Big Gun",
      },
      "Models§Big Mek": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 55,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Big Mek",
      },
      "Models§Big Mek in Mega Armour": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "4",
          },
          Points: {
            value: 85,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 2,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        assets: {
          traits: ["Weapon§Kustom mega-blasta", "Weapon§Power klaw"],
        },
        designation: "Big Mek in Mega Armour",
      },
      "Models§Big Mek on Warbike": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            statType: "term",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 81,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Big Mek on Warbike",
      },
      "Models§Big Mek with Kustom Force Field": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 85,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Big Mek with Kustom Force Field",
      },
      "Models§Big Mek with Shokk Attack Gun": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 110,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Big Mek with Shokk Attack Gun",
      },
      "Models§Big Trakk": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 85,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 12,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Big Trakk",
      },
      "Models§Big’ed Bossbunka": {
        classification: "Models",
        stats: {
          A: {
            value: null,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "-",
          },
          Points: {
            value: 75,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 12,
            statType: "numeric",
          },
          WS: {
            value: null,
            statType: "numeric",
          },
        },
        designation: "Big’ed Bossbunka",
      },
      "Models§Blitza-bommer": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "120 × 92mm flying",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "20-60",
          },
          Points: {
            value: 150,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 12,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Blitza-bommer",
      },
      "Models§Bonebreaka": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 175,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Bonebreaka",
      },
      "Models§Boomdakka Snazzwagon": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "150 × 95mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 90,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 8,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Boomdakka Snazzwagon",
      },
      "Models§Boss Meganob": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 35,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 2,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Meganob",
      },
      "Models§Boss Nob (-)": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "6",
          },
          Points: {
            value: 8,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Nob (-)",
      },
      "Models§Boss Nob (b)": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 9,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Nob (b)",
      },
      "Models§Boss Nob (k)": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "6",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Nob (k)",
      },
      "Models§Boss Nob (n)": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 18,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Nob (n)",
      },
      "Models§Boss Nob (s)": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 11,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Nob (s)",
      },
      "Models§Boss Nob (t)": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 17,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Nob (t)",
      },
      "Models§Boss Nob on Warbike (n)": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "75 × 42mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 30,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Nob on Warbike (n)",
      },
      "Models§Boss Nob on Warbike (w)": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "75 × 42mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 25,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Boss Nob on Warbike (w)",
      },
      "Models§Boss Snikrot": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "6",
          },
          Points: {
            value: 95,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Boss Snikrot",
      },
      "Models§Boss Zagstruk": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 110,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Boss Zagstruk",
      },
      "Models§Burna Boy": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 11,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Burna Boy",
      },
      "Models§Burna Boy (l)": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Burna Boy (l)",
      },
      "Models§Burna-bommer": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "120 × 92mm flying",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "20-60",
          },
          Points: {
            value: 135,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 12,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Burna-bommer",
      },
      "Models§Chinork Warkopta": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "120 × 92mm flying",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "16",
          },
          Points: {
            value: 100,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 10,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Chinork Warkopta",
      },
      "Models§Da Red Gobbo": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 3,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 30,
            statType: "numeric",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Sv: {
            value: 5,
            statType: "numeric",
          },
          T: {
            value: 3,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Da Red Gobbo",
      },
      "Models§Dakkajet": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "120 × 92mm flying",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "20-60",
          },
          Points: {
            value: 100,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 12,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Dakkajet",
      },
      "Models§Deff Dread": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "60mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "6",
          },
          Points: {
            value: 85,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 8,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Deff Dread",
      },
      "Models§Deffkilla Wartrike": {
        assets: {
          traits: ["Wargear§Kombi-rokkit"],
        },
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "150 × 95mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 120,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 8,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Deffkilla Wartrike",
      },
      "Models§Deffkopta": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "75 × 42mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 50,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Deffkopta",
      },
      "Models§Deffkopta (-)": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "65mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 20,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Deffkopta (-)",
      },
      "Models§Dethrolla Battle Fortress": {
        classification: "Models",
        stats: {
          A: {
            value: 9,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 310,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 24,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Dethrolla Battle Fortress",
      },
      "Models§Fighta-bommer": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "120 × 92mm flying",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "20-50",
          },
          Points: {
            value: 140,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 14,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Fighta-bommer",
      },
      "Models§Flash Git": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 27,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Flash Git",
      },
      "Models§Gargantuan Squiggoth": {
        classification: "Models",
        stats: {
          A: {
            value: 8,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 9,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 510,
            statType: "numeric",
          },
          S: {
            value: 12,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 36,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Gargantuan Squiggoth",
      },
      "Models§Ghazghkull Thraka": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "80mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "7",
          },
          Points: {
            value: 300,
            statType: "numeric",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Sv: {
            value: 2,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 12,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Ghazghkull Thraka",
      },
      "Models§Goff Rokker": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "25mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Goff Rokker",
      },
      "Models§Gorkanaut": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "170 × 109mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "8",
          },
          Points: {
            value: 365,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 24,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Gorkanaut",
      },
      "Models§Gretchin": {
        classification: "Models",
        stats: {
          A: {
            value: 1,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "25mm",
          },
          Ld: {
            value: 4,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Sv: {
            value: 7,
            statType: "numeric",
          },
          T: {
            value: 3,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Gretchin",
      },
      "Models§Grot Bomm Launcha": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 50,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Grot Bomm Launcha",
      },
      "Models§Grot Mega-tank": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "6+D6",
          },
          Points: {
            value: 90,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 11,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Grot Mega-tank",
      },
      "Models§Grot Oiler": {
        classification: "Models",
        stats: {
          A: {
            value: 1,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "25mm",
          },
          Ld: {
            value: 4,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 4,
            statType: "numeric",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 2,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Grot Oiler",
      },
      "Models§Grot Tank": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "6+D6",
          },
          Points: {
            value: 35,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 6,
            statType: "numeric",
          },
        },
        designation: "Grot Tank",
      },
      "Models§Grukk Face-rippa": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 7,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Grukk Face-rippa",
      },
      "Models§Gunwagon": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 165,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Gunwagon",
      },
      "Models§Hunta Rig": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "170 × 109mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 160,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Hunta Rig",
      },
      "Models§Kannonwagon": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 170,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Kannonwagon",
      },
      "Models§Kaptin": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 27,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Kaptin",
      },
      "Models§Kaptin Badrukk": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 95,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Kaptin Badrukk",
      },
      "Models§Kill Krusha": {
        classification: "Models",
        stats: {
          A: {
            value: 8,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 290,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 24,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Kill Krusha",
      },
      "Models§Kill Rig": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "170 × 109mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 190,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Kill Rig",
      },
      "Models§Kill Tank": {
        classification: "Models",
        stats: {
          A: {
            value: 8,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 275,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 24,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Kill Tank",
      },
      "Models§Killa Kan": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "60mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "6",
          },
          Points: {
            value: 40,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Killa Kan",
      },
      "Models§Kommanda": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "6+D6",
          },
          Points: {
            value: 35,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 6,
            statType: "numeric",
          },
        },
        designation: "Kommanda",
      },
      "Models§Kommando": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "6",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Kommando",
      },
      "Models§Kommando (-)": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "6",
          },
          Points: {
            value: 8,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Kommando (-)",
      },
      "Models§Kustom Boosta-blasta": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "150 × 95mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 80,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 8,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Kustom Boosta-blasta",
      },
      "Models§Kustom Stompa": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 800,
            statType: "numeric",
          },
          S: {
            value: 10,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 40,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Kustom Stompa",
      },
      "Models§Lifta Wagon": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 155,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Lifta Wagon",
      },
      "Models§Loota": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 17,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Loota",
      },
      "Models§Mad Dok Grotsnik": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 85,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Mad Dok Grotsnik",
      },
      "Models§Makari": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "25mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 55,
            statType: "numeric",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 3,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Makari",
      },
      "Models§Mega Dread": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 9,
            statType: "numeric",
          },
          M: {
            value: "8",
          },
          Points: {
            value: 175,
            statType: "numeric",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Mega Dread",
      },
      "Models§Meganob": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 35,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 2,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Meganob",
      },
      "Models§Megatrakk Scrapjet": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "150 × 95mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 90,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 9,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Megatrakk Scrapjet",
      },
      "Models§Mek": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 25,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Mek",
      },
      "Models§Mek (-)": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 22,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Mek (-)",
      },
      "Models§Mek Boss Buzzgob": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            statType: "term",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            statType: "term",
          },
          Points: {
            value: 100,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Mek Boss Buzzgob",
      },
      "Models§Mek Gun": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 4,
            statType: "numeric",
          },
          M: {
            value: "3",
          },
          Points: {
            value: 45,
            statType: "numeric",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Sv: {
            value: 5,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Mek Gun",
      },
      "Models§Meka-Dread": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 4,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 9,
            statType: "numeric",
          },
          M: {
            value: "8",
          },
          Points: {
            value: 165,
            statType: "numeric",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 16,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Meka-Dread",
      },
      "Models§Morkanaut": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "170 × 109mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "8",
          },
          Points: {
            value: 350,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 24,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Morkanaut",
      },
      "Models§Mozrog Skragbad": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "80mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 170,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 9,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Mozrog Skragbad",
      },
      "Models§Nob": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 18,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Nob",
      },
      "Models§Nob on Smasha Squig": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "90 × 52mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 65,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Nob on Smasha Squig",
      },
      "Models§Nob on Warbike": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "75 × 42mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 30,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Nob on Warbike",
      },
      "Models§Nob with Waaagh! Banner": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 70,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Nob with Waaagh! Banner",
      },
      "Models§Ork Boy": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 9,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Ork Boy",
      },
      "Models§Painboss": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "7",
          },
          Points: {
            value: 80,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Painboss",
      },
      "Models§Painboy": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 70,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Painboy",
      },
      "Models§Painboy on Warbike": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "90 × 52mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 90,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Painboy on Warbike",
      },
      "Models§Rukkatrukk Squigbuggy": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "150 × 95mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 90,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 9,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Rukkatrukk Squigbuggy",
      },
      "Models§Runtherd": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 30,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 4,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Runtherd",
      },
      "Models§Shokkjump Dragsta": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "150 × 95mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 85,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 8,
            statType: "numeric",
          },
          WS: {
            value: 4,
            statType: "numeric",
          },
        },
        designation: "Shokkjump Dragsta",
      },
      "Models§Skorcha": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 37,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Skorcha",
      },
      "Models§Skrak Head-smasha": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Skrak Head-smasha",
      },
      "Models§Skull-Nob": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 2,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Skull-Nob",
      },
      "Models§Spanner": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 11,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Spanner",
      },
      "Models§Spanner (-)": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 4,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Spanner (-)",
      },
      "Models§Spanner (o)": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 17,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Spanner (o)",
      },
      "Models§Squiggoth": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 9,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 190,
            statType: "numeric",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 18,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Squiggoth",
      },
      "Models§Squighog Boy": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "75 × 42mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 25,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Squighog Boy",
      },
      "Models§Stompa": {
        classification: "Models",
        stats: {
          A: {
            value: 6,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "10",
          },
          Points: {
            value: 675,
            statType: "numeric",
          },
          S: {
            value: 10,
            statType: "numeric",
          },
          Sv: {
            value: 3,
            statType: "numeric",
          },
          T: {
            value: 8,
            statType: "numeric",
          },
          W: {
            value: 40,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Stompa",
      },
      "Models§Stormboy": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 11,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Stormboy",
      },
      "Models§Tankbusta": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 17,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 1,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Tankbusta",
      },
      "Models§Trukk": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 70,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 10,
            statType: "numeric",
          },
          WS: {
            value: 5,
            statType: "numeric",
          },
        },
        designation: "Trukk",
      },
      "Models§Warbiker": {
        classification: "Models",
        stats: {
          A: {
            value: 2,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "75 × 42mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 25,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 3,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Warbiker",
      },
      "Models§Warboss": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 90,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Warboss",
      },
      "Models§Warboss in Mega Armour": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "50mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 115,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 2,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 7,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Warboss in Mega Armour",
      },
      "Models§Warboss on Warbike": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "100 × 40mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 115,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 7,
            statType: "numeric",
          },
          W: {
            value: 7,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Warboss on Warbike",
      },
      "Models§Warbuggy": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 33,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Warbuggy",
      },
      "Models§Wartrakk": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "model",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "12",
          },
          Points: {
            value: 37,
            statType: "numeric",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Wartrakk",
      },
      "Models§Weirdboy": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "40mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 70,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Weirdboy",
      },
      "Models§Wurrboy": {
        classification: "Models",
        stats: {
          A: {
            value: 3,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "32mm",
          },
          Ld: {
            value: 6,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 70,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 5,
            statType: "numeric",
          },
          WS: {
            value: 3,
            statType: "numeric",
          },
        },
        designation: "Wurrboy",
      },
      "Models§Zhadsnark da Ripper": {
        classification: "Models",
        stats: {
          A: {
            value: 5,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "100 × 40mm",
          },
          Ld: {
            value: 8,
            statType: "numeric",
          },
          M: {
            value: "14",
          },
          Points: {
            value: 120,
            statType: "numeric",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Sv: {
            value: 4,
            statType: "numeric",
          },
          T: {
            value: 6,
            statType: "numeric",
          },
          W: {
            value: 7,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Zhadsnark da Ripper",
      },
      "Models§Zodgrod Wortsnagga": {
        classification: "Models",
        stats: {
          A: {
            value: 4,
            statType: "numeric",
          },
          BS: {
            value: 5,
            statType: "numeric",
          },
          Base: {
            value: "50mm",
          },
          Ld: {
            value: 7,
            statType: "numeric",
          },
          M: {
            value: "5",
          },
          Points: {
            value: 65,
            statType: "numeric",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Sv: {
            value: 6,
            statType: "numeric",
          },
          T: {
            value: 5,
            statType: "numeric",
          },
          W: {
            value: 6,
            statType: "numeric",
          },
          WS: {
            value: 2,
            statType: "numeric",
          },
        },
        designation: "Zodgrod Wortsnagga",
      },
      "Roster§Roster": {
        allowed: {
          classifications: ["Detachment"],
        },
        aspects: {
          Describe: true,
          "Lock Qty": true,
          Rename: true,
          Type: "conceptual",
          Unique: true,
        },
        classification: "Roster",
        stats: {
          CP: {
            value: 0,
            label: "Command Points",
            statOrder: 4,
            tracked: true,
            statType: "numeric",
          },
          Detachments: {
            label: "Battle Size",
            ranks: {
              "1": {
                order: 0,
                format: "Combat Patrol",
                statType: "value",
                number: 1,
              },
              "2": {
                order: 1,
                format: "Incursion",
                statType: "value",
                number: 2,
              },
              "3": {
                order: 2,
                format: "Strike Force",
                statType: "value",
                number: 3,
              },
              "4": {
                order: 3,
                format: "Onslaught",
                statType: "value",
                number: 4,
              },
            },
            statOrder: 1,
            tracked: true,
            statType: "rank",
            dynamic: true,
          },
          Points: {
            value: 0,
            label: "Points Limit",
            statOrder: 3,
            tracked: true,
            statType: "numeric",
          },
          "Power Level": {
            value: 0,
            statOrder: 2,
            tracked: true,
            statType: "numeric",
          },
        },
        designation: "Roster",
      },
      "Troops§Beast Snagga Boyz": {
        assets: {
          included: [
            {
              item: "Models§Beast Snagga Boy",
              quantity: 9,
            },
            "Models§Beast Snagga Nob",
          ],
        },
        classification: "Troops",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mob", "Core", "Beast Snagga", "Beast Snagga Boyz"],
        },
        allowed: {
          items: ["Models§Beast Snagga Boy", "Models§Beast Snagga Nob"],
        },
        designation: "Beast Snagga Boyz",
      },
      "Troops§Boyz": {
        classification: "Troops",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Mob", "Core", "Tankbusta Bombs", "Boyz"],
        },
        designation: "Boyz",
      },
      "Troops§Gretchin": {
        classification: "Troops",
        keywords: {
          Keywords: ["Codex"],
          Faction: ["Ork", "<clan>"],
          General: ["Infantry", "Core", "Gretchin"],
        },
        designation: "Gretchin",
      },
      "Wargear§’Ard case": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 15,
            statType: "numeric",
          },
        },
        text: "Add 1 to this model’s Toughness characteristic. This model cannot use the Open Topped ability.",
        designation: "’Ard case",
      },
      "Wargear§action grot": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 10,
            statType: "numeric",
          },
        },
        text: "Once per battle, when the bearer is selected to fight, you can treat models in this unit as if they are within 1″ of a terrain feature.",
        designation: "action grot",
      },
      "Wargear§Ammo Runt": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "Once per battle, when the bearer makes a ranged attack, you can re-roll the hit roll.",
        designation: "Ammo Runt",
      },
      "Wargear§Big bomb": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "Once per battle, in your Movement phase, after the bearer makes a Normal Move or Advances, you can select one point on the battlefield the bearer moved across this phase. Roll one D6 for each unit within 3″ of that point, subtracting 1 if that unit is a CHARACTER (excluding VEHICLE or MONSTER units); on a 4+, that unit suffers D3 mortal wounds.",
        designation: "Big bomb",
      },
      "Wargear§Blastajet force field": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 20,
            statType: "numeric",
          },
        },
        text: "(Aura) While a friendly ORKS AIRCRAFT model is within 9″ of the bearer, it has a 5+ invulnerable save. The range of this aura ability can never be increased, unless specifically stated otherwise.",
        designation: "Blastajet force field",
      },
      "Wargear§Bomb squig": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "Once per turn, when a unit with a bomb squig is selected to shoot or fire Overwatch, if it has any bomb squigs remaining, the unit can release one. When it does so, you can select one enemy unit (excluding AIRCRAFT) that is within 12″ of the unit with a bomb squig (when firing Overwatch this must be the charging unit) and roll one D6, adding 1 to the result if that enemy unit is a VEHICLE: on a 3+, that enemy unit suffers D3 mortal wounds. The number of bomb squigs the unit is equipped with is then reduced by 1.",
        designation: "Bomb squig",
      },
      "Wargear§Boom bomb": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Once per turn, if the bearer has any boom bombs remaining, it can drop one of them. In your Movement phase, after the bearer makes a Normal Move or Advances, you can select one point on the battlefield the bearer moved across this phase. Roll one D6 for each unit within 6″ of that point, subtracting 1 if that unit is a CHARACTER (excluding VEHICLE or MONSTER units): on a 4+, that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds instead. Each boom bomb can only be dropped once per battle.",
        designation: "Boom bomb",
      },
      "Wargear§Bubblechukka": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "After selecting targets, roll one D3 to determine which of the profiles below to make attacks with. If a unit contains more than one bubblechukka that is targeting the same unit, determine the profiles for each weapon separately before any attacks are resolved against that target.",
        designation: "Bubblechukka",
      },
      "Wargear§Burna bombs": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Once per turn, if the bearer has any burna bombs remaining, it can drop one of them. In your Movement phase, after the bearer makes a Normal Move or Advances, you can select one point on the battlefield the bearer moved across this phase. Roll one D6 for each model within 6″ of that point, subtracting 1 if that model is a CHARACTER (excluding VEHICLE or MONSTER models): on a 5+, that model’s unit suffers 1 mortal wound. Each burna bomb can only be dropped once per battle.",
        designation: "Burna bombs",
      },
      "Wargear§Da Rippa": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one of the profiles below to make attacks with.",
        designation: "Da Rippa",
      },
      "Wargear§Gaze of Gork": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one of the profiles below to make attacks with.",
        designation: "Gaze of Gork",
      },
      "Wargear§Gitfinda squig": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "Each time a ranged attack is made by this model, add 1 to that attack’s hit roll.",
        designation: "Gitfinda squig",
      },
      "Wargear§Grot Oiler": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "Once per battle, when the bearer repairs a VEHICLE model, that model can regain 1 additional lost wound.",
        designation: "Grot Oiler",
      },
      "Wargear§Grot Orderly": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "Once per battle, if a 1 is rolled when using the bearer’s Sawbonez ability you can re-roll the dice.",
        designation: "Grot Orderly",
      },
      "Wargear§Grot-lash": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "The bearer gains the following ability: ‘Grot Lash (Aura): While a friendly GRETCHIN INFANTRY unit is within 3″ of any models equipped with a grot-lash, add 1″ to the Move characteristic of models in that unit.’",
        designation: "Grot-lash",
      },
      "Wargear§Kannon": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one of the profiles below to make attacks with.",
        designation: "Kannon",
      },
      "Wargear§Kannon 15": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 15,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one of the profiles below to make attacks with.",
        designation: "Kannon 15",
      },
      "Wargear§Kannon 5": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one of the profiles below to make attacks with.",
        designation: "Kannon 5",
      },
      "Wargear§Klaw of Gork (or possibly Mork)": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Each time an attack is made with this weapon, select one of the profiles below to make that attack with.",
        designation: "Klaw of Gork (or possibly Mork)",
      },
      "Wargear§Kombi-rokkit": {
        assets: {
          traits: ["Weapon§Shoota", "Weapon§Rokkit"],
        },
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one or both of the profiles below to make attacks with. If you select both, then each time an attack is made with this weapon this phase, subtract 1 from that attack’s hit roll.",
        designation: "Kombi-rokkit",
      },
      "Wargear§Kombi-rokkit 10": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 10,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one or both of the profiles below to make attacks with. If you select both, then each time an attack is made with this weapon this phase, subtract 1 from that attack’s hit roll.",
        designation: "Kombi-rokkit 10",
      },
      "Wargear§Kombi-rokkit 5": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one or both of the profiles below to make attacks with. If you select both, then each time an attack is made with this weapon this phase, subtract 1 from that attack’s hit roll.",
        designation: "Kombi-rokkit 5",
      },
      "Wargear§Kombi-skorcha": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one or both of the profiles below to make attacks with. If you select both, then each time an attack is made with this weapon this phase, subtract 1 from that attack’s hit roll.",
        designation: "Kombi-skorcha",
      },
      "Wargear§Kombi-skorcha 10": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 10,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one or both of the profiles below to make attacks with. If you select both, then each time an attack is made with this weapon this phase, subtract 1 from that attack’s hit roll.",
        designation: "Kombi-skorcha 10",
      },
      "Wargear§Krusha kannon": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Before selecting targets, select one of the profiles below to make attacks with.",
        designation: "Krusha kannon",
      },
      "Wargear§Kustom force field": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 30,
            statType: "numeric",
          },
        },
        text: "(Aura) While a friendly ORKS unit is within 6″ of the bearer, it has a 6+ invulnerable save. The range of this aura ability can never be increased, unless specifically stated otherwise.",
        designation: "Kustom force field",
      },
      "Wargear§Mega-choppa": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Each time an attack is made with this weapon, select one of the profiles below to make that attack with.",
        designation: "Mega-choppa",
      },
      "Wargear§Squig hound": {
        classification: "Wargear",
        stats: {
          Points: {
            value: 5,
            statType: "numeric",
          },
        },
        text: "The bearer gains the following ability: ‘Squig Hound (Aura): While a friendly GRETCHIN INFANTRY unit is within 3″ of the bearer, models in that unit ignore modifiers to Combat Attrition tests.’",
        designation: "Squig hound",
      },
      "Wargear§Squig mine": {
        classification: "Wargear",
        stats: {
          Points: {
            value: null,
            statType: "numeric",
          },
        },
        text: "Once per turn, at the end of your Movement phase, if this unit has any squig mines remaining, this unit can release one. Select one enemy VEHICLE unit that is within 6″ of this unit and roll one D6: on a 3-5, that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds instead. The number of squig mines this unit is equipped with is then reduced by 1.",
        designation: "Squig mine",
      },
      "Warlord Trait§’Ard as Nails": {
        classification: "Warlord Trait",
        text: "Each time an attack is made that targets this WARLORD, subtract 1 from that attack’s wound roll.",
        designation: "’Ard as Nails",
      },
      "Warlord Trait§Beastgob (Aura)": {
        classification: "Warlord Trait",
        text: 'While a friendly <CLAN> SQUIG unit is within 6" of this WARLORD, each time a model in that unit makes a melee attack with squighog jaws, smasha squig jaws or a squigosaur’s jaws, add 1 to that attack’s Damage characteristic.',
        designation: "Beastgob (Aura)",
      },
      "Warlord Trait§Big Gob": {
        classification: "Warlord Trait",
        text: 'Add 3" to the range of this WARLORD’s aura abilities (to a maximum of 9").',
        designation: "Big Gob",
      },
      "Warlord Trait§Brutal but Kunnin’": {
        classification: "Warlord Trait",
        text: "Each time this WARLORD fights, if all of its attacks target one enemy unit, after resolving all of those attacks, it can make a number of additional attacks against that enemy unit equal to the number of attacks that did not reach the Inflict Damage step of the attack sequence during that fight.",
        designation: "Brutal but Kunnin’",
      },
      "Warlord Trait§Follow Me Ladz (Aura)": {
        classification: "Warlord Trait",
        text: "If this WARLORD has made a charge move this turn, until the end of the turn, each time a friendly <CLAN> ORKS unit declares a charge against an enemy unit that is within Engagement Range of this WARLORD, add 1 to the charge roll for that unit.",
        designation: "Follow Me Ladz (Aura)",
      },
      "Warlord Trait§Foul Temper": {
        classification: "Warlord Trait",
        text: "While this Warlord has fewer wounds remaining than its Wounds characteristic, add 3 to its Attacks characteristic.",
        designation: "Foul Temper",
      },
      "Warlord Trait§Inspiring Leader (Aura)": {
        classification: "Warlord Trait",
        text: 'Add 1 to the Leadership characteristic of friendly units while they are within 6" of this WARLORD.',
        designation: "Inspiring Leader (Aura)",
      },
      "Warlord Trait§Killa Reputation (Aura)": {
        classification: "Warlord Trait",
        text: 'While an enemy unit is within 3" of this model, subtract 1 from the Leadership characteristic of models in that unit, and each time a Combat Attrition test is taken for that unit, subtract 1 from that Combat Attrition test.\n\nWhile a friendly FREEBOOTERZ unit is within 6" of this model, add 1 to the Leadership characteristic of models in that unit.',
        designation: "Killa Reputation (Aura)",
      },
      "Warlord Trait§Proper Killy": {
        classification: "Warlord Trait",
        text: "Add 1 to this WARLORD’s Attacks characteristic.\n\nEach time this WARLORD makes a melee attack, improve the Armour Penetration characteristic of that attack by 1.",
        designation: "Proper Killy",
      },
      "Warlord Trait§Surly as a Squiggoth": {
        classification: "Warlord Trait",
        text: "The first time this WARLORD is destroyed, you can choose to roll one D6 at the end of the phase instead of using any rules that are triggered when a model is destroyed (e.g. the Orks is Never Beaten Stratagem). If you do so, then on a 4+, set this WARLORD back up on the battlefield as close as possible to where they were destroyed and not within Engagement Range of any enemy models, with D3 wounds remaining.",
        designation: "Surly as a Squiggoth",
      },
      "Weapon§’Eavy lobba": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer.",
        designation: "’Eavy lobba",
      },
      "Weapon§’Uge choppa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "’Uge choppa",
      },
      "Weapon§’Urty syringe": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon. Each time an attack is made with this weapon, unless the target is a VEHICLE or TITANIC unit, that attack always wounds on an unmodified wound roll of 2+.",
        designation: "’Urty syringe",
      },
      "Weapon§1: Big bubble": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3D3",
          },
        },
        text: "Blast",
        designation: "1: Big bubble",
      },
      "Weapon§2: Wobbly bubble": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast",
        designation: "2: Wobbly bubble",
      },
      "Weapon§3: Dense bubble": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3+3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 10,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 1",
          },
        },
        designation: "3: Dense bubble",
      },
      "Weapon§Attack squig": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 2 additional attacks with this weapon and no more than 2 attacks can be made with this weapon.",
        designation: "Attack squig",
      },
      "Weapon§Attack squig 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 2 additional attacks with this weapon and no more than 2 attacks can be made with this weapon.",
        designation: "Attack squig 5",
      },
      "Weapon§Beast Snagga klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll.",
        designation: "Beast Snagga klaw",
      },
      "Weapon§Beast Snagga klaw 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll.",
        designation: "Beast Snagga klaw 5",
      },
      "Weapon§Beastchoppa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon.",
        designation: "Beastchoppa",
      },
      "Weapon§Belly gun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 50,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Blast",
        designation: "Belly gun",
      },
      "Weapon§Big Chompa’s jaws": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 3 additional attacks with this weapon and no more than 3 attacks can be made with this weapon. Each time an attack is made with this weapon, an unmodified wound roll of 6 inflicts 4 mortal wounds on the target and the attack sequence ends.",
        designation: "Big Chompa’s jaws",
      },
      "Weapon§Big choppa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Big choppa",
      },
      "Weapon§Big choppa 3": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 3,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Big choppa 3",
      },
      "Weapon§Big choppa 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Big choppa 5",
      },
      "Weapon§Big shoota": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 5/3",
          },
        },
        designation: "Big shoota",
      },
      "Weapon§Big shoota 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 5/3",
          },
        },
        designation: "Big shoota 5",
      },
      "Weapon§Blast burna": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Blast",
        designation: "Blast burna",
      },
      "Weapon§Blitz missiles": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Assault D3",
          },
        },
        text: "Blast",
        designation: "Blitz missiles",
      },
      "Weapon§Boom shell": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "60″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 2D6",
          },
        },
        text: "Blast",
        designation: "Boom shell",
      },
      "Weapon§Boombits": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Boombits",
      },
      "Weapon§Breacha ram": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, the target does not receive the benefits of cover against that attack.",
        designation: "Breacha ram",
      },
      "Weapon§Burna": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon profile, that attack automatically hits the target.",
        designation: "Burna",
      },
      "Weapon§Burna (melee)": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Burna (melee)",
      },
      "Weapon§Burna (shooting)": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "8″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Assault D3",
          },
        },
        text: "Before a unit fires this weapon, roll once for the number of attacks and use this for all burnas fired by the unit until the end of the phase. This weapon automatically hits its target.",
        designation: "Burna (shooting)",
      },
      "Weapon§Burna 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Burna 5",
      },
      "Weapon§Burna bottles": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "6″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Grenade 2D3",
          },
        },
        text: "Blast. Each time an attack is made with this weapon, the target does not receive the benefits of cover against that attack.",
        designation: "Burna bottles",
      },
      "Weapon§Burna exhaust": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "8″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Burna exhaust",
      },
      "Weapon§Burna sm": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Burna sm",
      },
      "Weapon§Bursta kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 50,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 10,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Blast. Each time an attack is made with this weapon against a target within half range, add 1 to that attack’s hit roll.",
        designation: "Bursta kannon",
      },
      "Weapon§Butcha boyz": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 4 additional attacks with this weapon and no more than 4 attacks can be made with this weapon.",
        designation: "Butcha boyz",
      },
      "Weapon§Choppa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon.",
        designation: "Choppa",
      },
      "Weapon§Crush": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: 6,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Crush",
      },
      "Weapon§Cutta": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2",
          },
        },
        text: "Each time an attack made with this weapon profile targets a unit within half range, that attack has a Damage characteristic of D6+2.",
        designation: "Cutta",
      },
      "Weapon§Da Grabzappa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Da Grabzappa",
      },
      "Weapon§Da Pain Klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon against an INFANTRY or MONSTER unit, an unmodified hit roll of 6 inflicts 1 mortal wound on the target in addition to the normal damage.",
        designation: "Da Pain Klaw",
      },
      "Weapon§Da Vulcha’s Klaws": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Da Vulcha’s Klaws",
      },
      "Weapon§Dakkagun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 5/3",
          },
        },
        designation: "Dakkagun",
      },
      "Weapon§Deff rolla": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, treat the bearer as having a Weapon Skill characteristic of 2+.",
        designation: "Deff rolla",
      },
      "Weapon§Deff rolla 15": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 15,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, treat the bearer as having a Weapon Skill characteristic of 2+.",
        designation: "Deff rolla 15",
      },
      "Weapon§Deff rolla 20": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 20,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, treat the bearer as having a Weapon Skill characteristic of 2+.",
        designation: "Deff rolla 20",
      },
      "Weapon§Deffgun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 3/2",
          },
        },
        designation: "Deffgun",
      },
      "Weapon§Deffkannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "72″",
          },
          S: {
            value: 10,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Blast",
        designation: "Deffkannon",
      },
      "Weapon§Deffstorm mega-shoota": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 30/20",
          },
        },
        designation: "Deffstorm mega-shoota",
      },
      "Weapon§Dread killsaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon.",
        designation: "Dread killsaw",
      },
      "Weapon§Dread klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon.",
        designation: "Dread klaw",
      },
      "Weapon§Dread rippa klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D3+3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Dread rippa klaw",
      },
      "Weapon§Eyez of Mork": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2",
          },
        },
        designation: "Eyez of Mork",
      },
      "Weapon§Frag": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast",
        designation: "Frag",
      },
      "Weapon§Gaze of Mork": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: 6,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 12,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3",
          },
        },
        designation: "Gaze of Mork",
      },
      "Weapon§Giga shoota": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 30",
          },
        },
        text: "Each time an attack is made with this weapon against a target within half range, add 1 to that attack’s hit roll.",
        designation: "Giga shoota",
      },
      "Weapon§Git-rippa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "When resolving an attack made with this weapon, you can reroll the wound roll.",
        designation: "Git-rippa",
      },
      "Weapon§Glare": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast. Each time this weapon profile is selected, select a point on the battlefield within this weapon’s maximum range and resolve attacks against every eligible enemy unit within 3″ of that point, determining visibility from that point. Determine the number of attacks separately for each eligible enemy unit.",
        designation: "Glare",
      },
      "Weapon§Gorin’ horns": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Gorin’ horns",
      },
      "Weapon§Gork’s Klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: 4,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Gork’s Klaw",
      },
      "Weapon§Grabba stikk": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon.",
        designation: "Grabba stikk",
      },
      "Weapon§Grabbin klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon and no more than 1 attack can be made with this weapon.",
        designation: "Grabbin klaw",
      },
      "Weapon§Grabbin’ klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon and no more than 1 attack can be made with this weapon.",
        designation: "Grabbin’ klaw",
      },
      "Weapon§Grot blasta": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Type: {
            value: "Pistol 1",
          },
        },
        designation: "Grot blasta",
      },
      "Weapon§Grot-guided bomm": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "72″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 2D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer. The bearer can only shoot with this weapon once per battle. Each time an attack is made with this weapon, the bearer has a Ballistic Skill characteristic of 2+ for that attack.",
        designation: "Grot-guided bomm",
      },
      "Weapon§Grot-guided bomm 10": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "72″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 2D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer. The bearer can only shoot with this weapon once per battle. Each time an attack is made with this weapon, the bearer has a Ballistic Skill characteristic of 2+ for that attack.",
        designation: "Grot-guided bomm 10",
      },
      "Weapon§Grot-prod": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Grot-prod",
      },
      "Weapon§Grotzooka": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 2D3",
          },
        },
        text: "Blast",
        designation: "Grotzooka",
      },
      "Weapon§Gutrippa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Gutrippa",
      },
      "Weapon§Heavy squig launcha": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer.",
        designation: "Heavy squig launcha",
      },
      "Weapon§Huge tusks": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3+3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Huge tusks",
      },
      "Weapon§Icon of da Revolushun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "When resolving an attack made with this weapon, a wound roll of 6+ inflicts 1 mortal wound on the target in addition to any other damage.",
        designation: "Icon of da Revolushun",
      },
      "Weapon§Kan klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Kan klaw",
      },
      "Weapon§Killkannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast",
        designation: "Killkannon",
      },
      "Weapon§Killkannon 15": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 15,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast",
        designation: "Killkannon 15",
      },
      "Weapon§Killsaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll. Each time the bearer fights, if it is equipped with 2 killsaws, it makes 1 additional attack with this weapon.",
        designation: "Killsaw",
      },
      "Weapon§Killsaw 10": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll. Each time the bearer fights, if it is equipped with 2 killsaws, it makes 1 additional attack with this weapon.",
        designation: "Killsaw 10",
      },
      "Weapon§Killsaw 15": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: 15,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll. Each time the bearer fights, if it is equipped with 2 killsaws, it makes 1 additional attack with this weapon.",
        designation: "Killsaw 15",
      },
      "Weapon§Killsaw 15/23": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: 15,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll. Each time the bearer fights, if it is equipped with 2 killsaws, it makes 1 additional attack with this weapon.",
        designation: "Killsaw 15/23",
      },
      "Weapon§Killsaw 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll. Each time the bearer fights, if it is equipped with 2 killsaws, it makes 1 additional attack with this weapon.",
        designation: "Killsaw 5",
      },
      "Weapon§Kopta rokkits": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 2D3",
          },
        },
        text: "Blast",
        designation: "Kopta rokkits",
      },
      "Weapon§Kustom grot blasta": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Pistol D3",
          },
        },
        designation: "Kustom grot blasta",
      },
      "Weapon§Kustom mega-blasta": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Assault D3",
          },
        },
        text: "Blast. If any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers 1 mortal wound after shooting with this weapon.",
        designation: "Kustom mega-blasta",
      },
      "Weapon§Kustom mega-blasta 10": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Assault D3",
          },
        },
        text: "Blast. If any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers 1 mortal wound after shooting with this weapon.",
        designation: "Kustom mega-blasta 10",
      },
      "Weapon§Kustom mega-blasta 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Assault D3",
          },
        },
        text: "Blast. If any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers 1 mortal wound after shooting with this weapon.",
        designation: "Kustom mega-blasta 5",
      },
      "Weapon§Kustom mega-kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast. If any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers 1 mortal wound after shooting with this weapon.",
        designation: "Kustom mega-kannon",
      },
      "Weapon§Kustom mega-slugga": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Pistol D3",
          },
        },
        text: "Blast. If any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers 1 mortal wound after shooting with this weapon.",
        designation: "Kustom mega-slugga",
      },
      "Weapon§Kustom mega-zappa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3D3",
          },
        },
        text: "Blast. If any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers 1 mortal wound after shooting with this weapon.",
        designation: "Kustom mega-zappa",
      },
      "Weapon§Kustom shokk rifle": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2",
          },
        },
        text: "If any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers 1 mortal wound after shooting with this weapon. Each time an attack is made with this weapon, an unmodified wound roll of 6 inflicts 1 mortal wound on the target in addition to any normal damage.",
        designation: "Kustom shokk rifle",
      },
      "Weapon§Kustom shoota": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 6/4",
          },
        },
        designation: "Kustom shoota",
      },
      "Weapon§Kustom shoota 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 6/4",
          },
        },
        designation: "Kustom shoota 5",
      },
      "Weapon§Kustom supa-rokkits": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "100″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast",
        designation: "Kustom supa-rokkits",
      },
      "Weapon§Lifta-droppa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: null,
            statType: "numeric",
          },
          D: {
            value: null,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: null,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast. Each time an attack is made with this weapon, that attack automatically hits the target. Each time this weapon hits, roll 2D6 instead of rolling to wound: if the result is equal to or greater than the target’s highest Strength characteristic, the target suffers 1 mortal wound.",
        designation: "Lifta-droppa",
      },
      "Weapon§Lobba": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer.",
        designation: "Lobba",
      },
      "Weapon§Lobba 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer.",
        designation: "Lobba 5",
      },
      "Weapon§Makari’s stabba": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, an unmodified wound roll of 6 inflicts D3 mortal wounds on the target and the attack sequence ends.",
        designation: "Makari’s stabba",
      },
      "Weapon§Mek speshul": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "30″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 14/10",
          },
        },
        designation: "Mek speshul",
      },
      "Weapon§Mork’s Roar": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 16/12",
          },
        },
        designation: "Mork’s Roar",
      },
      "Weapon§Mork’s Teeth": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Mork’s Teeth",
      },
      "Weapon§Nose drill": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Nose drill",
      },
      "Weapon§Pair of rokkit pistols": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Type: {
            value: "Pistol 2",
          },
        },
        designation: "Pair of rokkit pistols",
      },
      "Weapon§Power klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll.",
        designation: "Power klaw",
      },
      "Weapon§Power klaw 10": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll.",
        designation: "Power klaw 10",
      },
      "Weapon§Power klaw 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll.",
        designation: "Power klaw 5",
      },
      "Weapon§Power klaw 8": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 8,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack’s hit roll.",
        designation: "Power klaw 8",
      },
      "Weapon§Power snappa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Power snappa",
      },
      "Weapon§Power stabba": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Power stabba",
      },
      "Weapon§Rack of rokkits": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 24,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2",
          },
        },
        designation: "Rack of rokkits",
      },
      "Weapon§Rattler kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        designation: "Rattler kannon",
      },
      "Weapon§Reinforced ram": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Reinforced ram",
      },
      "Weapon§Rivet kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 9/6",
          },
        },
        designation: "Rivet kannon",
      },
      "Weapon§Rokker choppa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it can make 1 additional attack with this weapon.",
        designation: "Rokker choppa",
      },
      "Weapon§Rokker shoota": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Assault 4",
          },
        },
        designation: "Rokker shoota",
      },
      "Weapon§Rokkit": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D3",
          },
        },
        text: "Blast",
        designation: "Rokkit",
      },
      "Weapon§Rokkit kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3D3",
          },
        },
        text: "Blast",
        designation: "Rokkit kannon",
      },
      "Weapon§Rokkit launcha": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D3",
          },
        },
        text: "Blast",
        designation: "Rokkit launcha",
      },
      "Weapon§Rokkit launcha 10": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D3",
          },
        },
        text: "Blast",
        designation: "Rokkit launcha 10",
      },
      "Weapon§Rokkit launcha 15": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 15,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D3",
          },
        },
        text: "Blast",
        designation: "Rokkit launcha 15",
      },
      "Weapon§Rokkit launcha 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D3",
          },
        },
        text: "Blast",
        designation: "Rokkit launcha 5",
      },
      "Weapon§Rokkit-launcha": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D3",
          },
        },
        text: "Blast",
        designation: "Rokkit-launcha",
      },
      "Weapon§Saddlegit weapons (melee)": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon.",
        designation: "Saddlegit weapons (melee)",
      },
      "Weapon§Saddlegit weapons (shooting)": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "8″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Assault 1",
          },
        },
        designation: "Saddlegit weapons (shooting)",
      },
      "Weapon§Savage horns and hooves": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 4 additional attacks with this weapon and no more than 4 attacks can be made with this weapon.",
        designation: "Savage horns and hooves",
      },
      "Weapon§Saw blades": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Saw blades",
      },
      "Weapon§Sawn-off shotgun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2",
          },
        },
        designation: "Sawn-off shotgun",
      },
      "Weapon§Scrap kanister": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Scrap kanister",
      },
      "Weapon§Shell": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 1",
          },
        },
        designation: "Shell",
      },
      "Weapon§Shokk attack gun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -5,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "60″",
          },
          S: {
            value: "*",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast. Each time this weapon is selected to shoot with, roll 2D6 to determine the Strength of all its attacks: on an 11+, each successful hit inflicts D3 mortal wounds on the target in addition to any normal damage.",
        designation: "Shokk attack gun",
      },
      "Weapon§Shokka pistol": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "6″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Pistol D3",
          },
        },
        text: "Blast. Each time an attack made with this weapon is allocated to a VEHICLE model, that attack has a Damage characteristic of D3.",
        designation: "Shokka pistol",
      },
      "Weapon§Shoota": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 3/2",
          },
        },
        designation: "Shoota",
      },
      "Weapon§Skorcha": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Skorcha",
      },
      "Weapon§Skorcha 10": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Skorcha 10",
      },
      "Weapon§Skorcha 15": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 15,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Skorcha 15",
      },
      "Weapon§Skorcha 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Skorcha 5",
      },
      "Weapon§Skorcha missile racks": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2D6",
          },
        },
        text: "Blast. Each time an attack is made with this weapon, the target does not receive the benefits of cover against that attack.",
        designation: "Skorcha missile racks",
      },
      "Weapon§Skrak’s horned helmet": {
        classification: "Weapon",
        stats: {
          AP: {
            value: "*",
          },
          D: {
            value: "*",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "*",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it can make 1 additional attack with this weapon and only 1 attack can be made with this weapon. When resolving an attack made with this weapon, if a hit is scored, the target suffers 1 mortal wound and the attack sequence ends.",
        designation: "Skrak’s horned helmet",
      },
      "Weapon§Slash": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon profile, make 3 hit rolls instead of 1.",
        designation: "Slash",
      },
      "Weapon§Slugga": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 4,
            statType: "numeric",
          },
          Type: {
            value: "Pistol 1",
          },
        },
        designation: "Slugga",
      },
      "Weapon§Smash": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon profile, make 3 hit rolls instead of 1.",
        designation: "Smash",
      },
      "Weapon§Smash x2": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -5,
            statType: "numeric",
          },
          D: {
            value: 9,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Smash x2",
      },
      "Weapon§Smasha gun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D3",
          },
        },
        text: "Blast",
        designation: "Smasha gun",
      },
      "Weapon§Smasha squig jaws": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 2 additional attacks with this weapon and no more than 2 attacks can be made with this weapon.",
        designation: "Smasha squig jaws",
      },
      "Weapon§Snagga klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, you can reroll the wound roll.",
        designation: "Snagga klaw",
      },
      "Weapon§Snazzgun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3",
          },
        },
        designation: "Snazzgun",
      },
      "Weapon§Spinnin’ blades": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, make 3 hit rolls instead of 1.",
        designation: "Spinnin’ blades",
      },
      "Weapon§Squig launcha": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer.",
        designation: "Squig launcha",
      },
      "Weapon§Squiggoth supa-kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 40,
            statType: "numeric",
          },
          Range: {
            value: "60″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 2D6",
          },
        },
        text: "Blast",
        designation: "Squiggoth supa-kannon",
      },
      "Weapon§Squighog jaws": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 2 additional attacks with this weapon and no more than 2 attacks can be made with this weapon.",
        designation: "Squighog jaws",
      },
      "Weapon§Squigosaur’s jaws": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 3 additional attacks with this weapon and no more than 3 attacks can be made with this weapon. Each time an attack is made with this weapon, an unmodified wound roll of 6 inflicts 3 mortal wounds on the target and the attack sequence ends.",
        designation: "Squigosaur’s jaws",
      },
      "Weapon§Squint": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 9,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "Each time an attack is made with this weapon profile, select one eligible target unit, draw a straight line between the closest point of the bearer’s base (or hull) and that of the closest model in the target unit. Make one wound roll against the target unit, and each other unit this line passes over. Each time an attack is made with this weapon profile, that attack automatically hits the target.",
        designation: "Squint",
      },
      "Weapon§Standard": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3",
          },
        },
        designation: "Standard",
      },
      "Weapon§Stikka (melee)": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Stikka (melee)",
      },
      "Weapon§Stikka (shooting)": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time an attack made with this weapon targets a unit within half range, that attack has a Strength characteristic of +1.",
        designation: "Stikka (shooting)",
      },
      "Weapon§Stikka kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "Each time the bearer makes an attack with this weapon, if that attack targets a MONSTER or VEHICLE unit, you can reroll the hit roll.",
        designation: "Stikka kannon",
      },
      "Weapon§Stikkbomb flinga": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2D6",
          },
        },
        text: "Blast",
        designation: "Stikkbomb flinga",
      },
      "Weapon§Stikkbombz": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "8″",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Type: {
            value: "Grenade D6",
          },
        },
        text: "Blast",
        designation: "Stikkbombz",
      },
      "Weapon§Stompa klaw": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -5,
            statType: "numeric",
          },
          D: {
            value: 9,
            statType: "numeric",
          },
          Points: {
            value: 20,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack made with this weapon, an unmodified wound roll of 4+ inflicts D3 mortal wounds on the target in addition to any normal damage.",
        designation: "Stompa klaw",
      },
      "Weapon§Stompa lifta-droppa": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -4,
            statType: "numeric",
          },
          D: {
            value: "D3+3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: "*",
          },
          Type: {
            value: "Heavy 4D3",
          },
        },
        text: "Each time an attack made with this weapon successfully hits, roll 3D6. If the result is greater than the target’s Toughness characteristic, that attack successfully wounds.",
        designation: "Stompa lifta-droppa",
      },
      "Weapon§Supa-gatler": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 7,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 24/16",
          },
        },
        designation: "Supa-gatler",
      },
      "Weapon§Supa-kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "60″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 2D6",
          },
        },
        text: "Blast",
        designation: "Supa-kannon",
      },
      "Weapon§Supa-kannon 50": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 50,
            statType: "numeric",
          },
          Range: {
            value: "60″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 2D6",
          },
        },
        text: "Blast",
        designation: "Supa-kannon 50",
      },
      "Weapon§Supa-rokkits": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "100″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast",
        designation: "Supa-rokkits",
      },
      "Weapon§Supa-shoota": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 6/4",
          },
        },
        designation: "Supa-shoota",
      },
      "Weapon§Supa-shoota 10": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 6/4",
          },
        },
        designation: "Supa-shoota 10",
      },
      "Weapon§Supercharge": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 3",
          },
        },
        text: "Each time the bearer shoots, if any unmodified hit rolls of 1 are made for an attack with this weapon profile, the bearer suffers 1 mortal wound after shooting with this weapon.",
        designation: "Supercharge",
      },
      "Weapon§Tankbusta bomb": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "6″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Grenade D3",
          },
        },
        text: "Blast",
        designation: "Tankbusta bomb",
      },
      "Weapon§Tankhamma shell": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 6,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "60″",
          },
          S: {
            value: 10,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "Each time an attack is made with this weapon against a VEHICLE unit, you can reroll the hit roll.",
        designation: "Tankhamma shell",
      },
      "Weapon§Tankhammer": {
        classification: "Weapon",
        stats: {
          AP: {
            value: null,
            statType: "numeric",
          },
          D: {
            value: null,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: null,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it can only make 1 attack with this weapon. If that attack hits, the target unit suffers D6 mortal wounds and the bearer is destroyed.",
        designation: "Tankhammer",
      },
      "Weapon§Tellyport blasta": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Blast",
        designation: "Tellyport blasta",
      },
      "Weapon§Tellyport mega-blasta": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: "D3+3",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 9,
            statType: "numeric",
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Blast",
        designation: "Tellyport mega-blasta",
      },
      "Weapon§Thump gun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Assault D3",
          },
        },
        text: "Blast",
        designation: "Thump gun",
      },
      "Weapon§Thump gun 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "18″",
          },
          S: {
            value: 6,
            statType: "numeric",
          },
          Type: {
            value: "Assault D3",
          },
        },
        text: "Blast",
        designation: "Thump gun 5",
      },
      "Weapon§Traktor kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: "D3+3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "48″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "Each time an attack is made with this weapon:\n\n* Against a VEHICLE unit that can FLY, that attack has a Damage characteristic of D6+3.\n* Against an AIRCRAFT unit, add 2 to that attack’s hit roll.\n* Against a nonAIRCRAFT unit, add 1 to that attack’s hit roll.",
        designation: "Traktor kannon",
      },
      "Weapon§Twin big shoota": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 10/6",
          },
        },
        designation: "Twin big shoota",
      },
      "Weapon§Twin big shoota 10": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: 10,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Dakka 10/6",
          },
        },
        designation: "Twin big shoota 10",
      },
      "Weapon§Twin boomstikk": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 1,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "12″",
          },
          S: {
            value: 5,
            statType: "numeric",
          },
          Type: {
            value: "Assault 2",
          },
        },
        designation: "Twin boomstikk",
      },
      "Weapon§Waaagh! banner": {
        classification: "Weapon",
        stats: {
          AP: {
            value: 0,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Waaagh! banner",
      },
      "Weapon§Wazbom mega-kannon": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: 10,
            statType: "numeric",
          },
          Type: {
            value: "Heavy D3",
          },
        },
        text: "Blast. If any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers 1 mortal wound after shooting with this weapon.",
        designation: "Wazbom mega-kannon",
      },
      "Weapon§Weirdboy staff": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: "D3",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 3,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        designation: "Weirdboy staff",
      },
      "Weapon§Wing missiles": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -2,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 8,
            statType: "numeric",
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time an attack is made with this weapon that targets a VEHICLE unit, add 1 to that attack’s hit roll.",
        designation: "Wing missiles",
      },
      "Weapon§Wreckin’ ball": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -1,
            statType: "numeric",
          },
          D: {
            value: 2,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
            statType: "numeric",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes 1 additional attack with this weapon and no more than 1 attack can be made with this weapon.",
        designation: "Wreckin’ ball",
      },
      "Weapon§Wurrtower": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: "D6",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "24″",
          },
          S: {
            value: 9,
            statType: "numeric",
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time this weapon is selected to shoot with, if the bearer successfully manifested any psychic powers this turn, change this weapon’s Type to Assault D3. Each time an attack is made with this weapon, that attack automatically hits the target.",
        designation: "Wurrtower",
      },
      "Weapon§Zzap gun": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: null,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: "*",
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "Each time this weapon is selected to shoot with, roll 2D6 to determine the Strength of all its attacks: on an 11+, each successful hit inflicts D3 mortal wounds on the target in addition to any normal damage, and the bearer suffers 1 mortal wound.",
        designation: "Zzap gun",
      },
      "Weapon§Zzap gun 5": {
        classification: "Weapon",
        stats: {
          AP: {
            value: -3,
            statType: "numeric",
          },
          D: {
            value: 3,
            statType: "numeric",
          },
          Points: {
            value: 5,
            statType: "numeric",
          },
          Range: {
            value: "36″",
          },
          S: {
            value: "*",
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "Each time this weapon is selected to shoot with, roll 2D6 to determine the Strength of all its attacks: on an 11+, each successful hit inflicts D3 mortal wounds on the target in addition to any normal damage, and the bearer suffers 1 mortal wound.",
        designation: "Zzap gun 5",
      },
    },
    gameModes: {},
    theme: {},
  },
  revision: null,
  notes: "This manifest is provided for the purposes of testing *Rosterizer* and is not intended for distribution.",
};

const possibleTaxonomyKeys = new Set<string>();

Object.values(rosterFile.manifest.assetCatalog).forEach((a) =>
  Object.keys(a).forEach((k) => possibleTaxonomyKeys.add(k))
);

console.log(possibleTaxonomyKeys);

type ManifestInfo = {
  name: string;
  game: string;
  genre: string;
  publisher: string;
  url: string;
  info: string;
  revision: null;
  notes: string;
};

type Thing = {
  classification?: void;
  keywords?: void;
  designation?: void;
  stats?: void;
  allowed?: void;
  assets?: void;
  rules?: void;
  aspects?: void;
  text?: void;
};

type GameMode = Record<string, any>;
type Theme = Record<string, any>;
type AssetCatalog = { [key: string]: void };

type Manifest = {
  gameModes: GameMode;
  theme: Theme;
  assetCatalog: AssetCatalog;
  assetTaxonomy: AssetTaxonomy;
};

type FullManifest = ManifestInfo & {
  manifest: Manifest;
};

const TauInfo: ManifestInfo = {
  name: "Tau",
  game: "WH40k",
  genre: "sci-fi",
  publisher: "GW",
  url: "https://warhammer40000.com/",
  info: "",
  revision: null,
  notes: "This manifest is provided for the purposes of testing *Rosterizer* and is not intended for distribution.",
};

const getTauManifest = (): FullManifest => {
  return {
    ...TauInfo,
    manifest: {
      assetCatalog: {},
      assetTaxonomy: {},
      gameModes: {},
      theme: {},
    },
  };
};

const TauTemplatedLikeOrks: FullManifest = {
  ...TauInfo,
  manifest: {
    assetTaxonomy: {
      "Dedicated Transport": {
        keywords: {
          Faction: [],
          General: [],
          Keywords: [],
        },
        templateClass: "Unit",
      },
      Detachment: {
        allowed: {
          classifications: ["HQ", "Troops", "Dedicated Transport", "Elites", "Fast Attack", "Heavy Support", "Flyers"],
        },
        aspects: {
          "Group Includes": true,
        },
        stats: {
          CP: {
            value: 0,
            group: "Cost",
            groupOrder: -1,
            tracked: true,
            statType: "numeric",
          },
          "Dedicated Transport": {
            value: null,
            statOrder: 3,
            icons: ["arrow-dunk"],
            statType: "numeric",
          },
          Elites: {
            value: null,
            statOrder: 4,
            icons: ["pirate-flag"],
            statType: "numeric",
          },
          "Fast Attack": {
            value: null,
            statOrder: 5,
            icons: ["power-lightning"],
            statType: "numeric",
          },
          Flyers: {
            value: null,
            statOrder: 7,
            icons: ["bat-blade"],
            statType: "numeric",
          },
          Fortifications: {
            value: null,
            statOrder: 9,
            icons: ["white-tower"],
            statType: "numeric",
          },
          HQ: {
            value: null,
            statOrder: 1,
            icons: ["crowned-skull"],
            tracked: true,
            statType: "numeric",
          },
          "Heavy Support": {
            value: null,
            statOrder: 6,
            icons: ["mine-explosion"],
            statType: "numeric",
          },
          "Lords of War": {
            value: null,
            statOrder: 8,
            icons: ["fist"],
            statType: "numeric",
          },
          Troops: {
            value: null,
            statOrder: 2,
            icons: ["triangle-target"],
            tracked: true,
            statType: "numeric",
          },
          Clan: {
            statType: "rank",
            ranks: {
              "-": {
                order: 0,
              },
              bad: {
                order: 1,
                format: "Bad Moons",
              },
              blood: {
                order: 2,
                format: "Blood Axes",
              },
              death: {
                order: 3,
                format: "Deathskulls",
              },
              evil: {
                order: 4,
                format: "Evil Sunz",
              },
              free: {
                order: 5,
                format: "Freebooterz",
              },
              goff: {
                order: 6,
                format: "Goffs",
              },
              snake: {
                order: 7,
                format: "Snakebites",
              },
            },
            dynamic: true,
          },
        },
        rules: {
          "Clan replacement": {
            evals: [
              {
                paths: [["{self}", "stats", "Clan", "value"]],
                value: "-",
                operator: "AND",
                not: true,
              },
            ],
            failState: "pass",
            evaluate: "OR",
            actions: [
              {
                paths: [["{self}", "assets", "templateClass", "Unit", "keywords", "Faction"]],
                actionType: "remove",
                value: "<clan>",
                iterations: 1,
              },
              {
                paths: [["{self}", "assets", "templateClass", "Unit", "keywords", "Faction"]],
                actionType: "add",
                value: ["{self}", "stats", "Clan", "numbers", "rank", "current"],
                iterations: 1,
              },
            ],
          },
        },
      },
      Elites: {
        templateClass: "Unit",
      },
      "Fast Attack": {
        templateClass: "Unit",
      },
      Flyers: {
        templateClass: "Unit",
      },
      Fortifications: {},
      HQ: {
        templateClass: "Unit",
      },
      "Heavy Support": {
        templateClass: "Unit",
      },
      "Lords of War": {},
      Models: {
        aspects: {
          "Group Traits": true,
          Type: "game piece",
          "Order Traits A–Z": true,
        },
        stats: {
          A: {
            value: 0,
            statOrder: 7,
            statType: "numeric",
          },
          BS: {
            format: "{v}+",
            value: 0,
            statOrder: 3,
            statType: "numeric",
          },
          Base: {
            statOrder: 10,
            statType: "term",
          },
          Ld: {
            value: 0,
            statOrder: 8,
            statType: "numeric",
          },
          M: {
            format: "{t}″",
            statOrder: 1,
            statType: "term",
          },
          Points: {
            value: 0,
            group: "Cost",
            groupOrder: -1,
            tracked: true,
            statType: "numeric",
          },
          S: {
            value: 0,
            statOrder: 4,
            statType: "numeric",
          },
          Sv: {
            format: "{v}+",
            value: 0,
            statOrder: 9,
            statType: "numeric",
          },
          T: {
            value: 0,
            statOrder: 5,
            statType: "numeric",
          },
          W: {
            value: 0,
            statOrder: 6,
            statType: "numeric",
          },
          WS: {
            format: "{v}+",
            value: 0,
            statOrder: 2,
            statType: "numeric",
          },
        },
      },
      Troops: {
        templateClass: "Unit",
      },
      Unit: {
        aspects: {
          Describe: true,
        },
        keywords: {
          Faction: [],
          General: [],
          Keywords: [],
        },
        stats: {
          Points: {
            value: 0,
            statOrder: -1,
            group: "Tracking",
            groupOrder: -1,
            tracked: true,
            statType: "numeric",
          },
          Power: {
            value: 0,
            group: "Tracking",
            groupOrder: -1,
            tracked: true,
            statType: "numeric",
          },
        },
      },
      Wargear: {
        stats: {
          Points: {
            value: 0,
            group: "Cost",
            groupOrder: -1,
            tracked: true,
            statType: "numeric",
          },
        },
      },
      "Warlord Trait": {},
      Weapon: {
        stats: {
          AP: {
            value: 0,
            statOrder: 4,
            statType: "numeric",
          },
          D: {
            value: 0,
            statOrder: 5,
            statType: "numeric",
          },
          Points: {
            value: null,
            format: "+{v}",
            group: "Cost",
            groupOrder: -1,
            tracked: true,
            statType: "numeric",
          },
          Range: {
            statOrder: 1,
            statType: "term",
          },
          S: {
            value: 0,
            statOrder: 3,
            statType: "numeric",
          },
          Type: {
            statOrder: 2,
            statType: "term",
          },
        },
      },
    },
    assetCatalog: {},
    gameModes: {},
    theme: {},
  },
};

const translatedBattlescribe = {
  name: "T'au Empire",
  game: "",
  genre: "generic",
  publisher: "",
  url: "",
  notes:
    "This data was translated automatically from a battlescribe catalog. Only asset names and bare stats have been translated and considerable editing is required in order for it to become useful in Rosterizer.",
  manifest: {
    assetTaxonomy: {
      Abilities: {},
      Invocations: {
        stats: {
          "-": {
            statType: "term",
            value: null,
          },
        },
      },
      Model: {
        stats: {
          " PL": {
            statType: "numeric",
            tracked: true,
            value: null,
          },
          CP: {
            statType: "numeric",
            tracked: true,
            value: null,
          },
          pts: {
            statType: "numeric",
            tracked: true,
            value: null,
          },
        },
      },
      Profile: {
        stats: {
          A: {
            statType: "numeric",
            value: null,
          },
          AP: {
            statType: "term",
            value: null,
          },
          BS: {
            statType: "term",
            value: null,
          },
          D: {
            statType: "term",
            value: null,
          },
          Ld: {
            statType: "numeric",
            value: null,
          },
          M: {
            statType: "term",
            value: null,
          },
          Range: {
            statType: "term",
            value: null,
          },
          S: {
            statType: "term",
            value: null,
          },
          Save: {
            statType: "term",
            value: null,
          },
          T: {
            statType: "numeric",
            value: null,
          },
          Type: {
            statType: "term",
            value: null,
          },
          W: {
            statType: "numeric",
            value: null,
          },
          WS: {
            statType: "term",
            value: null,
          },
        },
      },
      Rule: {},
      SelectionEntry: {},
      SelectionEntryGroup: {},
      Transport: {
        stats: {
          Capacity: {
            statType: "term",
            value: null,
          },
        },
      },
      Unit: {
        stats: {
          " PL": {
            statType: "numeric",
            tracked: true,
            value: null,
          },
          A: {
            statType: "term",
            value: null,
          },
          BS: {
            statType: "term",
            value: null,
          },
          CP: {
            statType: "numeric",
            tracked: true,
            value: null,
          },
          Ld: {
            statType: "term",
            value: null,
          },
          M: {
            statType: "term",
            value: null,
          },
          pts: {
            statType: "numeric",
            tracked: true,
            value: null,
          },
          S: {
            statType: "term",
            value: null,
          },
          Save: {
            statType: "term",
            value: null,
          },
          T: {
            statType: "term",
            value: null,
          },
          W: {
            statType: "term",
            value: null,
          },
          WS: {
            statType: "term",
            value: null,
          },
        },
      },
      Upgrade: {
        stats: {
          " PL": {
            statType: "numeric",
            tracked: true,
            value: null,
          },
          CP: {
            statType: "numeric",
            tracked: true,
            value: null,
          },
          pts: {
            statType: "numeric",
            tracked: true,
            value: null,
          },
        },
      },
      Weapon: {
        stats: {
          AP: {
            statType: "term",
            value: null,
          },
          D: {
            statType: "term",
            value: null,
          },
          Range: {
            statType: "term",
            value: null,
          },
          S: {
            statType: "term",
            value: null,
          },
          Type: {
            statType: "term",
            value: null,
          },
        },
      },
    },
    assetCatalog: {
      "Abilities§1. Master of the Hunt (Aura)": {
        text: 'While a friendly KROOT unit is within 6" of this WARLORD, each time a model in that unit makes a ranged attack that targets a unit within 12", the target does not receive the benefits of cover against that attack.',
      },
      "Abilities§1. Precision of the Hunter": {
        text: "Each time this WARLORD makes an attack, you can re-roll the hit roll and you can re-roll the wound roll.",
      },
      "Abilities§2. Pack Leader (Aura)": {
        text: 'While a friendly KROOT unit is within 6" of this WARLORD, each time you make a charge roll for that unit, roll one additional D6 and discard one of the dice.',
      },
      "Abilities§2. Through Unity, Devastation (Aura)": {
        text: 'While a friendly <SEPT> CORE unit is within 6" of this WARLORD, each time a CORE model in that unit makes a ranged attack, on an unmodified wound roll of 6, improve the Armour Penetration characteristic of that attack by 1.',
      },
      "Abilities§3. A Ghost Walks Among Us": {
        text: "- Each time an attack is made against this WARLORD, subtract 1 from that attack's hit roll.\n- Each time this WARLORD Advances, do not make an Advance roll. Instead, until the end of the phase, add 6\" to the Move characteristic of this WARLORD.",
      },
      "Abilities§3. Nomadic Hunter (Aura)": {
        text: 'While a friendly KROOT unit is within 6" of this WARLORD, each time a model in that unit makes a ranged attack, if that unit did not Fall Back this turn, it counts as having Remained Stationary during its previous movement phase.',
      },
      "Abilities§4. Through Boldness, Victory": {
        text: 'In your Command phase, select one friendly <SEPT> CORE unit within 9" of this WARLORD. Until the start of your next Command phase, each time a CORE model in that unit makes a ranged attack, an unmodified hit roll of 6 automatically wounds the target.',
      },
      "Abilities§5. Exemplar of the Kauyon": {
        text: "After both players have deployed their armies and determined who has the first turn, select up to one friendly <SEPT> unit, or up to three friendly <SEPT> units if you have selected the Kauyon Tactical Philosophy this battle (pg 92), and redeploy them. If the mission uses Strategic Reserves rules, any of these units can be placed into Strategic Reserves without having to spend any additional CPs, regardless of how many units are already in Strategic Reserves. If both players have abilities that redeploy units, roll off, the winner chooses who deploys their units first.",
      },
      "Abilities§6. Exemplar of the Mont'ka": {
        text: 'In your Command phase, select one friendly <SEPT> CORE unit within 9" of this WARLORD. Until the start of your next Command phase, each time a CORE model in that unit makes a ranged attack that targets an enemy unit within 9", or 12" if you selected the Mont\'ka Tactical Philosophy this battle (pg 92), you can re-roll the wound roll.',
      },
      "Abilities§Academy Luminary": {
        text: "While this WARLORD is on the battlefield, each time you spend a Command point to use a T'au Empire Strategic Ploy or T'au Empire Wargear Stratagem, roll one D6: on a 3+ that Command point is refunded.",
      },
      "Abilities§Advanced EM Scrambler": {
        text: '- Enemy units that are set up on the battlefield as Reinforcements cannot be set up within 12" of the bearer.\n- In your Command phase, select one enemy unit within 6" of the bearer. Until the start of your next Command phase, that unit cannot be affected by the aura abilities (excluding those that are psychic powers) of other units from your opponents army.',
      },
      "Abilities§Advanced Guardian Shield Generator": {
        text: "This model has a 4+ invulnerable save. This unit cannot be selected as a target for ranged attacks unless it is the closest eligible target to the firing model.",
      },
      "Abilities§Advanced Targeting System": {
        text: "Each time the bearer makes a ranged attack, an unmodified hit roll of 6 automatically wounds the target.",
      },
      "Abilities§Aerial Scanners": {
        text: "Each time this unit's SKY RAY GUNSHIP model makes a ranged attack against an AIRCRAFT unit.\n\n- Add 2 to that attack's hit roll.\n- You can re-roll the damage roll.",
      },
      "Abilities§Aggressive Tactics": {
        text: 'In your Command phase, you can select one friendly <SEPT> CRISIS CORE unit within 9" of this unit\'s COLDSTAR BATTLESUIT COMMANDER model. Until the end of the turn, each time this unit Advances, do not make an Advance roll. Instead, until the end of the phase, add 8" to the Move characteristic of models in this unit.',
      },
      "Abilities§Airborne": {
        text: "You cannot declare a charge with this model, and it can only be chosen as a target of a charge if the unit making the charge can FLY. You can only fight with this model if it is within Engagement Range of any enemy units that can FLY, and this model can only make melee attacks against units that can FLY. Enemy units can only make melee attacks against htis model if they can FLY.",
      },
      "Abilities§Airborne (Sun Shark)": {
        text: "You cannot declare a charge with this unit's SUN SHARK BOMBER, and this unit's SUN SHARK BOMBER model can only be chosen as a target of a charge if the unit making the charge can FLY. You can only fight with this unit's SUN SHARK BOMBER model if it is within Engagement Range of any enemy units that can FLY, and it can only make melee attacks against units that can FLY. Enemy units can only make melee attacks against this unit's SUN SHARK BOMBER model if they can FLY.",
      },
      "Abilities§Alternating Fusion Blaster": {
        text: "COMMANDER or CRISIS model equipped with one or more fusion blasters only. This Prototype System replaces one fusion blaster.",
      },
      "Abilities§Armoured Aggression": {
        text: 'At the start of the first battle round before the first turn begins, if you selected the Mont\'ka Tactical Philosophy at the start of the battle, this unit can make a Normal Move of up to 9". It cannot end this move within 9" of any enemy models.',
      },
      "Abilities§Assassin": {
        text: "Each time this model makes an attack against a CHARACTER unit, you can re-roll the hit roll and the wound roll.",
      },
      "Abilities§Automated Armour Defences": {
        text: 'COMMANDER model only. At the start of your Shooting phase, roll one D6: on a 2-4, the closest enemy unit within 18" of and visible to the bearer suffers 1 mortal wound; on a 5+, the  closest enemy unit within 12" of and visible to the bearer suffers D3 mortal wounds.',
      },
      "Abilities§Automated Weapon": {
        text: "In your Shooting phase, each time this model is selected to shoot, if no friendly <SEPT> units are embarked within it, until the end of the phase, this model has a Ballastic Skill characteristic of 5+ and you can select one of the following targets for its attacks:\n\n- The closest eligible enemy unit.\n- The closest eligible enemy VEHICLE unit.",
      },
      "Abilities§Bodyguard Contingent": {
        text: "If your army is Battle-forged, then for each <SEPT> COMMANDER unit included in a Detachment, you can include one <SEPT> CRISIS BODYGUARDS unit in that Detachment without it taking up a Battlefield Role slot.",
      },
      "Abilities§Bork'an Sept Tenet: Superior Craftsmanship": {
        text: '- Add 4" to the Range characteristic of ranged weapons that models with this tenet are equipped with.\n- Each time a ranged attack is made with weapon that has a Strength characteristic of 7 of less against VEHICLE or BATTLESUIT unit with this tenet, subtract 1 from the Strength characteristic of this attack.',
      },
      "Abilities§Borthrod Gland": {
        text: "KROOT model only. Once per battle, in your Command phase, the bearer can use this Relic. If it does, until the start of your next Command phase, the bearer gains the following ability:\n\n'Alien Glands (Aura): While a friendly KROOT unit is within 6\" of this model, add 1 to the Attacks characteristic, and add 1 to the Strength characteristic of models in that unit.'",
      },
      "Abilities§Camouflage Fields": {
        text: "Each time an attack is made against this unit, subtract 1 from that attack's hit roll. Each time a ranged attack is allocated to a model in this unit while it is receiving the benefits of cover, add an additional 1 to any armour saving throw made against that attack.",
      },
      "Abilities§Camouflage Fields (Shadowsun)": {
        text: "While this unit's COMMANDER SHADOWSUN model has any wounds remaining, each time a ranged attack is made against this unit, subtract 1 from that attack's hit roll.",
      },
      "Abilities§Cloaked Insertion": {
        text: 'During deployment, you can set up this unit cloaked in the sky instead of setting it up on the battlefield. If you do, then in the Reinforcements step of one of your Movement phases you can set up this unit anywhere on the battlefield that is more than 9" away from any enemy models.',
      },
      "Abilities§Command-link": {
        text: 'Add 3" to the range of this unit\'s aura abilities (to a maximum of 12"). Each time a model in this unit uses an ability in your Command phase (excluding aura abilities), add 3" to the range of that ability.',
      },
      "Abilities§Counterfire defence system": {},
      "Abilities§Counterfire Defence System": {
        text: "The bearer gains the COUNTERFIRE DEFENCE SYSTEM keyword.",
      },
      "Abilities§Crushing Strike": {
        text: "Each time this model finishes a charge move, select one enemy unit within Engagement Range of it and roll one D6: on a 4-5 that enemy unit suffers D3 mortal wounds; on a 6, that enemy unit suffers 3 mortal wounds.",
      },
      "Abilities§Dal'yth Sept Tenet: Trading Partners": {
        text: "- Each time a ranged attack is made against an INFANTRY unit with this tenet, if the attacker is not within Engagement Range of that unit, models in that unit receive the benefits of Light Cover against that attack (see the Warhammer 40,000 Core Book).\n- If you selected a Tactical Philosophy (pg 92) at the start of the battle, T'AU AUXILIARY units that are in the same Detachment as units with this tenet benefit from your army's selected Tactical Philosophy.",
      },
      "Abilities§Defender of the Greater Good": {
        text: "In your Command phase, select one friendly T'AU EMPIRE CORE or T'AU EMPIRE CHARACTER unit within 6\" of this unit's COMMANDER SHADOWSUN model. Until the start of your next Command phase, each time a CORE or CHARACTER model in that unit makes an attack, you can re-roll the hit roll.",
      },
      "Abilities§Dispersion Field": {
        text: "This model has a 5+ invulnerable save.",
      },
      "Abilities§Dominator Fragmentation Launcher": {
        text: "COMMANDER or CRISIS equipped with one or more airbursting fragmentation projectors only. This Prototype System replaces one airbursting fragmentation projector.",
      },
      "Abilities§Drone Control Systems": {
        text: 'In your Command phase, if any friendly <SEPT> units are embarked within the TRANSPORT, you can select one DRONES unit within 6" of this TRANSPORT. Until the start of your next Command phase:\n\n- DRONE models in that unit have a Ballistic Skill characteristic of 4+.\n- GUN DRONE models in that unit lose the Drone Identification Protocol ability.',
      },
      "Abilities§Drone controller": {},
      "Abilities§Drone Controller": {
        text: 'In your Command phase, you can select one DRONE unit within 6" of the bearer, until the start of your next Command phase:\n- DRONE models in that unit have a Ballistic Skill characteristic of 4+.\n- GUN DRONE models in that unit lose the Drone Identification Protocol ability.',
      },
      "Abilities§Drone Dock (Devilfish)": {
        text: "If this unit contains any DRONE models, those DRONE models begin the game docked with this unit's DEVILFISH model.",
      },
      "Abilities§Drone Dock (Hammerhead)": {
        text: "If this unit contains any DRONE models, those DRONE models begin the game docked with this unit's HAMMERHEAD model.",
      },
      "Abilities§Drone Dock (Piranhas)": {
        text: "For each PIRAHNA model in this unit, two of this unit's DRONE models begin the battle docked with that PIRAHNA model.",
      },
      "Abilities§Drone Dock (Sky Ray)": {
        text: "If this unit contains any DRONE models, those DRONE models begin the battle docked with this unit's SKY RAY GUNSHIP model.",
      },
      "Abilities§Drone Dock (Sun Shark)": {
        text: "This unit's INTERCEPTOR DRONE models begin the battle docked with this unit's SUN SHARK BOMBER model.",
      },
      "Abilities§Drone Dock (Tidewall)": {
        text: "If this unit contains any DRONE models, those DRONE models begin the battle docked with this unit's TIDEWALL DRONEPORT model.",
      },
      "Abilities§Drone Familiar Cluster": {
        text: "Each time this model is selected to shoot, you can re-roll one hit roll and you can re-roll one wound roll when resolving this model's attacks.",
      },
      "Abilities§Drone Shield Generator": {
        text: "A model with a shield generator has a 4+ invulnerable save.",
      },
      "Abilities§Drone Uplink": {
        text: "In your Command phase, you can select one SNIPER DRONE unit within 6\" of this unit's FIRESIGHT MARKSMAN model. Until the start of your next Command phase:\n\n- SNIPER DRONE models in that unit have a Ballastic Skill characteristic of 3+.\n- Each time you select a target for an attack made by a SNIPER DRONE model in that unit, you can ignore the Look Out, Sir rule.\n- Each time an attack is made by a SNIPER DRONE model in that unit, an unmodified wound roll of 6 inflicts 1 mortal wound on the target in addition to any normal damage.",
      },
      "Abilities§DS8 Support Turret": {
        text: "The following rules apply to Support Turret models:\n\n- Support Turret models are ignored for the purposes of determing a unit's Starting Strength, and whether or not it is at Half Strength.\n- The destruction of Support Turret models is ignored for the purpose of Morale Tests.\n- Support Turret models do not take up space in a TRANSPORT.\n- In your movement phase, each time this unit is selected to move, if it contains a Support Turret model that is on the battlefield, you can remove that model from the battlefield (it does not count as destroyed).",
      },
      "Abilities§DW-02 Advanced Burst Cannon": {
        text: "COMMANDER or CRISIS model equipped with one of more burst cannons only. This Prototype System replaces one burst cannon.",
      },
      "Abilities§Dynamic Mirror Field": {
        text: '- The bearer cannot be selected as a target for ranged attacks unless it is the closest target to the firing model or the firing model is within 12" of it.\n- The bearer has a 5+ invulnerable save.',
      },
      "Abilities§E-H Disruption Suite": {
        text: 'GHOSTKEEL BATTLESUIT model only. Once per battle, in your Command phase, the bearer can use this Prototype System. If it does, until the start of your next Command phase, it gains the following ability:\n\nE-H Disruption (Aura): While an enemy unit is within 12" of this model, each time your opponent selects that unit for a Stratagem and each time your opponent uses a Stratagem when that unit is selected to shoot or fight, increase the CP cost of that Stratagem by 1CP. Note that the CP used is only increased by 1CP for that use of the Stratagem, any future usages of it cost the normal amount of CPs.',
      },
      "Abilities§Early warning override": {},
      "Abilities§Early Warning Override": {
        text: "- Each time the bearer fires Overwatch, it scores hits on unmodified hit rolls of 5+, instead of 6.\n- Each time you use the Fire Overwatch Stratagem, if the bearer is on the battlefield and its unit is selected to fire Overwatch, reduce the CP cost of that Stratagem by 1CP (to a minimum of 0CP). Note that the CP cost is only reduced by 1CP for that use of the Stratagem, any future usages of it cost the normal amount of CPs.",
      },
      "Abilities§Eclipse Shield Generator": {
        text: "This model has a 4+ invulnerable save. In addition, add 1 to armour saving throws for this model.",
      },
      "Abilities§Embodiments of the Empire": {
        text: "This model cannot be drawn from the FARSIGHT ENCLAVES Sept.",
      },
      "Abilities§Enclave Commander": {
        text: "If your army is Battle-forged, this model must be your army's WARLORD. If more than one model in your army has a rule to this effect, then one of those models must be your army's WARLORD.",
      },
      "Abilities§Energy Shield": {
        text: "This model has a 4+ invulnerable save.",
      },
      'Abilities§Explodes (6/2D6"/2D6)': {
        text: 'When this model is destroyed, roll one D6 before any embarked models disembark and before removing it from play. On a 6 it explodes, and each unit within 2D6" suffers 2D6 mortal wounds.',
      },
      'Abilities§Explodes (6/3"/1)': {
        text: 'If this model is reduced to 0 wounds, roll a D6 before removing it from the battlefield and before any embarked models disembark. On a 6 it explodes, and each unit within 3" suffers a mortal wound.',
      },
      'Abilities§Explodes (6/6"/D3)': {
        text: 'When this model is destroyed, roll one D6 before removing it from play. On a 6 it explodes, and each unit within 6" suffers D3 mortal wounds.',
      },
      'Abilities§Explodes (6/9"/D6)': {
        text: 'If this model is reduced to 0 wounds, roll a D6 before removing it from the battlefield. On a 6 it explodes, and each unit within 9" suffers D6 mortal wounds.',
      },
      "Abilities§Explodes (Devilfish)": {
        text: "When this unit's DEVILFISH model is destroyed, roll one D6 before removing it from the play. On a 6, it explodes and each unit within 6\" suffers D6 mortal wounds.",
      },
      "Abilities§Explodes (Ghostkeel)": {
        text: "When this unit's GHOSTKEEL BATTLESUIT model is destroyed, roll one D6 before removing it from play. On a 6 it explodes, and each unit within 6\" suffers D3 mortal wounds.",
      },
      "Abilities§Explodes (Hammerhead)": {
        text: "When this unit's HAMMERHEAD model is destroyed, roll one D6 before removing it from the play. On a 6, it explodes and each unit within 6\" suffers D6 mortal wounds.",
      },
      "Abilities§Explodes (Manta)": {
        text: 'When this model is destroyed, roll one D6 before removing it from play. On a 4-5, it explodes, and each unit within 2D6" suffers D6 mortal wounds. On a 6, it explodes, and each unit within 3D6" suffers 2D3 mortal wounds.',
      },
      "Abilities§Explodes (Piranhas)": {
        text: 'Each time a PIRAHNA model in this unit is destroyed, roll one D6 before removing it from play. On a 6 it explodes, and each unit within 3" suffers 1 mortal wound.',
      },
      "Abilities§Explodes (Riptide)": {
        text: "When this unit's RIPTIDE model is destroyed, roll one D6 before removing it from play. On a 6 it explodes, and each unit within 6\" suffers D3 mortal wounds.",
      },
      "Abilities§Explodes (Sky Ray)": {
        text: "When this unit's SKY RAY GUNSHIP model is destroyed, roll one D6 before removing it from the play. On a 6, it explodes and each unit within 6\" suffers D6 mortal wounds.",
      },
      "Abilities§Explodes (Stormsurge)": {
        text: 'When this model is destroyed, roll one D6 before removing it from play. On a 6 it explodes, and each unit within 2D6" suffers D6 mortal wounds.',
      },
      "Abilities§Explodes (Sun Shark)": {
        text: "When this unit's SUN SHARK BOMBER model is destroyed, roll one D6 before removing it from play. On a 6 it explodes, and each unit within 6\" suffers D3 mortal wounds.",
      },
      "Abilities§Failure Is Not An Option (Aura)": {
        text: "While a friendly T'AU EMPIRE CORE unit (excluding FARSIGHT ENCLAVES and T'AU AUXILIARY units) is within 6\" of this unit's ETHEREAL model, models in that unit can use this model's Leadership characteristic instead of their own.",
      },
      "Abilities§Farsight Enclaves Tenet: Devastating Counterstrike": {
        text: "- Each time a model with this tenet makes a ranged attack that targets a unit within 9\", the target is treated as having a Markerlight token (pg 93).\n- Each time a unit with this tenet is selected to shoot or fight, you can re-roll one wound roll when resolving that unit's attacks.",
      },
      "Abilities§Fighting Retreat (Aura)": {
        text: "While a friendly T'AU SEPT CORE unit (excluding BATTLESUIT units) is within 6\" of this model, that unit is eligible to shoot in a turn in which it Fell Back.",
      },
      "Abilities§Firing Positions": {
        text: "In your Shooting phase, any models embarked within this TRANSPORT can be selected to shoot with, measuring distances and doing line of sight from any point on this Building when doing so (embarked models can make attacks with ranged weapons even while this Building is within Engagement Range of enemy units (just as if they had the Big Guns Never Tire rule like a VEHICLE, as described in the Warhammer 40,000 Core Book.)",
      },
      "Abilities§Flare Launcher": {
        text: "Each time the bearer would lose a wound as a result of a ranged attack with a Strength characteristic of 7 or more, roll one D6: on a 5+, that wound is not lost.",
      },
      "Abilities§Fusion blades (Ranged)": {},
      "Abilities§Ghostkeel Electrowarfare Suite": {
        text: "While this unit's GHOSTKEEL BATTLESUIT model has any wounds remaining, each time a ranged attack targets this unit, subtract 1 from that attack's hit roll.",
      },
      "Abilities§Grav-Inhibitor Field": {
        text: "- At the start of the Fight phase, all enemy units within Engagement Range of bearer are not eligible to fight this phase until after all eligible units from your army have done so.\n- Each time a melee attack is made against the bearer, subtract 1 from that attack's hit roll.",
      },
      "Abilities§Gravity Wave Projector": {
        text: "Subtract 2 from charge rolls made for any units that declare a charge against this unit.",
      },
      "Abilities§Guardian Shield Generator": {
        text: "This model has a 4+ invulnerable save. Each time a ranged attack is made against this unit, an unmodified wound roll of 1-2 for that attack fails, irrespective of any abilities that the weapon or the model making the attack may have.",
      },
      "Abilities§Gunship Ace": {
        text: "Each time this unit's HAMMERHEAD model makes a ranged attack against  MONSTER or VEHICLE unit, add 1 to that atack's wound roll.",
      },
      "Abilities§Hard to Hit": {
        text: "Each time a ranged attack is made against this model, subtract 1 from that attack's hit roll.",
      },
      "Abilities§Hard to Hit (Sun Shark)": {
        text: "Each time a ranged attack is made against this unit's SUN SHARK BOMBER model, subtract 1 from that attack's hit roll.",
      },
      "Abilities§Hardened Armour": {
        text: "Each time an attack is allocated to this unit's ENFORCER BATTLESUIT COMMANDER model, subtract 1 from the Damage characteristic of that attack (to a minimum of 1).",
      },
      "Abilities§Hero of the Empire (Shadowsun)": {
        text: "If your army is Battle-forged, this units COMMANDER SHADOWSUN model must be your army's WARLORD. If more than one model in your army has a rule to this effect, then one of those models must be your army's WARLORD.",
      },
      "Abilities§High Intensity Markerlights": {
        text: "Each time a model in this unit performs the Fire Markerlights action (see Codex: T’au Empire), roll two additional D6.",
      },
      "Abilities§High-altitude Manoeuvres": {
        text: 'Once per battle, at the start of your Movement phase, you can remove this unit from the battlefield. If you do, then in the Reinforcements step of that phase, you can do one of the following:\n\n- Set this unit back up on the battlefield, anywhere that is more than 9" away from any enemy models.\n- If the mission you are playing is using the Strategic Reserves rule, place this unit into Strategic Reserves.',
      },
      "Abilities§Homing Beacon": {
        text: 'If this unit is equipped with a homing beacon, it can perform the following action:\n\n\'Homing Beacon (Action): In your Command phase, any number of units from your army that are equipped with homing beacons can start to perform this action. The action is completed at the start of the Reinforcements step of your next Movement phase. When it is completed, the unit performing the action loses its homing beacon and one friendly <SEPT> CRISIS CORE unit that was set up in a Manta Hold (see Manta Strike, pg 92), can be set up on the battlefield within 3" of the unit" and more than 9" away from any enemy models, even if it is the first battle round.\'',
      },
      "Abilities§Hover (Manta)": {
        text: "In your Command phase, this model can hover, if it does, then until the start of your next Command phase, it's Move characteristic becomes 20\" and it loses the Airborne, Hard to Hit and Supersonic abilities.",
      },
      "Abilities§Hover Drone": {
        text: "The bearer has a Move characteristic of 10 and the FLY keyword.",
      },
      "Abilities§Hover Jet (Orca Dropship)": {
        text: 'In your Command phase, this model can hover. If it does, then until the start of your next Command phase, its Move characteristic becomes 20" and it loses the Airborne, Hard to Hit and Supersonic abilities.',
      },
      "Abilities§Hover Tank (Devilfish)": {
        text: "Distances are measured to and from the hull or the base of this\nunit’s VEHICLE model; whichever is closest.",
      },
      "Abilities§Hover Tank (Hammerhead)": {
        text: "Distances are measured to and from the hull or the base of this\nunit’s VEHICLE model; whichever is closest.",
      },
      "Abilities§Hover Tank (Sky Ray)": {
        text: "Distances are measured to and from the hull or the base of this\nunit’s VEHICLE model; whichever is closest.",
      },
      "Abilities§Infiltrator": {
        text: 'During deployment, when you set up this unit, it can be set up anywhere on the battlefield that is more than 9" away from the enemy deployment zone and any enemy models.',
      },
      "Abilities§Inspirational Defiance (Aura)": {
        text: "While a friendly VIOR'LA CORE unit is within 6\" of this model, each time an enemy unit declares a charge against that friendly unit, if that friendly unit is not within Engagement Range of any enemy units, it can Hold Steady or Set to Defend.",
      },
      "Abilities§Internal Grenade Packs": {
        text: "Once per turn, after this model has moved in your Movement phase, you can select one unit it moved across and roll one D6: on a 2+, that unit suffers D3 mortal wounds.",
      },
      "Abilities§Iridium battlesuit": {
        text: "The bearer has a Save characteristic of 2+.",
      },
      "Abilities§Kroot Pack": {
        text: "If your army is Battle-forged, then for each KROOT CARNIVORES unit included in a Detachment, up to one KROOTOX RIDERS unit, up to one KROOT HOUNDS unit, and up to one KROOT SHAPER unit can be included in that Detachment without taking up Battlefield Role slots.",
      },
      "Abilities§Leadership Caste (Aun'Shi)": {
        text: "This unit can be included in any T'AU EMPIRE Detachment (excluding FARSIGHT ENCLAVES Detachments) without preventing that Detachment from being a Sept Detachment and without preventing other units in your army from benefiting from a Sept Tenet (pg 55), but this unit can only benefit from a Sept Tenet is every <SEPT> unit (excluding SUPREME COMMANDER units) in your army is from VIOR'LA SEPT.",
      },
      "Abilities§Leadership Caste (Aun'va)": {
        text: "This unit can be included in any T'AU EMPIRE Detachment (excluding FARSIGHT ENCLAVES Detachments) without preventing that Detachment from being a Sept Detachment and without preventing other units in your army from benefiting from a Sept Tenet (pg 55), but this unit can only benefit from a Sept Tenet is every <SEPT> unit (excluding SUPREME COMMANDER units) in your army is from T'AU SEPT.",
      },
      "Abilities§Loping Stride": {
        text: 'Each time this unit Advances, do not make an Advance roll. Instead, until the end of the phase, add 6" to the Move characteristic of models in this unit.',
      },
      "Abilities§Markerlight": {
        text: "The bearer gains the MARKERLIGHT keyword.",
      },
      "Abilities§Marksman Stealth Field": {
        text: 'This unit cannot be selected as a target for ranged attacks unless it is the closest eligible target to the firing model or is within 12" of the firing model. In your Movement phase, if this unit does not Remain Stationary, it loses this ability until the start of your next Movement phase.',
      },
      "Abilities§Master of the Killing Blow": {
        text: "Each time this WARLORD makes an attack:\n\n- On an unmodified wound roll of 6, improve the Armour Penetration characteristic of that attack by 3.\n- The model that attack is allocated to cannot use any rules to ignore the wounds it loses.",
      },
      "Abilities§Master of War (Aura) (Coldstar)": {
        text: "While a friendly T'AU EMPIRE CORE unit is within 6\" of this unit's COLDSTAR BATTLESUIT COMMANDER model, each time a CORE model in this unit makes an attack, re-roll a hit-roll of 1.",
      },
      "Abilities§Master of War (Aura) (Crisis)": {
        text: "While a friendly T'AU EMPIRE CORE unit is within 6\" of this unit's CRISIS BATTLESUIT COMMANDER model, each time a CORE model in this unit makes an attack, re-roll a hit-roll of 1.",
      },
      "Abilities§Master of War (Aura) (Enforcer)": {
        text: "While a friendly T'AU EMPIRE CORE unit is within 6\" of this unit's ENFORCER BATTLESUIT COMMANDER model, each time a CORE model in this unit makes an attack, re-roll a hit-roll of 1.",
      },
      "Abilities§Master of War (Aura) (Farsight)": {
        text: "While a friendly T'AU EMPIRE CORE unit is within 6\" of this unit's COMMANDER FARSIGHT model, each time a CORE model in this unit makes an attack, re-roll a hit-roll of 1.",
      },
      "Abilities§Master of War (Aura) (Shadowsun)": {
        text: "While a friendly T'AU EMPIRE CORE unit is within 6\" of this unit's COMMANDER SHADOWSUN model, each time a CORE model in this unit makes an attack, re-roll a hit-roll of 1.",
      },
      "Abilities§Mobile Defences (Action)": {
        text: "Units from your army can perform the following action:\n\n'Mobile Defences (Action): At the start of your Movement phase, one unit from your army that is embarked within a TIDEWALL TRANSPORT can start to perform this action (even though units embarked within TRANSPORTS cannot usually perform actions). The action is completed at the end of that phase. If this action is completed successfully, that TIDEWALL SHIELDLINE can make a Normal Move as if it had a Move characteristic of 8\" and had the FLY keyword.",
      },
      "Abilities§Multi-function Surveyor": {
        text: 'In your Command phase, select one of the following protocols for this unit to perform:\n- Repair Protocol: This unit can repair one friendly <SEPT> BATTLESUIT model within 3" of it. That BATTLESUIT model regains up to D3 lost wounds. Each model can only be repaired once per turn.\n- Surveillance Protocol: Select one enemy unit within 12" of this unit. Until the end of the turn, that enemy unit does not receive the benefits of Light Cover.',
      },
      "Abilities§Multi-sensory Discouragement Array": {
        text: "At the end of your Movement phase, select one enemy unit within 12\" of the bearer and roll 3D6, if the result is greater than the enemy unit's Leadership characteristic, select one of the results below to take effect until the start of your next Movement phase.\n\n- The selected unit loses the Objective Secured ability.\n- Halve the Move characteristic of models in that unit and halve charge rolls made for that unit.\n- Each time a model in that unit makes a ranged attack, it can only target the closest eligible target.",
      },
      "Abilities§Multi-tracker": {
        text: "Each time a ranged attack made by the bearer targets a unit containing 6 or more models, an unmodified hit roll of 6 scores 1 additional hit. Maximum 1 per model.",
      },
      "Abilities§Neuro-empathic Nullfier": {
        text: 'ETHEREAL model only. Once per battle, in your Command phase, the bearer can use this Relic. If it does, select one enemy unit within 18" of and visible to the bearer and roll one D6: on a 2+, until the start of the next Command phase, the target cannot perform actions (if that unit is currently performing an action, it immediately fails).',
      },
      "Abilities§Neuroweb System Jammer": {
        text: "The bearer gains the NEUROWEB SYSTEM JAMMER keyword.",
      },
      "Abilities§New InfoLink": {},
      "Abilities§Nova Reactor (R'varna)": {
        text: "In your Command phase, you can use this model's Nova Reactor. If you do, inflict 1 mortal wound on this model then select one of the following effects:\n- Until the start of your next Command phase, this model has a 4+ invulnerable save.\n- Until the start of your next Command phase, you can select the Nova profile of weapons this model is equipped with.\n- Until the start of your next Command phase, in each Fight phase, roll one D6 for each enemy unit within 6\" of this model, on a 4+ that unit suffers D3 mortal wounds.",
      },
      "Abilities§Nova Reactor (Riptide)": {
        text: "In your Command phase, this unit's RIPTIDE model can use its Nova Reactor. If it does, roll 2D6, if the result is greater than the remaining wounds of this RIPTIDE model, its Nova Reactor is burned out and this ability cannot be used again this battle, otherwise, you can select one of the following reactor abilities:\n\n- Nova Shield: Until the start of your next Command phase, each time this model would lose a wound, roll one D6: on a 5+, that wound is not lost.\n- Boost: In your next Charge phase, this unit can make a Normal Move of up to 2D6\". If it does, until the end of the phase, you cannot declare a charge with this unit.\n- Nova Charge: Until the start of your next COmmand phase, if this model is equipped with a heavy burst cannon, that weapon has a Type characteristic of Heavy 16, otherwise, both profiles of that model's ion accelerator have a type characteristic of Heavy 8.",
      },
      "Abilities§Nova Reactor (Y'vahra)": {
        text: "In your Command phase, you can use this model's Nova Reactor. If you do, inflict 1 mortal wound on this model then select one of the following effects:\n- Until the start of your next Command phase, this model has a 4+ invulnerable save.\n- Until the start of your next Command phase, you can select the Nova profile of weapons this model is equipped with.\n- Until the start of your next Command phase, add 12\" to the Move characteristic of this model and it is eligible to shoot in a turn in which it falls back.",
      },
      "Abilities§Novasurge Plasma Rifle": {
        text: "COMMANDER or CRISIS model equipped with one or more plasma rifles only. This Prototype System replaces one plasma rifle.",
      },
      "Abilities§Ohr'tu's Lantern": {
        text: "Model equipped with a markerlight only. Each time this model performs the Fire Markerlights action (pg 93), roll five additional D6s (each of which causes the enemy unit to gain one Markerlight token on a roll of 3+).",
      },
      "Abilities§Outflank": {
        text: 'During deployment, you can set up this unit behind enemy lines instead of setting it up on the battlefield. If you do, then in the Reinforcements step of any of your Movement phases you can set up this unit wholly within 6" of any battlefield edge and more than 9" away from any enemy models.',
      },
      "Abilities§Outflanking Harassers": {
        text: 'During deployment, you can set up this unit behind enemy lines instead of setting it up on the battlefield. If you do, then in the Reinforcements step of any of your Movement phases you can set up this unit wholly within 6" of any battlefield edge and more than 9" away from any enemy models.',
      },
      "Abilities§Overdrive Power Systems": {
        text: "COMMANDER model only. Select up to two ranged weapons this model is equipped with. Each time the bearer makes a ranged attack with one of those weapons that targets a unit within half range, add 1 to that attack's wound roll.",
      },
      "Abilities§Paradox of Duality": {
        text: "Models in this unit have a 5+ invulnerable save. Each time an attack is made against this unit, subtract 1 from that atatck's wound roll.",
      },
      "Abilities§Photon Casters": {
        text: "Each time this unit is declared as a target of a charge, subtract 2 from that charge's charge roll.",
      },
      "Abilities§Plunge from the Sky": {
        text: 'During deployment, you can set up this unit high in the sky instead of setting it up on the battlefield. If you do, then in the Reinforcements step of one of your Movement phases, you can set up this unit anywhere on the battlefield that is more than 9" away from any enemy models.',
      },
      "Abilities§Positional Relay": {
        text: 'Once per battle round, when you set up a friendly <SEPT> Strategic Reserves unit, the bearer can use this weargear item. if it does, that unit counts the battle round as being one higher than the current battle round number for the purposes of determining where it can be set up, but when doing so it must be set up within 6" of the bearer.',
      },
      "Abilities§Positional Relay (Aura)": {
        text: "While a friendly <SEPT> INFANTRY unit is within 6\" of this model, each time that unit fights, you can re-roll one hit roll and you can re-roll one wound roll when resolving that unit's attacks.",
      },
      "Abilities§Pulse Accelerator": {
        text: "Each time a model in this unit makes an attack with a pulse weapon (pg 130), improve the Armour Penetration characteristic of that attack by 1.",
      },
      "Abilities§Pulse Bombs": {
        text: "Once per turn, after this unit's SUN SHARK BOMBER model has moved in your Movement phase, you can select one unit it moved across. Roll six D6s for each VEHICLE or MONSTER model in that unit and roll one D6 for each other model in that unit (to a maximum of ten D6s), for each 4+, that unit suffers 1 mortal wound.",
      },
      "Abilities§Puretide Engram Neurochip": {
        text: "While the bearer is on the battlefield, each time you spend a Command point to use a T'au Empire Battle Tactic or T'au Empire Epic Deed Stratagem, roll one D6: on a 3+ that Command point is refunded.",
      },
      "Abilities§R'varna Shield Generator": {
        text: "This model has a 5+ invulnerable save.",
      },
      "Abilities§Recon Suite": {
        text: 'Each time a model in this unit makes a ranged attack that targets a unit within 18", the target does not receive the benefits of Light Cover against that attack.',
      },
      "Abilities§Resolute Firebase": {
        text: "In your Command phase, you can select one friendly <SEPT> CRISIS CORE unit within 9\" of this unit's ENFORCER BATTLESUIT COMMANDER model. Until the start of your next Command phase, that unit gains the Objective Secured ability.",
      },
      "Abilities§Resonator Warheads": {
        text: "COMMANDER or CRISIS model equipped with one or more missile pods only. This Prototype System replaces one missile pod.",
      },
      "Abilities§Riptide Shield Generator": {
        text: "This unit's RIPTIDE model has a 4+ invulnerable save.",
      },
      "Abilities§Sa'cea Sept Tenet: Masters of Urban Warfare": {
        text: '- Each time a ranged attack targets a VEHICLE unit with this tenet, if the attacker is more than 18" away, then the target is treated as having the benefits of Dense Cover against that attack (see the Warhammer 40,000 Core Book).\n- Each time a ranged attack targets an INFANTRY unit with this tenet, if the attacker is more than 12" away, then the target is treated as having the benefits of Dense Cover against that attack.\n- VEHICLE and BATTLESUIT models with this tenet do not suffer the penalty incurred to their hit rolls for firing Heavy weapons at enemy units that are within Engagement Range of them.',
      },
      "Abilities§Seeker of Perfection": {
        text: "Each time this WARLORD makes a ranged attack:\n- Improve the Armour Penetration characteristic of that attack by 1.\n- An unmodified wound roll of 6 inflicts 1 mortal wound on the target in addition to any normal damage (to a maximum of 3 mortal wounds per phase).",
      },
      "Abilities§Sensory Negation Countermeasures": {
        text: "COMMANDER or CRISIS model only. Once per battle, at the start of the Fight phase, the bearer can use this Prototype System. If it does, select one enemy unit within Engagement Range of the bearer's unit. Until the end of the next turn, each time a model in that enemy unit makes an attack, subtract 1 from that attack's hit roll.",
      },
      "Abilities§Serene Unifier (Aun'Shi)": {
        text: "This model knows three invocations from the Invocations of the Ethereals (pg 76). In your Command phase, if this unit's Aun'Shi model is on the battlefield, it can intone up to two invocations it knows that have not already been intoned by a friendly model this turn. Roll one D6: on a 2+, the intoned invocation is inspiring and takes effect until the start of your next Command phase.",
      },
      "Abilities§Serene Unifier (Aun'va)": {
        text: "This unit's Aun'va model knows three invocations from the Invocations of the Ethereals (pg 76). In your Command phase, if this unit's Aun'va model is on the battlefield, it can intone up to two invocations it knows that have not already been intoned by a friendly model this turn. Roll one D6: on a 2+, the intoned invocation is inspiring and takes effect until the start of your next Command phase.",
      },
      "Abilities§Serene Unifier (Ethereal)": {
        text: "This model knows two invocations from the Invocations of the Ethereals (pg 76). In your Command phase, if this model is on the battlefield, it can intone one Invocation it knows that has not already been inspired by a friendly model this turn. Roll one D6: on a 3+, the intoned invocation is inspiring and takes affect until the start of your next Command phase.",
      },
      "Abilities§Set up Turret": {
        text: "If this unit contains a Support Turret, that model is not set up until the unit performs the following action:\n\n'Deploy Turret (Action): In your Command phase, any number of BREACHER TEAM or STRIKE TEAM units from your army can start to perform this action. This action is completed at the end of your next Movement phase. When it is completed, if that unit contains a Support Turret model that is not on the battlefield and has not been destroyed, set that Support Turret model up on the battlefield in Unit Coherency with that unit.'",
      },
      "Abilities§Set-up (Shieldline)": {
        text: 'When this unit is first set up on the battlefield, if it contains a Tidewall Defence Platform, it must be set up within 1" of this unit\'s Tidewall Shieldline. TIDEWALL terrain features can be set up within 3" of other friendly TIDEWALL terrain features.',
      },
      "Abilities§Set-Up (Tidewall)": {
        text: 'TIDEWALL terrain features can be set up within 3" of other friendly TIDEWALL terrain features.',
      },
      "Abilities§Shield Generator": {
        text: "The bearer has a 4+ invulnerable save.",
      },
      "Abilities§Shield generator (Drone)": {},
      "Abilities§Solid-image Projection Unit": {
        text: "- Once per turn, the first time a saving throw is failed for the bearer, the Damage characteristic of that attack is changed to 0.\n- The bearer has a 4+ invulnerable save.",
      },
      "Abilities§Stabilised Optics": {
        text: "The bearer does not suffer the penalty to hit rolls incurred for firing Heavy weapons in the same turn that their unit has moved, and does not suffer the penalty to hit rolls incurred to firing Heavy weapons at a target that is within Engagement Range of their unit.",
      },
      "Abilities§Stabilising Anchors": {
        text: "This model can perform the following action:\n\n'Deploy Anchors (Action): At the start of your Movement phase, any number of STORMSURGE models from your army can start to perform this action. The action is completed at the start of your next Shooting phase, if this action is successfully completed, until the end of the phase, each time this model makes a ranged attack, you can re-roll the hit roll.'",
      },
      "Abilities§Starflare Ignition System": {
        text: 'COLDSTAR COMMANDER model only. Once per battle, when the bearer starts or ends a move, or when it does its High-altitude Manoeuvres ability (before removing it from the battlefield), it can use this Prototype System. If it does, roll one D6 for each other unit within 3" of this model: on a 2+, that unit suffers D3 mortal wounds.',
      },
      "Abilities§Stealth Field Generator": {
        text: 'This unit cannot be selected as a target for ranged attacks unless it is the closest eligible target to the firing model or the firing model is within 18" of it.',
      },
      "Abilities§Stealth Field Technology": {
        text: "Each time a ranged attack is made against this unit, it is treated as having the benefits of light cover against that attack.",
      },
      "Abilities§Stealthy Hunter": {
        text: "Each time a ranged attack is allocated to this model while it is receiving the benefits of cover, add an additional 1 to any armour saving throws made against that attack.",
      },
      "Abilities§Stealthy Hunters": {
        text: "Each time a ranged attack is allocated to a model in this unit while it is receiving the benefits of cover, add an additional 1 to any armour saving throw made against that attack.",
      },
      "Abilities§Stimm Injectors": {
        text: "COMMANDER or CRISIS model only. Once per battle, when a saving throw is failed for the bearer, the bearer can use this Prototype System. if it does, until the end of the turn, each time the bearer would lose a wound, roll one D6: on a 4+ that wound is not lost.",
      },
      "Abilities§Stormsurge Shield Generator": {
        text: "This model has a 4+ invulnerable save.",
      },
      "Abilities§Stratagem: Emergency Dispensation": {
        text: "Use this Stratagem before the battle, when you are mustering your army. If your WARLORD has the T'AU EMPIRE keyword, select one T'AU EMPIRE CHARACTER model in your army and give them one Relic (this must be a Relic they can have). Each Relic in your army must be unique, and you cannot use this Stratagem to give a model two Relics. You can only use this Stratagem once, unless you are playing a Strike Force battle (in which case you can use this Stratagem twice), or an Onslaught battle (in which case you can use this Stratagem three times).",
      },
      "Abilities§Stratagem: Promising Pupil": {
        text: "Use this Stratagem before the battle, when you are mustering your army, if your WARLORD has the T'AU EMPIRE keyword. Select one T'AU EMPIRE CHARACTER model in your army and determine one Warlord Trait for that model (this must be a Warlord Trait they can have); this model is regarded as your Warlord for the purposes of that Warlord Trait.\n\nEach Warlord Trait in your army must be unique (if randomly generated, re-roll duplicate results), and you cannot use this Stratagem to give a model two Warlord Traits. You can only use this Stratagem once, unless you are playing a Strike Force battle (in which case you can use this Stratagem twice), or an Onslaught battle (in which case you can use this Stratagem three times).",
      },
      "Abilities§Strategic Conqueror": {
        text: "In your Command phase, select one friendly SA'CEA unit within 9\" of thie WARLORD. Until the start of your next Command phase, that unit gains the Objective Secured ability (see the Warhammer 40,000 Core Book). If that unit already has this ability, models in that unit count as one additional model when determining control of an objective marker.",
      },
      "Abilities§Strength of Conviction": {
        text: "Each time this WARLORD would lose a wound, roll one D6: on a 5+ that wound is not lost.",
      },
      "Abilities§Structural Analyser": {
        text: "In your Command phase, you can select one friendly T'AU SEPT CORE unit within 6\" of this model and one enemy unit visible to this model. Until the end of the turn, each time a model in that T'AU SEPT CORE unit makes a ranged attack against that enemy unit, add 1 to that attack's wound roll.",
      },
      "Abilities§Supersonic": {
        text: "Each time this model makes a Normal Move, Advances or Falls Back, first pivot it on the spot up to 90 degrees (this does not contribute to how far the model moves), then move the model straight forwards. It cannot pivot againafter the initial pivot.",
      },
      "Abilities§Supersonic (Sun Shark)": {
        text: "Each time this unit's SUN SHARK BOMBER model makes a Normal Move, Advances, or Falls Back, first pivot it on the spot up to 90 degrees (this does not contribute to how far the model moves), then move the model straight forwards. It cannot pivot againafter the initial pivot.",
      },
      "Abilities§Supersonic (Tiger Shark)": {},
      "Abilities§Supreme Loyalty (Aura)": {
        text: "While a friendly T'AU EMPIRE CORE unit  (excluding FARSIGHT ENCLAVES or T'AU AUXILIARY units) is within 9\" of this unit's ETHEREAL model, models in that unit can use this unit's Leadership characteristic instead of their own.",
      },
      "Abilities§Sworn Protectors": {
        text: 'While a friendly <SEPT> CHARACTER model (excluding VEHICLE and MONSTER models) is within 3" of any CRISIS models in this unit, that Character unit can use the Look Out, Sir rule even if this unit contains fewer than 3 models.',
      },
      "Abilities§T'au Sept Tenet: Coordinated Fire Arcs": {
        text: '- Each time a unit with this tenet is selected to shoot or fight, you can re-roll one hit roll or one wound roll when resolving that unit\'s attacks.\n- Add 3" to the range of aura abilities of models with this tenet (to a maximum of 12").\n- Each time a model with this tenet intones an invocation that is not an aura, or uses an ability in your Command phase that specifies a range, add 3" to the range of that invocation or ability (to a maximum of 12").',
      },
      "Abilities§Ta'unar Shield Generator": {
        text: "This model has a 5+ invulnerable save.",
      },
      "Abilities§Tactical Acumen (Crisis)": {
        text: "In your Command Phase, you can select one firendly <SEPT> CRISIS CORE unit within 9\" of this unit's CRISIS BATTLESUIT COMMANDER model. Until the end of the turn:\n\n- That unit is eligible to shoot and declare a charge with in a turn in which it Fell Back.\n- Each time a CORE model in that unit makes a ranged attack, you can ignore any or all hit modifiers.",
      },
      "Abilities§Tactical Acumen (Farsight)": {
        text: 'In your Command Phase, you can select one friendly FARSIGHT ENCLAVES CRISIS CORE unit within 9" of this model. Until the end of the turn:\n\n- That unit is eligible to shoot and declare a charge with in a turn in which it Fell Back.\n- Each time a CORE model in that unit makes a ranged attack, you can ignore any or all hit modifiers.',
      },
      "Abilities§Tactical Disengagement": {
        text: 'At the end of your Movement phase, if you selected the Kauyon Tactical Philosophy, at the start of the battle and if the mission you are playing is using the Strategic Reserves rule, you can remove this unit from the battlefield if it is within 9" of any battlefield edges and place it in Strategic Reserves.',
      },
      "Abilities§Talisman of Arthas Moloch": {
        text: "- In your opponent's Psychic phase, the bearer can attempt to deny one psychic power as if it were a PSYKER.\n- Add 1 to Deny the Witch tests takes for the bearer.",
      },
      "Abilities§Target lock": {},
      "Abilities§Target Lock": {
        text: "Each time the bearer makes a ranged attack, the target does not receive the benefits of Light Cover against that attack.",
      },
      "Abilities§Target Sighted": {
        text: "In your Command phase, select one friendly <SEPT> FIRE WARRIOR TEAM unit within 9\" of this unit's CADRE FIREBLADE model, until the start of your next Command phase, each time a CORE model in that unit makes a ranged attack, re-roll a hit roll of 1.",
      },
      "Abilities§Target Uploaded": {
        text: "This unit can start the Fire Markerlights action at the end of your Movement phase, instead of the start.",
      },
      "Abilities§Targeting Array": {},
      "Abilities§Targeting Array (Hammerhead)": {
        text: "Each time this unit's HAMMERHEAD model is selected to shoot, you can re-roll one hit roll when resolving the attacks.",
      },
      "Abilities§Targeting Array (Sky Ray)": {
        text: "Each time this unit's SKY RAY GUNSHIP model is selected to shoot, you can re-roll one hit roll when resolving the attacks.",
      },
      "Abilities§Terrain Feature (Defence Platform)": {
        text: "After it is set up, this unit's Tidewall Defence Platform (if any) is a Building terrain feature, as described in the Warhammer 40,000 Core Rules.",
      },
      "Abilities§Terrain Feature (Droneport)": {
        text: "When it is set up, this unit's Tideawll Droneport is a Building terrain feature, as described in the Warhammer 40,000 Core Book.",
      },
      "Abilities§Terrain Feature (Shieldline)": {
        text: "After it is set up, this unit's Tidewall Shieldline is a Building terrain feature, as described in the Warhammer 40,000 Core Rules.",
      },
      "Abilities§The Be'gel Hunter's Plate": {
        text: "- Add 1 to armour saving throws made for the bearer.\n- Each time the bearer would lose a wound, roll one D6, on a 5+, that wound is not lost.",
      },
      "Abilities§The Humble Stave": {
        text: "- In your Command phase, if the bearer is on the battlefield, it can intone one additional invocation it knows from the Invocations of the Ethereals (pg 76) that has not already been intoned by a friendly model that turn.\n- Each time the bearer intones an Invocation, add 1 to the roll to see if it is inspiring.",
      },
      "Abilities§The Kindled Blade": {
        text: "CADRE FIREBLADE model only. Once per battle, in your Command phase, the bearer can use this Relic. If it does, until the start of your next Command phase, the bearer can use this Relic. If it does, until the start of your next Command phase, it gains the following ability:\n\n'Bonding Ritual (Aura): While a friendly <SEPT> FIRE WARRIOR TEAM unit is within 6\" of this model, that unit automatically passes Morale tests.'",
      },
      "Abilities§The Shaper Commands (Aura)": {
        text: 'While a friendly KROOT unit is within 6" of this model, each time a model in that unit makes an attack, re-roll a hit roll of 1.',
      },
      "Abilities§Thermoneutronic Projector": {
        text: "COMMANDER or CRISIS model with one or more T'au flamers only. This Prototype System replaces one T'au flamer.",
      },
      "Abilities§Threat Identification Protocol": {
        text: "Each time this model makes a ranged attack, it can only target the closest eligible unit.",
      },
      "Abilities§Tidewall Field": {
        text: "This TRANSPORT has a 5+ invulnerable save.",
      },
      "Abilities§Titanic": {
        text: "This model is eligible to declare a charge in a turn in which it Fell Back. Each time this model makes a Normal Move, Advances or Falls Back, it can be moved across other models (excluding MONSTER and VEHICLE models) as if they were not there, and when it does it can be moved within Engagement Range of such models, but cannot finish its move within Engagement Range of any of them.",
      },
      "Abilities§Unifying Influence": {
        text: "This WARLORD gains the following abilities:\n\nDiplomatic Excellence (Aura): While a friendly DAL'YTH or T'AU AUXILIARY unit (excluding CHARACTER units) is within 6\" of this WARLORD, add 1 to the Leadership characteristic of models in that unit.\n\nIntegrated Command Structure (Aura): While a friendly T'AU AUXILIARY unit is within 6\" of this WARLORD, that unit is treated as not having the T'AU AUXILIARY keyword for the purpose of the Markerlights rule (pg 93).",
      },
      "Abilities§Vanguard": {
        text: 'At the start of the first battle round, this model can make a Normal Move of up to 7". They cannot end this move within 9" of any enemy models.',
      },
      "Abilities§Vectored Manoeuvring Thrusters": {
        text: "BATTLESUIT model only.\n\n- Add 2\" to the bearer's Move characteristic.\n- Once per battle round, when the bearer is selected as a target of a charge, if it is not within Engagement Range of any enemy units it can use this Relic. If it does, it can make a Normal Move. Until the end of the phase, the bearer cannot fire Overwatch, or Set to Defend. Your opponent can select new targets for the charge.",
      },
      "Abilities§Velocity Tracker": {
        text: "Each time a ranged attack is made by the bearer against a unit that can FLY, add 1 to that attack's hit roll. Maximum 1 per model.",
      },
      "Abilities§Vengeance": {
        text: "Each time this model makes an attack against an ASTRA MILITARUM unit, re-roll a hit roll of 1.",
      },
      "Abilities§Vior'la Sept Tenet: Strike Fast": {
        text: '- At the start of your first turn, for each unit from your army that is wholly within your deployment zone, until the end of the turn, add 2" to the Move characteristic of models in that unit.\n- You can re-roll Advance rolls and charge rolls made for units with this tenet.',
      },
      "Abilities§Volley Fire (Aura)": {
        text: "While a friendly <SEPT> CORE unit is within 6\" of this unit's CADRE FIREBLADE model, each time a CORE model in that unit makes an attack with a pulse weapon (pg 130), an unmodified hit roll of 6 scores one additional hit.",
      },
      "Abilities§Voracious Predators": {
        text: "You can re-roll Advance rolls and charge rolls made for this unit.",
      },
      "Abilities§Walking Battleship": {
        text: "This model is eligible to declare a charge in a turn in which it Fell Back. Each time this model makes a Normal Move, Advances or Fells Back, it can be moved across other models (excluding MONSTER and VEHICLE models) as if they were not there.",
      },
      "Abilities§Way of the Short Blade": {
        text: "At the start of the Fight phase, you can select one friendly FARSIGHT ENCLAVES CORE unit within 6\" of this model, until the end of the phase, each time a CORE model in that unit makes an attack, add 1 to that attack's hit roll.",
      },
      "Abilities§Wide-Spectrum Scanners": {
        text: "Model equipped with early warning override only. At the end of the Reinforcements step of your opponent's Movement phase, if the bearer is not within Engagement Range of any enemy units, it can shoot as if it were your Shooting phase, but it can only target a single eligible enemy unit that was set up as Reinforcements this turn that is within 12\" of the bearer.",
      },
      "Abilities§Wisest of Their Kind (Aura)": {
        text: "While a friendly KROOT unit is within 6\" of this model, models in that unit can use this model's Leadership characteristic instead of their own.",
      },
      "Abilities§Wrecked (Tidewall)": {
        text: 'When this Building is destroyed, roll one D6 before any embarked models disembark and before removing it from play. On a 6 it explodes, and each unit within 6" suffers D3 mortal wounds. On any other result, this Building is rewcked, through the model counts as destroyed for all rules purposes, do not remove it from the battlefield. Instead, for the remainder of the battle, it is treated as an Obstacle terrain feature with the following terrain traits, as described in the Warhammer 40,000 Core Rules:\n- Difficult Ground\n- Exposed Position\n- Unstable Position',
      },
      "Abilities§XV02 Pilot Battlesuit": {
        text: "In your Command phase, you can select one other friendly T'AU SEPT CORE or T'AU SEPT HAMMERHEAD unit within 6\" of this unit's HAMMERHEAD model. Until the start of your next Command phase, each time a model in that unit makes an attack, that target is treated as having a Markerlight token (pg 93).",
      },
      "Abilities§XV22 Stalker Battlesuit": {
        text: "This unit's COMMANDER SHADOWSUN model has a 5+ invulnerable save.",
      },
      "Abilities§Y'vahra Shield Generator": {
        text: "This model has a 5+ invulnerable save.",
      },
      "Invocations§1. Storm of Fire": {
        stats: {
          "-": {
            value:
              "If this invocation is inspiring, select one friendly T'AU EMPIRE CORE unit (excluding FARSIGHT ENCLAVES units) within 6\" of this ETHEREAL. That unit can make ranged attacks without any actions it is performing failing.",
          },
        },
      },
      "Invocations§2. Sense of Stone": {
        stats: {
          "-": {
            value:
              "If this invocation is inspiring, select one friendly T'AU EMPIRE CORE unit (excluding FARSIGHT ENCLAVES units) within 6\" of this ETHEREAL. Each time a CORE  model in that unit would lose a wound, roll one D6: on a 5+, that wound is not lost.",
          },
        },
      },
      "Invocations§3. Zephyr's Grace": {
        stats: {
          "-": {
            value:
              "If this invocation is inspiring, select one friendly T'AU EMPIRE CORE unit (excluding FARSIGHT ENCLAVES units) within 6\" of this ETHEREAL. Each time a ranged attack is made against that unit, if it did not Remain Stationary in your previous Movement phase, subtract 1 from that attack's hit roll.",
          },
        },
      },
      "Invocations§4. Power of Tides": {
        stats: {
          "-": {
            value:
              "If this invocation is inspiring, select one friendly T'AU AUXILIARY unit within 6\" of this ETHEREAL. Each time a model in that unit makes an attack, add 1 to that attack's wound roll.",
          },
        },
      },
      "Invocations§5. Unifying Mantra (Aura)": {
        stats: {
          "-": {
            value:
              "If this invocation is inspiring, then while a friendly T'AU EMPIRE CORE unit (excluding FARSIGHT ENCLAVES units) is within 6\" of this ETHEREAL:\n\n- You can re-roll Morale tests taken for that unit.\n- Add 1 to Combat Attrition tests taken for that unit.",
          },
        },
      },
      "Invocations§6. Wisdom of the Guides": {
        stats: {
          "-": {
            value: "If this invocation is inspiring, you gain 1 Command point.",
          },
        },
      },
      "Model§Advanced Guardian Drone": {
        keywords: {
          Keywords: ["Drone", "New CategoryLink", "Advanced Guardian Drone"],
          Faction: ["T'au Empire", "<Sept>"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Aun'Shi": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Ethereal", "Aun'Shi"],
          Faction: ["T'au Empire", "Vior'la Sept"],
        },
        stats: {
          " PL": {
            value: 5,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 105,
          },
        },
      },
      "Model§Aun'Va": {
        keywords: {
          Keywords: ["Infantry", "Character", "Ethereal", "Aun'Va"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§AX-1-0 Tiger Shark": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "AX-1-0 Tiger Shark", "Aircraft"],
        },
        stats: {
          " PL": {
            value: 24,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 450,
          },
        },
      },
      "Model§AX-5-2 Barracuda": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "AX-5-2 Barracuda", "Aircraft"],
        },
        stats: {
          " PL": {
            value: 13,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 200,
          },
        },
      },
      "Model§Blacklight Marker Drone": {
        keywords: {
          Keywords: ["Drone", "New CategoryLink", "Markerlight"],
          Faction: ["Ke'lshan", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Breacher Fire Warrior": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Breacher Fire Warrior Shas'ui": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Cadre Fireblade": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Cadre Fireblade", "Photon Grenades"],
        },
        stats: {
          " PL": {
            value: 3,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 50,
          },
        },
      },
      "Model§Command-link Drone": {
        keywords: {
          Keywords: ["Drone", "New CategoryLink", "Command-link Drone"],
          Faction: ["T'au Empire", "<Sept>"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Commander Farsight": {
        keywords: {
          Keywords: [
            "Battlesuit",
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "Jet Pack",
            "Commander",
            "Farsight",
            "Infantry",
          ],
          Faction: ["Farsight Enclaves", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 7,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 130,
          },
        },
      },
      "Model§Commander in Coldstar Battlesuit": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "Battlesuit",
            "New CategoryLink",
            "New CategoryLink",
            "Jet Pack",
            "New CategoryLink",
            "Coldstar",
            "Commander",
            "Infantry",
          ],
        },
        stats: {
          " PL": {
            value: 7,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 110,
          },
        },
      },
      "Model§Commander in Crisis Battlesuit": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "Battlesuit",
            "New CategoryLink",
            "New CategoryLink",
            "Jet Pack",
            "New CategoryLink",
            "Commander",
            "Crisis",
            "Infantry",
          ],
        },
        stats: {
          " PL": {
            value: 7,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 100,
          },
        },
      },
      "Model§Commander in Enforcer Battlesuit": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "Battlesuit",
            "New CategoryLink",
            "New CategoryLink",
            "Jet Pack",
            "New CategoryLink",
            "Commander",
            "Enforcer",
            "Infantry",
          ],
        },
        stats: {
          " PL": {
            value: 8,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 120,
          },
        },
      },
      "Model§Commander Shadowsun": {
        keywords: {
          Keywords: [
            "Battlesuit",
            "New CategoryLink",
            "Jet Pack",
            "New CategoryLink",
            "Commander",
            "Shadowsun",
            "Supreme Commander",
            "Infantry",
          ],
          Faction: ["T'au Sept", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 8,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 150,
          },
        },
      },
      "Model§Dahyak Grekh": {
        keywords: {
          Faction: ["T'au Empire", "Kroot"],
          Keywords: ["Character", "Infantry", "Kroot Tracker", "New CategoryLink"],
        },
        stats: {
          " PL": {
            value: 2,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 40,
          },
        },
      },
      "Model§Darkstrider": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Darkstrider", "Photon Grenades"],
          Faction: ["T'au Empire", "T'au Sept"],
        },
        stats: {
          " PL": {
            value: 3,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 60,
          },
        },
      },
      "Model§Devilfish": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "New CategoryLink", "Devilfish"],
        },
        stats: {
          " PL": {
            value: 6,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 95,
          },
        },
      },
      "Model§DX-6 Remora Stealth Drone": {
        keywords: {
          Keywords: ["Aircraft", "DX-6 Remora Stealth Drones", "Drone", "Fly", "Markerlight"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 3,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 60,
          },
        },
      },
      "Model§DX4 Technical Drone": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 20,
          },
        },
      },
      "Model§Ethereal": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Ethereal"],
        },
        stats: {
          " PL": {
            value: 3,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 80,
          },
        },
      },
      "Model§Ethereal Guard": {
        keywords: {
          Keywords: ["Infantry", "Ethereal Guard"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Firesight Marksman": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Firesight Marksman"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 3,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 70,
          },
        },
      },
      "Model§Ghostkeel Battlesuit": {
        keywords: {
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "Battlesuit",
            "Jet Pack",
            "Ghostkeel Battlesuit",
            "Vehicle",
          ],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 9,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 160,
          },
        },
      },
      "Model§Grav-inhibitor Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "Drone", "Grav-Inhibitor Drone"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Great Knarloc [Legends]": {
        keywords: {
          Faction: ["T'au Empire"],
          Keywords: ["Great Knarloc", "New CategoryLink", "New CategoryLink"],
        },
        stats: {
          " PL": {
            value: 4,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 65,
          },
        },
      },
      "Model§Guardian Drone": {
        keywords: {
          Keywords: ["Drone", "New CategoryLink", "Guardian Drone"],
          Faction: ["T'au Empire", "<Sept>"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Gun Drone": {
        keywords: {
          Keywords: ["Drone", "New CategoryLink", "Gun Drone"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Hammerhead Gunship": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Hammerhead Gunship", "Hammerhead"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 8,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 145,
          },
        },
      },
      "Model§Interceptor Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "Interceptor Drone"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Kroot": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 6,
          },
        },
      },
      "Model§Kroot Hound": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 6,
          },
        },
      },
      "Model§Kroot Shaper": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "Kroot Shaper", "T'au Auxiliary"],
          Faction: ["Kroot"],
        },
        stats: {
          " PL": {
            value: 2,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 25,
          },
        },
      },
      "Model§Krootox Rider": {
        stats: {
          " PL": {
            value: 2,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 25,
          },
        },
      },
      "Model§KX139 Ta'unar Supremacy Armour": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "KX139 Ta'unar Supremacy Armour", "Vehicle"],
        },
        stats: {
          " PL": {
            value: 50,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 1000,
          },
        },
      },
      "Model§Longstrike": {
        keywords: {
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "Longstrike",
            "Hammerhead",
          ],
          Faction: ["T'au Empire", "T'au Sept"],
        },
        stats: {
          " PL": {
            value: 9,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 160,
          },
        },
      },
      "Model§Manta": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "Manta",
            "Aircraft",
          ],
        },
        stats: {
          " PL": {
            value: 100,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 2000,
          },
        },
      },
      "Model§Marker Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "Marker Drone"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Missile Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "Missile Drone"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Orca Dropship [Legends]": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "Orca Dropship",
            "Aircraft",
            "New CategoryLink",
          ],
        },
        stats: {
          " PL": {
            value: 15,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 300,
          },
        },
      },
      "Model§Pulse Accelerator Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "Pulse Accelerator Drone"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Razorshark Strike Fighter": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "Razorshark Strike Fighter",
            "Aircraft",
          ],
        },
        stats: {
          " PL": {
            value: 8,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 155,
          },
        },
      },
      "Model§Recon Drone": {
        keywords: {
          Keywords: ["Recon Drone", "Fly", "Drone"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Remote Sensor Tower [Legends]": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "Remote Sensor Tower", "Building", "Vehicle"],
        },
        stats: {
          " PL": {
            value: 2,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 40,
          },
        },
      },
      "Model§Riptide Battlesuit": {
        keywords: {
          Keywords: ["New CategoryLink", "Battlesuit", "Jet Pack", "Riptide Battlesuit", "Vehicle", "New CategoryLink"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 13,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 240,
          },
        },
      },
      "Model§Shas'o R'alai": {
        keywords: {
          Keywords: [
            "New CategoryLink",
            "Battlesuit",
            "New CategoryLink",
            "Jet Pack",
            "New CategoryLink",
            "Commander",
            "Shas'o R'alai",
            "Infantry",
          ],
          Faction: ["T'au Empire", "Ke'lshan"],
        },
        stats: {
          " PL": {
            value: 5,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 100,
          },
        },
      },
      "Model§Shas'o R'myr [Legends]": {
        keywords: {
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "Jet Pack",
            "New CategoryLink",
            "Commander",
            "Shas'o R'myr",
            "Infantry",
          ],
          Faction: ["T'au Empire", "<Sept>"],
        },
        stats: {
          " PL": {
            value: 6,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 110,
          },
        },
      },
      "Model§Shield Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "Drone", "Shield Drone"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Shielded Missile Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "Shielded Missile Drone"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Sky Ray Gunship": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Sky Ray Gunship"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 7,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 135,
          },
        },
      },
      "Model§Sniper Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "Sniper Drones"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Stealth Drone": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "Stealth Drone"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Model§Stormsurge": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Stormsurge"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 17,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 400,
          },
        },
      },
      "Model§Sun Shark Bomber": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Sun Shark Bomber", "Aircraft"],
        },
        stats: {
          " PL": {
            value: 9,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 165,
          },
        },
      },
      "Model§Tidewall Defence Platform": {
        keywords: {
          Keywords: ["Terrain", "Building", "Vehicle", "Transport", "Tidewall", "Defence Platform"],
        },
        stats: {
          " PL": {
            value: 4,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 80,
          },
        },
      },
      "Model§Tidewall Droneport": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "New CategoryLink", "Droneport"],
        },
        stats: {
          " PL": {
            value: 6,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 80,
          },
        },
      },
      "Model§Tidewall Gunrig": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "Gunrig",
            "Tidewall",
          ],
        },
        stats: {
          " PL": {
            value: 7,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 125,
          },
        },
      },
      "Model§Tidewall Shieldline": {
        keywords: {
          Keywords: ["Terrain", "Building", "Vehicle", "Transport", "Tidewall", "Shieldline"],
        },
        stats: {
          " PL": {
            value: 4,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 80,
          },
        },
      },
      "Model§Tiger Shark": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Tiger Shark", "Aircraft"],
        },
        stats: {
          " PL": {
            value: 22,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 375,
          },
        },
      },
      "Model§XV107 R'varna Battlesuit": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Battlesuit", "XV107 R'varna Battlesuit", "New CategoryLink", "Vehicle"],
        },
        stats: {
          " PL": {
            value: 18,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 320,
          },
        },
      },
      "Model§XV109 Y'vahra Battlesuit": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "New CategoryLink",
            "Battlesuit",
            "Jet Pack",
            "New CategoryLink",
            "XV109 Y'vahra Battlesuit",
            "Vehicle",
          ],
        },
        stats: {
          " PL": {
            value: 17,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 300,
          },
        },
      },
      "Profile§Dahyak Grekh": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "3+",
          },
          Ld: {
            value: 7,
          },
          M: {
            value: '7"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "6+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 3,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Profile§Defensive charge": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 1",
          },
        },
      },
      "Profile§Experimental pulse submunitions rifle (EMP)": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 1,
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time an attack is made with this weapon against a VEHICLE unit, on a successful hit roll, the target suffers 3 mortal wounds and the attack sequence ends.",
      },
      'Profile§Explodes (2D6" / D6)': {},
      "Profile§Great Knarloc Beak and Talons": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 3,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Profile§Kroot pistol": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Pistol 1",
          },
        },
      },
      "Profile§Miniaturised fletchette pod": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 3,
          },
          Type: {
            value: "Pistol 4",
          },
        },
      },
      "Roster§Roster": {
        classification: "Roster",
      },
      "Rule§Airborne": {},
      "Rule§Ambushing Predators": {
        text: 'At the start of the first battle round, models in this unit can make a Normal move of up to 7". They cannot end this move within 9" of any enemy models.',
      },
      "Rule§Artificial Helpers": {
        text: "DRONE models are ignored for the purposes of:\n\n- The Look Out, Sir rule.\n- Determining this unit's Starting Strength, and whether this unit is below Half strength.\n- Determining this unit's toughness characteristic, if it also contains models without the DRONE keyword.",
      },
      "Rule§Battlesuits": {
        text: "BATTLESUIT models in this unit can make attacks with ranged weapons even when their unit is within Engagement Range of enemy units, but they can only make such attacks against enemy units that they are within Engagement Range of. In such circumstances, these models can target an enemy unit even if other friendly units are within Engagement Range of the same enemy unit.\n\nNote that if a BATTLESUIT model has more than one ranged weapon, you can still choose to target units that are not within Engagement Range of its unit, but it will only be able to make the attacks with that weapon if all enemy units within Engagement Range of its unit have been destroyed when you come to resolve these attacks. In addition, when a BATTLESUIT model shoots a Heavy weapon, subtract 1 from the hit rolls when resolving that weapon's attacks while any enemy units are within Engagement Range of that model's unit.",
      },
      "Rule§Docked Drones": {
        text: "If this model is docked with another:\n\n- Any weapons this model is equipped with are considered to be equipped to the model it is docked with instead.\n- Attacks cannot be allocated to this model and it does not count as a model on the battlefield for any rules purposes.\n- If the model it is docked with is destroyed, this DRONE model is destroyed as well.",
      },
      "Rule§Hard to Hit": {},
      "Rule§Inspired to Greatness": {
        text: "In your Command phase, select one friendly T'AU EMPIRE CORE or T'AU AUXILIARY unit within 6\" of this unit's ETHEREAL model (excluding FARSIGHT ENCLAVES units). Until the start of your next Command phase, while that unit is performing an action, it can make ranged attacks without that action failing.",
      },
      "Rule§Limited Parameters": {
        text: "If this unit contains only DRONE models, this unit cannot perform actions (excluding the Fire Markerlights action, page 93) and loses the Objective Secured ability if it has it, and cannot gain it through any means.",
      },
      "Rule§Manta Strike": {
        text: 'During deployment, if every model in this unit has this ability, you can set up this unit in a Manta hold instead of setting it up\non the battlefield. If you do, then in the Reinforcements step of one of your Movement phases you can set up this unit anywhere on the battlefield that is more than 9" away from any enemy models.',
      },
      "Rule§Markerlights": {
        text: "Units in your army can perform the following action:\n\n'Fire Markerlights (Action): One or more MARKERLIGHT units from your army can start to perform this action at the start of your Movement phase. AIRCRAFT MARKERLIGHT units can perform this action. The action is completed at the start of your next Shooting phase. If this action is successfully completed, for each model in that unit that is equipped with one or more markerlights, for each markerlight that model is equipped with, select one enemy unit within 36\" of that model that would be an eligible target for that model if its unit had been selected to shoot, and roll one D6: on a 3+, that enemy unit gains one Markerlight token.'\n\nWhile a VEHICLE or DRONE unit is performing the Fire Markerlights action, that unit can move without the action failing. If it does, until the end of the turn, models in that unit without the VEHICLE or DRONE keyword that are equipped with any markerlights are treated as not having been equipped with markerlights for the purpose of the Fire Markerlights action.\n\nEach time a T'AU EMPIRE unit (excluding T'AU AUXILIARY units) is selected to shoot:\n\n- Each time a model in that unit makes a ranged attack against a unit with one or more Markerlight tokens, add 1 to that attack's hit roll.\n- After that unit has finished making attacks, for each enemy unit targeted by these attacks, remove one Markerlight token from that enemy unit.\n\nAt the end of your Shooting phase, remove all Markerlight tokens from enemy units.",
      },
      "Rule§Sept Tenets": {
        text: "If every unit from your army (excluding T'AU AUXILIARY, SUPREME COMMANDER and UNALIGNED units) is from the same sept, all T'AU EMPIRE units with this ability, and all models in them, gain a Sept Tenet. The Sept Tenet gained depends on which sept they are from, as shown on the following pages.\n\nIf your sept does not have an associated Sept Tenet, you must instead create a new Sept Tenet for them, as described on pages 62-63. This allows you to customize the rules for your sept to best represent their fighting style.\n\nIn either case, write down all of your Detachments' Sept Tenets on your army roster.",
      },
      "Rule§Valued Sacrifice": {
        text: "Each time a DRONE model in this unit is destroyed, it is ignored for the purposes of Morale tests if this unit contains models without the DRONE keyword.",
      },
      "SelectionEntry§Hide Legends Units": {},
      "SelectionEntryGroup§Character Stratagems": {},
      "SelectionEntryGroup§Character Stratagems (Named)": {},
      "SelectionEntryGroup§Commander Wargear - Slot 1": {},
      "SelectionEntryGroup§Commander Wargear - Slot 2": {},
      "SelectionEntryGroup§Commander Wargear - Slot 3": {},
      "SelectionEntryGroup§Commander Wargear - Slot 4": {},
      "SelectionEntryGroup§Drones": {},
      "SelectionEntryGroup§Fire Warrior Drones": {},
      "SelectionEntryGroup§Gunship Sponsons": {},
      "SelectionEntryGroup§Hammerhead Main Weapon": {},
      "SelectionEntryGroup§Invocations of the Ethereals": {},
      "SelectionEntryGroup§Prototype Systems": {},
      "SelectionEntryGroup§Prototype Weapons Systems": {},
      "SelectionEntryGroup§Relics & Signature Systems": {},
      "SelectionEntryGroup§Signature Systems": {},
      "SelectionEntryGroup§Support Systems": {},
      "SelectionEntryGroup§Tactical Drones": {},
      "SelectionEntryGroup§Warlord Traits": {},
      "SelectionEntryGroup§Warlord Traits (Named)": {},
      "Transport§Devilfish (Transport)": {
        stats: {
          Capacity: {
            value:
              "This model has a transport capacity of 12 <SEPT> INFANTRY or <SEPT> DRONE models and 1 <SEPT> RECON DRONE model. It cannot transport BATTLESUIT models.",
          },
        },
      },
      "Transport§Manta (Transport)": {
        stats: {
          Capacity: {
            value:
              "This model has a transport capacity as follows:\n- 200 <SEPT> INFANTRY or <SEPT> DRONE models.\n- 4 <SEPT> DEVILFISH, <SEPT> SKY RAY GUNSHIP or <SEPT> HAMMERHEAD models.\n- 8 BATTLESUIT models with a Wounds characteristic of 9 or less.\n\nAny models embarked within another model when it embarks upon this model do not count towards this model's transport capacity. While a model is embarked upon this model, models embarked within that other model may not disembark. Models may not disembark from a model in a turn in which it disembarks from this model.",
          },
        },
      },
      "Transport§Orca Dropship (Transport)": {
        stats: {
          Capacity: {
            value:
              "This model has a transport capacity as follows:\n- 24 T'AU EMPIRE INFANTRY models\n- 8 T'AU EMPIRE DRONES models\n- One of the following: 6 BATTLESUIT models with a Wounds characteristic of 9 or less (each XV88 BROADSIDE BATTLESUIT model takes the space of 2 models); 24 more T'AU EMPIRE INFANTRY or T'AU EMPIRE DRONES models.",
          },
        },
      },
      "Transport§Tidewall": {
        stats: {
          Capacity: {
            value:
              "Each Building has a transport capacity of 10 INFANTRY models. Each model with a wounds characteristic of 3 takes up the space of 2 models. It cannot transport models with a Wounds characteristic of 4 or more. No more than two units can be embarked within this building.",
          },
        },
      },
      "Transport§Tidewall (Transport)": {
        stats: {
          Capacity: {
            value:
              "This model can transport any number of T'AU EMPIRE INFANTRY CHARACTERS and one other T'AU EMPIRE INFANTRY unit, but no more than 10 models in total.",
          },
        },
      },
      "Transport§Tidewall Shieldline": {},
      "Transport§Tiger Shark (Transport)": {
        stats: {
          Capacity: {
            value: "This model has a transport capacity of 14 <SEPT> TACTICAL DRONES models.",
          },
        },
      },
      "Unit§Advanced Guardian Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Aun'Shi": {
        stats: {
          A: {
            value: 5,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "7+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 5,
          },
          WS: {
            value: "2+",
          },
        },
      },
      "Unit§Aun'Va": {
        keywords: {
          Keywords: ["New CategoryLink"],
          Faction: ["T'au Empire", "T'au Sept"],
        },
        stats: {
          " PL": {
            value: 4,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 100,
          },
        },
      },
      "Unit§Aun'va": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 2,
          },
          Save: {
            value: "5+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 6,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§AX-1-0 Tiger Shark [1] (10-18+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-65"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: 18,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§AX-1-0 Tiger Shark [2] (5-9 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-45"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§AX-1-0 Tiger Shark [3] (1-4 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "6+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-30"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§AX-5-2 Barracuda [1] (8-14+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-65"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 14,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§AX-5-2 Barracuda [2] (4-7 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-45"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§AX-5-2 Barracuda [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-30"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§AX3 Razorshark Strike Fighter [1] (7-12+ Wounds Remaining)": {},
      "Unit§AX39 Sun Shark Bomber [2] (4-6 Wounds Remaining)": {},
      "Unit§AX39 Sun Shark Bomber [3] (1-3 Wounds Remaining)": {},
      "Unit§Blacklight Marker Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Breacher Team": {
        keywords: {
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "Breacher Team",
            "Core",
            "Photon Grenades",
            "Fire Warrior Team",
          ],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 5,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 85,
          },
        },
      },
      "Unit§Broadside Battlesuits": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Battlesuit", "New CategoryLink", "Broadside Battlesuits", "Infantry"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Broadside Shas'ui": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '5"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 8,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Broadside Shas'vre": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '5"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 8,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Cadre Fireblade": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "3+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "4+",
          },
        },
      },
      "Unit§Command-link Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Commander Farsight": {
        stats: {
          A: {
            value: 5,
          },
          BS: {
            value: "2+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 7,
          },
          WS: {
            value: "2+",
          },
        },
      },
      "Unit§Commander in Coldstar Battlesuit": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "2+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '14"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 7,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Commander in Crisis Battlesuit": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "2+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 6,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Commander in Enforcer Battlesuit": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "2+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 7,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Commander Shadowsun": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "2+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 7,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Crisis Battlesuits": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Battlesuit", "New CategoryLink", "New CategoryLink", "Jet Pack", "Infantry", "Core", "Crisis"],
        },
        stats: {
          " PL": {
            value: 9,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Crisis Bodyguard Shas'ui": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Crisis Bodyguard Shas'vre": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Crisis Bodyguards": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Battlesuit", "New CategoryLink", "Jet Pack", "Crisis Bodyguards", "Core", "Crisis", "Infantry"],
        },
        stats: {
          " PL": {
            value: 6,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Crisis Shas'ui": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Crisis Shas'vre": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Darkstrider": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "2+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '7"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 5,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Devilfish [1] (7-13+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 13,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Devilfish [2] (4-6 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Devilfish [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "6+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '4"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Drone Sentry Turret": {
        stats: {
          A: {
            value: "-",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: "-",
          },
          M: {
            value: "-",
          },
          S: {
            value: "-",
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 3,
          },
          WS: {
            value: "-",
          },
        },
      },
      "Unit§Drone Sentry Turrets [Legends]": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "Drone", "New CategoryLink", "Drone Sentry Turret", "Building"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§DX-6 Remora Stealth Drone": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '15"-30"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 5,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§DX-6 Remora Stealth Drones": {
        keywords: {
          Keywords: ["New CategoryLink"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§DX4 Technical Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 2,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§DX4 Technical Drones [Legends]": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "New CategoryLink", "DX5 Technical Drones"],
        },
        stats: {
          " PL": {
            value: 2,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§DX6 'Remora' Stealth Drone": {},
      "Unit§Ethereal": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "5+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Ethereal Guard": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "3+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "5+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 2,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Fire Warrior": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 7,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Fire Warrior Shas'ui": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Firesight Marksman": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "3+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 3,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Grav-inhibitor Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Great Knarloc": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '7"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 9,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Guardian Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Gun Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Hammerhead Gunship [1] (8-14+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 14,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Hammerhead Gunship [2] (4-7 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Hammerhead Gunship [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "6+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '4"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Hazard Battlesuit": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Heavy Gun Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 2,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Heavy Gun Drones [Legends]": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["Drone", "New CategoryLink", "New CategoryLink", "Heavy Gun Drones"],
        },
        stats: {
          " PL": {
            value: 3,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Interceptor Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '20"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Knarloc Riders [Legends]": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "Knarloc Riders"],
          Faction: ["T'au Empire"],
        },
        stats: {
          " PL": {
            value: 4,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Kroot": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '7"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "6+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Kroot Carnivores": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "Kroot Carnivores", "T'au Auxiliary"],
          Faction: ["T'au Empire", "Kroot"],
        },
        stats: {
          " PL": {
            value: 3,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Kroot Hound": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "-",
          },
          Ld: {
            value: 5,
          },
          M: {
            value: '12"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "6+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Kroot Hounds": {
        keywords: {
          Faction: ["T'au Empire", "Kroot"],
          Keywords: ["Kroot Hounds", "Beasts", "T'au Auxiliary"],
        },
        stats: {
          " PL": {
            value: 1,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Kroot Shaper": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '7"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "6+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "2+",
          },
        },
      },
      "Unit§Krootox Rider": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '7"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "6+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Krootox Riders": {
        keywords: {
          Faction: ["T'au Empire", "Kroot"],
          Keywords: ["New CategoryLink", "Krootox Riders", "T'au Auxiliary"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§KV128 Stormsurge [1] (11-20+ Wounds Remaining)": {},
      "Unit§KV128 Stormsurge [2] (6-10 Wounds Remaining)": {},
      "Unit§Longstrike [1] (7-13+ Wounds Remaining)": {},
      "Unit§Longstrike [1] (8-14+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "3+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 14,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Longstrike [2] (4-6 Wounds Remaining)": {},
      "Unit§Longstrike [2] (4-7 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Longstrike [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '4"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Manta [1] (46-60+ Wounds Remaining)": {
        stats: {
          A: {
            value: 12,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '20"-60"',
          },
          S: {
            value: 8,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: 60,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Manta [2] (31-45 Wounds Remaining)": {
        stats: {
          A: {
            value: 9,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '20"-50"',
          },
          S: {
            value: 8,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Manta [3] (16-30 Wounds Remaining)": {
        stats: {
          A: {
            value: 6,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '20"-40"',
          },
          S: {
            value: 8,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Manta [4] (1-15 Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '20"-30"',
          },
          S: {
            value: 8,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Marker Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§MB3 Recon Drone": {},
      "Unit§Missile Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§MV17 Interceptor Drone": {},
      "Unit§MV31 Pulse Accelerator Drone": {},
      "Unit§MV8 Missile Drone": {},
      "Unit§MV84 Shielded Missile Drone": {},
      "Unit§New InfoLink": {},
      "Unit§Orca Dropship [1] (8-28+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 7,
          },
          M: {
            value: '20"-55"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: 28,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Orca Dropship [2] (4-7 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 7,
          },
          M: {
            value: '20"-40"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Orca Dropship [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "6+",
          },
          Ld: {
            value: 7,
          },
          M: {
            value: '20"-25"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Pathfinder": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 7,
          },
          M: {
            value: '7"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "5+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Pathfinder Shas'ui": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '7"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "5+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Pathfinder Team": {
        keywords: {
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "Pathfinder Team",
            "Core",
            "Fire Warrior Team",
            "Photon Grenades",
          ],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 5,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 90,
          },
        },
      },
      "Unit§Piranha": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 7,
          },
          M: {
            value: '16"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 7,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Piranhas": {
        keywords: {
          Keywords: ["New CategoryLink", "Vehicle", "Fly", "Piranhas"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Pulse Accelerator Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Razorshark Strike Fighter [1] (7-12+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-50"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 12,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Razorshark Strike Fighter [2] (4-6 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-30"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Razorshark Strike Fighter [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-25"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Recon Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 3,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Remote Sensor Tower": {
        stats: {
          A: {
            value: "-",
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: "-",
          },
          M: {
            value: "-",
          },
          S: {
            value: "-",
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 3,
          },
          WS: {
            value: "-",
          },
        },
      },
      "Unit§Riptide Battlesuit [1] (7-14+ Wounds Remaining)": {},
      "Unit§Riptide Battlesuit [1] (8-14+ Wounds Remaining)": {
        stats: {
          A: {
            value: 6,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 14,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Riptide Battlesuit [2] (5-7 Wounds Remaining)": {
        stats: {
          A: {
            value: 5,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Riptide Battlesuit [3] (1-3 Wounds Remaining)": {},
      "Unit§Riptide Battlesuit [3] (1-4 Wounds Remaining)": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "6+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '4"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Shas'o R'alai": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "2+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 7,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Shas'o R'myr": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "2+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 5,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 5,
          },
          WS: {
            value: "3+",
          },
        },
      },
      "Unit§Shield Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 2,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Shielded Missile Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 2,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Sky Ray Gunship [1] (8-14+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 14,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Sky Ray Gunship [2] (4-7 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Sky Ray Gunship [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "6+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '4"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Sniper Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Stealth Battlesuits": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "Battlesuit",
            "New CategoryLink",
            "New CategoryLink",
            "New CategoryLink",
            "Jet Pack",
            "Stealth Battlesuits",
            "Core",
          ],
        },
        stats: {
          " PL": {
            value: 4,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Stealth Drone": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Stealth Shas'ui": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 2,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Stealth Shas'vre": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 2,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Stormsurge [1] (12-22+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 8,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 8,
          },
          W: {
            value: 22,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Stormsurge [2] (6-11 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Stormsurge [3] (1-5 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "6+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§Strike Team": {
        keywords: {
          Keywords: [
            "New CategoryLink",
            "New CategoryLink",
            "Strike Team",
            "Photon Grenades",
            "Fire Warrior Team",
            "Core",
          ],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 4,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 80,
          },
        },
      },
      "Unit§Sun Shark Bomber [1] (7-12+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-50"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 12,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Sun Shark Bomber [2] (4-6 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-30"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Sun Shark Bomber [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-25"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Support Turret": {
        stats: {
          A: {
            value: "-",
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 4,
          },
          M: {
            value: "-",
          },
          S: {
            value: 3,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 3,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "-",
          },
        },
      },
      "Unit§Ta'unar Supremacy Armour [1] (16-30+ Wounds Remaining)": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "3+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '10"',
          },
          S: {
            value: 8,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: 30,
          },
          WS: {
            value: "4+",
          },
        },
      },
      "Unit§Ta'unar Supremacy Armour [2] (8-15 Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 8,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "4+",
          },
        },
      },
      "Unit§Ta'unar Supremacy Armour [3] (1-7 Wounds Remaining)": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 8,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "4+",
          },
        },
      },
      "Unit§Tactical Drones": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "Drone", "Tactical Drones"],
          Faction: ["<Sept>", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 2,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Tetra": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 6,
          },
          M: {
            value: '18"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 4,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Tetras": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Tetras", "Markerlight"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Tidewall Defence Platform": {
        stats: {
          A: {
            value: "-",
          },
          BS: {
            value: "-",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 10,
          },
          WS: {
            value: "-",
          },
        },
      },
      "Unit§Tidewall Droneport": {
        stats: {
          A: {
            value: "-",
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: "-",
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 10,
          },
          WS: {
            value: "-",
          },
        },
      },
      "Unit§Tidewall Gunrig": {
        stats: {
          A: {
            value: "-",
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 10,
          },
          M: {
            value: "-",
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 16,
          },
          WS: {
            value: "-",
          },
        },
      },
      "Unit§Tidewall Shieldline": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          A: {
            value: "-",
          },
          BS: {
            value: "-",
          },
          CP: {
            value: 0,
          },
          Ld: {
            value: 10,
          },
          M: {
            value: "-",
          },
          pts: {
            value: 0,
          },
          S: {
            value: 6,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 6,
          },
          W: {
            value: 10,
          },
          WS: {
            value: "-",
          },
        },
      },
      "Unit§Tiger Shark [1] (10-18+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-65"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: 18,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Tiger Shark [2] (5-9 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-45"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§Tiger Shark [3] (1-4 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '20"-30"',
          },
          S: {
            value: 7,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§TX42 Piranha": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 7,
          },
          M: {
            value: '16"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 5,
          },
          W: {
            value: 6,
          },
          WS: {
            value: "6+",
          },
        },
      },
      "Unit§TX42 Piranha [Legends]": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "TX42 Pirahna"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§TX7 Hammerhead Gunship [2] (4-6 Wounds Remaining)": {},
      "Unit§TX7 Hammerhead Gunship [3] (1-3 Wounds Remaining)": {},
      "Unit§Vespid Stingwing": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 5,
          },
          M: {
            value: '14"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "4+",
          },
        },
      },
      "Unit§Vespid Stingwings": {
        keywords: {
          Keywords: ["New CategoryLink", "New CategoryLink", "New CategoryLink", "Vespid Stingwings", "T'au Auxiliary"],
          Faction: ["Vespid", "T'au Empire"],
        },
        stats: {
          " PL": {
            value: 3,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§Vespid Strain Leader": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '14"',
          },
          S: {
            value: 4,
          },
          Save: {
            value: "4+",
          },
          T: {
            value: 4,
          },
          W: {
            value: 1,
          },
          WS: {
            value: "4+",
          },
        },
      },
      "Unit§XV104 Riptide Battlesuit [2] (4-6 Wounds Remaining)": {},
      "Unit§XV107 R'varna Battlesuit [1] (8-15+ Wounds Remaining)": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 8,
          },
          W: {
            value: 15,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§XV107 R'varna Battlesuit [2] (4-7 Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§XV107 R'varna Battlesuit [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '4"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 8,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§XV109 Y'vahra Battlesuit [1] (8-14+ Wounds Remaining)": {
        stats: {
          A: {
            value: 4,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '18"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 14,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§XV109 Y'vahra Battlesuit [2] (4-7 Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§XV109 Y'vahra Battlesuit [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 2,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 8,
          },
          M: {
            value: '6"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "2+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§XV9 Hazard Battlesuits": {
        keywords: {
          Faction: ["<Sept>", "T'au Empire"],
          Keywords: [
            "Battlesuit",
            "New CategoryLink",
            "New CategoryLink",
            "Jet Pack",
            "XV9 Hazard Battlesuits",
            "Infantry",
          ],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Unit§XV95 Ghostkeel Shas'vre [1] (6-10+ Wounds Remaining)": {},
      "Unit§XV95 Ghostkeel Shas'vre [1] (7-12+ Wounds Remaining)": {
        stats: {
          A: {
            value: 3,
          },
          BS: {
            value: "4+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: 12,
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§XV95 Ghostkeel Shas'vre [2] (3-5 Wounds Remaining)": {},
      "Unit§XV95 Ghostkeel Shas'vre [2] (4-6 Wounds Remaining)": {
        stats: {
          A: {
            value: "D3",
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '8"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Unit§XV95 Ghostkeel Shas'vre [3] (1-3 Wounds Remaining)": {
        stats: {
          A: {
            value: 1,
          },
          BS: {
            value: "5+",
          },
          Ld: {
            value: 9,
          },
          M: {
            value: '4"',
          },
          S: {
            value: 6,
          },
          Save: {
            value: "3+",
          },
          T: {
            value: 7,
          },
          W: {
            value: "N/A",
          },
          WS: {
            value: "5+",
          },
        },
      },
      "Upgrade§!2x Long-barrelled burst cannon": {},
      "Upgrade§!Markerlight": {},
      "Upgrade§!Supremacy railgun": {},
      "Upgrade§(Bork'an): Overdrive Power Systems": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Bork'an): Seeker of Perfection": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Dal'yth): Dynamic Mirror Field": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Dal'yth): Unifying Influence": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Farsight Enclaves): Master of the Killing Blow": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Farsight Enclaves): Talisman of Arthas Moloch": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Sa'cea): Grav-Inhibitor Field": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Sa'cea): Strategic Conqueror": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(T'au): Strength of Conviction": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(T'au): Vectored Manoeuvring Thrusters": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Vior'la): Academy Luminary": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§(Vior'la): Automated Armour Defences": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§1. Master of the Hunt (Aura)": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§1. Precision of the Hunter": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§1. Storm of Fire": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2. Pack Leader (Aura)": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2. Sense of Stone": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2. Through Unity, Devastation (Aura)": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Accelerator Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Airbursting Fragmentation Projector": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Cyclic Ion Blaster": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Fusion Blaster": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Gun Drones": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x High-yield Missile Pod": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Ion Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 10,
          },
        },
      },
      "Upgrade§2x Long-barrelled Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Nexus Missile Launcher": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Plasma Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Skyspear Missile Rack": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 50,
          },
        },
      },
      "Upgrade§2x Smart Missile System": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§2x Swiftstrike Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 70,
          },
        },
      },
      "Upgrade§2x Swiftstrike Railgun": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 100,
          },
        },
      },
      "Upgrade§2x T'au Flamer": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§3. A Ghost Walks Among Us": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§3. Nomadic Hunter (Aura)": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§3. Zephyr's Grace": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§3x Pulse Ordnance Multi-driver": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§4. Power of Tides": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§4. Through Boldness, Victory": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§5. Exemplar of the Kauyon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§5. Unifying Mantra (Aura)": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§6. Exemplar of the Mont'ka": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§6. Wisdom of the Guides": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Accelerator Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Advanced EM Scrambler": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Advanced Targeting System": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Bork'an Sept": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Borthrod Gland": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Cluster Rocket System": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Counterfire Defence System": {
        keywords: {
          Keywords: ["Counterfire Defence System"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Crushing Bulk": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Crushing Feet": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Cyclic Ion Raker": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Dal'yth Sept": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Dawn Blade": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Defensive charge": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Destroyer Missile": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Drone Controller": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Early Warning Override": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Experimental pulse submunitions rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Farsight Enclaves": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Fidelity": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Fireblade Pulse Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Flare Launcher": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Fletchette Launcher": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Fletchette Pod": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Fragmentation Cluster Shell Launcher": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Fusion Blaster": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Fusion Cascade": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 10,
          },
        },
      },
      "Upgrade§Fusion Collider": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ghostkeel Fists": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Great Knarloc Beak and Talons": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Grenade Belt": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Heavy Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Heavy Rail Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Heavy rail cannon": {},
      "Upgrade§Heavy Rail Cannon Array": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Heavy Rail Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Hide Non-Battlesuit Units": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§High Intensity Markerlight": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§High-intensity Plasma Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§High-output Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§High-yield Missile Pod": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 25,
          },
        },
      },
      "Upgrade§Homing Beacon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Honour Blade": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Hover Drone": {
        keywords: {
          Keywords: ["New CategoryLink"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ion Accelerator": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ion Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ion rifle": {},
      "Upgrade§Ion Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 5,
          },
        },
      },
      "Upgrade§Ionic Discharge Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Iridium battlesuit": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ka'chak'tarr": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ke'lshan Sept": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Kroot Bolt Thrower": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Kroot Gun": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Kroot pistol": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Kroot Pistol": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Kroot Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Krootox Fists": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Light Missile Pod": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Long-barrelled Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Long-barrelled burst cannon": {},
      "Upgrade§Longshot Pulse Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Markerlight": {
        keywords: {
          Keywords: ["Markerlight", "Markerlight"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Miniaturised fletchette pod": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Missile Pod": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Missile pod": {},
      "Upgrade§Multi-sensory Discouragement Array": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Multi-tracker": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Neuro-empathic Nullfier": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Neuroweb System Jammer": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Neutron Blaster": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ohr'tu's Lantern": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Onager Gauntlet": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Phased Ion Gun": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Phased Plasma-flamer": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Plasma Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Positional Relay": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Pulse Blastcannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Pulse Blaster": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Pulse Carbine": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Pulse Driver Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Pulse pistol": {},
      "Upgrade§Pulse Pistol": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Pulse Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Pulse Submunitions Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Puretide Engram Neurochip": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Quad Ion Turret": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Quill Grenades": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Rail Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Railgun": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Remora Seeker Missile": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ripping Fangs": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Riptide Fists": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Ritual Blade": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Sa'cea Sept": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Seeker Missile": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Seeker missile": {},
      "Upgrade§Seeker Missile Rack": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Sept Choice": {
        keywords: {
          Keywords: ["New CategoryLink"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Shade": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Shield Generator": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Smart Missile System": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Solid-image Projection Unit": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Stabilised Optics": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Stingwing Claws": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Stratagem: Emergency Dispensation": {
        keywords: {
          Keywords: ["New CategoryLink"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: -1,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Stratagem: Promising Pupil": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: -1,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Supremacy Railgun": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Swiftstrike Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Swiftstrike Railgun": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§T'au Flamer": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§T'au Sept": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Target Lock": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§The Be'gel Hunter's Plate": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§The Humble Stave": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§The Kindled Blade": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Thunderous Footfalls": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Twin Airbursting Fragmentation Projector": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Twin Burst Cannon": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Twin Hazard Burst Cannons": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Twin Heavy Fusion Cannon [Legends]": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 10,
          },
        },
      },
      "Upgrade§Twin Kroot Gun": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Twin Plasma Rifle": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Twin Smart Missile System": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Twin Swiftstrike Burst Cannon [Legends]": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 25,
          },
        },
      },
      "Upgrade§Twin T'au Flamer": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Twin T'au Plasma Cannon [Legends]": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 10,
          },
        },
      },
      "Upgrade§Unit Filter": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Velocity Tracker": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Vior'la Sept": {
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Upgrade§Warlord": {
        keywords: {
          Keywords: ["Warlord"],
        },
        stats: {
          " PL": {
            value: 0,
          },
          CP: {
            value: 0,
          },
          pts: {
            value: 0,
          },
        },
      },
      "Weapon§Accelerator Burst Cannon": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Assault 8",
          },
        },
      },
      "Weapon§Airbursting Fragmentation Projector": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer.",
      },
      "Weapon§Alternating Fusion Blaster": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D6+2",
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time an attack is made with this weapon, if a hit is scored, draw a straight line between the closest point of this model's base (or hull) and that of the closest model in the target unit. Make one wound roll against the target unit, and each other unit this line passes over.",
      },
      "Weapon§Burst cannon": {},
      "Weapon§Burst Cannon": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 6",
          },
        },
      },
      "Weapon§Cluster Rocket System": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '48"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Heavy 4D6",
          },
        },
        text: "Blast",
      },
      "Weapon§Crushing Bulk": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Crushing Feet": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Make 3 hit rolls for each attack made with this weapon, instead of 1. Each hit roll is treated as a separate attack.",
      },
      "Weapon§Cyclic ion blaster (Overcharge)": {},
      "Weapon§Cyclic Ion Blaster (Overcharge)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 3",
          },
        },
        text: "Each time an unmodified hit roll of 1 is made for an attack with this weapon profile, the bearer's unit suffers 1 mortal wound after shooting with this weapon.",
      },
      "Weapon§Cyclic ion blaster (Standard)": {},
      "Weapon§Cyclic Ion Blaster (Standard)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Assault 3",
          },
        },
      },
      "Weapon§Cyclic Ion Raker (Overcharge)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 6",
          },
        },
        text: "Each time an unmodified hit roll of 1 is made for an attack with this weapon profile, the bearer's unit suffers 1 mortal wound after shooting with this weapon.",
      },
      "Weapon§Cyclic Ion Raker (Standard)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 6",
          },
        },
      },
      "Weapon§Dawn Blade (Strike)": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: 3,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "x2",
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Dawn Blade (Sweep)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, make 2 hit rolls instead of 1.",
      },
      "Weapon§Destroyer Missile": {
        stats: {
          AP: {
            value: -5,
          },
          D: {
            value: "2D3",
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 12,
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "The bearer can only shoot with each destroyer missile it is equipped with once per battle. Each time the bearer is selected to shoot, it cannot shoot with more than two of the destroyer missiles it is equipped with.",
      },
      "Weapon§Dispersed Fusion Blaster": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Assault 2",
          },
        },
        text: "Each time an attack made with this weapon targets a unit within half range, that attack has a Damage characteristic of 3.",
      },
      "Weapon§Dominator Fragmentation Launcher": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault D6",
          },
        },
        text: "This weapon can target units that are not visible to the bearer. Each time the bearer shoots with this weapon, if any hits are scored, until the end of the turn, subtract 4 from the Leadership characteristic of models in the target unit.",
      },
      "Weapon§DW-02 Advanced Burst Cannon": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Assault 8",
          },
        },
        text: "Each time an attack made with this weapon is allocated to a model, that model cannot use any rules to ignore the wounds it loses.",
      },
      "Weapon§Fidelity": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, an unmodified hit roll of 6 scores one additional hit.",
      },
      "Weapon§Fireblade Pulse Rifle": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Rapid Fire 1",
          },
        },
      },
      "Weapon§Fletchette Launcher": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 3,
          },
          Type: {
            value: "Assault 5",
          },
        },
      },
      "Weapon§Fletchette Pod": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 3,
          },
          Type: {
            value: "Assault 5",
          },
        },
      },
      "Weapon§Fragmentation cluster shell launcher": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Blast",
      },
      "Weapon§Fusion blaster": {},
      "Weapon§Fusion Blaster": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D6",
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time an attack made with this weapon targets a unit within half range, that attack has a Damage characteristic of D6+2.",
      },
      "Weapon§Fusion Cascade": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D6",
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault D3",
          },
        },
        text: "Blast. Each time an attack made with this weapon targets a unit within half range, that attack has a Damage characteristic of D6+2.",
      },
      "Weapon§Fusion Collider": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D6",
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 9,
          },
          Type: {
            value: "Heavy 3",
          },
        },
        text: "Each time an attack is made with this weapon that targets an enemy unit within half range, that attack has a Damage characteristic of D6+2.",
      },
      "Weapon§Fusion Eradicator": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D6",
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 5",
          },
        },
        text: "Each time an attack made with this weapon targets a unit within half range, that attack has a Damage characteristic of D6+2.",
      },
      "Weapon§Ghostkeel Fists": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 2,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Grenade Belt": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '6"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Grenade 2D6",
          },
        },
        text: "Blast. The bearer can only shoot with this weapon once per battle.",
      },
      "Weapon§Heavy Burst Cannon": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Heavy 12",
          },
        },
      },
      "Weapon§Heavy Rail Cannon": {
        stats: {
          AP: {
            value: -5,
          },
          D: {
            value: "D3+6",
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 14,
          },
          Type: {
            value: "Heavy 2",
          },
        },
        text: "Each time a successful wound roll is made for an attack with this weapon, the target suffers D3 mortal wounds in addition to any other damage.",
      },
      "Weapon§Heavy rail cannon array": {
        stats: {
          AP: {
            value: -5,
          },
          D: {
            value: "D6+6",
          },
          Range: {
            value: '120"',
          },
          S: {
            value: 18,
          },
          Type: {
            value: "Heavy 2",
          },
        },
        text: "Each time a successful wound roll is made for an attack with this weapon, the target suffers 3 mortal wounds in addition to any other damage.",
      },
      "Weapon§Heavy Rail Rifle": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D3+3",
          },
          Range: {
            value: '60"',
          },
          S: {
            value: 9,
          },
          Type: {
            value: "Heavy 2",
          },
        },
        text: "Each time a successful wound roll is made for an attack with this weapon, the target suffers 1 mortal wound in addition to any other damage.",
      },
      "Weapon§High Intensity Markerlight": {
        stats: {
          AP: {
            value: "-",
          },
          D: {
            value: "-",
          },
          Range: {
            value: '36"',
          },
          S: {
            value: "-",
          },
          Type: {
            value: "Heavy 3",
          },
        },
        text: "Markerlight (see Codex: T'au Empire)",
      },
      "Weapon§High-energy Fusion Blaster": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D6",
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time an attack made with this weapon targets a unit within half range, that attack has a Damage characteristic of D6+2.",
      },
      "Weapon§High-intensity Plasma Rifle": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§High-output Burst Cannon": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 10",
          },
        },
      },
      "Weapon§High-yield Missile Pod": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 4",
          },
        },
      },
      "Weapon§Honour Blade": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 2,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 2,
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time an attack is made with this weapon, subtract 1 from that attack's hit roll.",
      },
      "Weapon§Ion Accelerator (Overcharge)": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: 4,
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 6",
          },
        },
        text: "Each time an unmodified hit roll of 1 is made for an attack with this weapon profile, the bearer's unit suffers 1 mortal wound after shooting with this weapon.",
      },
      "Weapon§Ion Accelerator (Standard)": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 6",
          },
        },
      },
      "Weapon§Ion cannon (Overcharge)": {},
      "Weapon§Ion Cannon (Overcharge)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '60"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 3D3",
          },
        },
        text: "Blast. Each time an unmodified hit roll of 1 is made by an attack with this weapon profile, the bearer's unit suffers 1 mortal wound after shooting with this weapon.",
      },
      "Weapon§Ion cannon (Standard)": {},
      "Weapon§Ion Cannon (Standard)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '60"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 3D3",
          },
        },
      },
      "Weapon§Ion rifle (Overcharge)": {},
      "Weapon§Ion Rifle (Overcharge)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 3",
          },
        },
        text: "If any unmodified hit rolls of 1 are made for attacks with this weapon profile, the bearer suffers 1 mortal wound after shooting with this weapon.",
      },
      "Weapon§Ion Rifle (Standard)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 3",
          },
        },
      },
      "Weapon§Ionic Discharge Cannon (Nova)": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 9,
          },
          Type: {
            value: "Heavy 6",
          },
        },
        text: "If any unmodified hit rolls of 1 are made for attacks with this weapon profile, the bearer suffers 1 mortal wound after shooting with this weapon.",
      },
      "Weapon§Ionic discharge cannon (Standard)": {},
      "Weapon§Ionic Discharge Cannon (Standard)": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 6",
          },
        },
      },
      "Weapon§Ka'chak'tarr": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Rapid Fire 2",
          },
        },
        text: "Each time you select a target for this weapon, you can ignore the Look Out, Sir rule. Each time an attack is made with this weapon, an unmodified wound roll of 6 inflicts 1 mortal wound to the target in addition to any normal damage.",
      },
      "Weapon§Kroot Bolt Thrower": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Assault 6",
          },
        },
      },
      "Weapon§Kroot Gun": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '48"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 2",
          },
        },
      },
      "Weapon§Kroot Pistol": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Pistol 1",
          },
        },
      },
      "Weapon§Kroot Rifle (melee)": {},
      "Weapon§Kroot rifle (melee)": {},
      "Weapon§Kroot Rifle (Melee)": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Kroot Rifle (Shooting)": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Rapid Fire 1",
          },
        },
      },
      "Weapon§Krootox fists": {},
      "Weapon§Krootox Fists": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Light Missile Pod": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§Long-barrelled Burst Cannon": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 4",
          },
        },
      },
      "Weapon§Long-barrelled burst cannon": {},
      "Weapon§Longshot Pulse Rifle": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '48"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Rapid Fire 1",
          },
        },
      },
      "Weapon§Missile Pod": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§Neutron Blaster": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§New InfoLink": {},
      "Weapon§Nexus missile launcher": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '60"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Blast",
      },
      "Weapon§Novasurge Plasma Rifle": {
        stats: {
          AP: {
            value: -5,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time an attack is made with this weapon, invulnerable saves cannot be made against that attack.",
      },
      "Weapon§Onager Gauntlet": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 3,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 12,
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Phased ion gun": {},
      "Weapon§Phased Ion Gun": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Assault 4",
          },
        },
      },
      "Weapon§Phased Plasma-flamer (Nova)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Each time an attack is made with this weapon profile, that attack automatically hits the target.",
      },
      "Weapon§Phased plasma-flamer (Standard)": {},
      "Weapon§Phased Plasma-flamer (Standard)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Heavy 2D6",
          },
        },
        text: "Each time an attack is made with this weapon profile, that attack automatically hits the target.",
      },
      "Weapon§Piranha Burst Cannon": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Assault 6",
          },
        },
      },
      "Weapon§Piranha Fusion Blaster": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D6+2",
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time an attack made with this weapon targets a unit within half range, that attack has a Damage characteristic of D6+4.",
      },
      "Weapon§Plasma rifle": {},
      "Weapon§Plasma Rifle": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 1",
          },
        },
      },
      "Weapon§Pulse blastcannon (1 Close range)": {},
      "Weapon§Pulse Blastcannon (Dispersed Shot)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 4,
          },
          Range: {
            value: '48"',
          },
          S: {
            value: 12,
          },
          Type: {
            value: "Heavy 6",
          },
        },
      },
      "Weapon§Pulse Blastcannon (Focused Shot)": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 12,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 16,
          },
          Type: {
            value: "Heavy 2",
          },
        },
      },
      "Weapon§Pulse Blaster (Close Range)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '8"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§Pulse Blaster (Long Range)": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '14"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§Pulse carbine": {},
      "Weapon§Pulse Carbine": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§Pulse Driver Cannon": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 10,
          },
          Type: {
            value: "Heavy 3D3",
          },
        },
        text: "Blast",
      },
      "Weapon§Pulse ordnance multi-driver (Concentrated)": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 5,
          },
          Range: {
            value: '90"',
          },
          S: {
            value: 10,
          },
          Type: {
            value: "Heavy 2",
          },
        },
      },
      "Weapon§Pulse ordnance multi-driver (Dispersed)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast",
      },
      "Weapon§Pulse Pistol": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Pistol 1",
          },
        },
      },
      "Weapon§Pulse pistol": {},
      "Weapon§Pulse Rifle": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Rapid Fire 1",
          },
        },
      },
      "Weapon§Pulse rifle": {},
      "Weapon§Pulse Submunitions Cannon (Nova)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '60"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 9",
          },
        },
        text: "Blast",
      },
      "Weapon§Pulse submunitions cannon (Standard)": {},
      "Weapon§Pulse Submunitions Cannon (Standard)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '60"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Heavy 3D3",
          },
        },
        text: "Blast",
      },
      "Weapon§Quad Ion Turret (Overcharge)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 8",
          },
        },
        text: "Each time an unmodified hit roll of 1 is made for an attack with this weapon profile, the bearer suffers 1 mortal wound after shooting with this weapon.",
      },
      "Weapon§Quad ion turret (Standard)": {},
      "Weapon§Quad Ion Turret (Standard)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Assault 8",
          },
        },
      },
      "Weapon§Quill Grenades": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '6"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Grenade D6",
          },
        },
        text: "Blast",
      },
      "Weapon§Rail rifle": {},
      "Weapon§Rail Rifle": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "Each time a successful wound roll is made for an attack made with this weapon, the target suffers 1 mortal wound in addition to any other damage.",
      },
      "Weapon§Railgun": {
        stats: {
          AP: {
            value: -6,
          },
          D: {
            value: "D3+6",
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 14,
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "Each time an attack is made with this weapon, invulnerable saving throws cannot be made against that attack. Each time a successful wound roll is made for an attack with this weapon, the target suffers 3 mortal wounds in addition to any other damage.",
      },
      "Weapon§Remora Seeker Missile": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: "D3",
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "This weapon can be used once per battle.",
      },
      "Weapon§Resonator Warheads": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 3",
          },
        },
        text: "Each time the bearer shoots with this weapon, if any hits are scored against an INFANTRY, BEAST or CAVALRY unit, until the start of your next Shooting phase, halve the Move characteristic of models in that unit (if models in that unit are affected by any other modifiers to their Move characteristic, this ability cannot reduce it to less than half).",
      },
      "Weapon§Ripping Fangs": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Riptide Fists": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Ritual Blade": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 1,
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Seeker Missile": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: "2D3",
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 9,
          },
          Type: {
            value: "Heavy 1",
          },
        },
        text: "The bearer can only shoot with each seeker missile it is equipped with once per battle.",
      },
      "Weapon§Seeker Missile Rack": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: "2D3",
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 9,
          },
          Type: {
            value: "Heavy D3+1",
          },
        },
      },
      "Weapon§Semi-automatic Grenade Launcher (EMP Grenade)": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '20"',
          },
          S: {
            value: 3,
          },
          Type: {
            value: "Assault 1",
          },
        },
        text: "Each time a successful hit is made for an attack made with this weapon, if the target is a VEHICLE unit (excluding TITANIC units) whose characteristics change as it loses wounds, then, until the start of your next Shooting phase, it halves the number of wounds it has remaining when determining which characteristics to use.",
      },
      "Weapon§Semi-automatic Grenade Launcher (Fusion Grenade)": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '20"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Assault 1",
          },
        },
      },
      "Weapon§Shade": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§Shaper Kroot Rifle": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Rapid Fire 2",
          },
        },
      },
      "Weapon§Skyspear Missile Rack": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Heavy D6",
          },
        },
        text: "Blast",
      },
      "Weapon§Smart Missile Systems": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Heavy 4",
          },
        },
        text: "This weapon can target units that are not visible to the bearer. Each time an attack is made with this weapon, the target does not receive the benefits of Light Cover against that attack.",
      },
      "Weapon§Stingwing Claws": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Supremacy Railgun": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D3+3",
          },
          Range: {
            value: '72"',
          },
          S: {
            value: 12,
          },
          Type: {
            value: "Heavy 2",
          },
        },
        text: "Each time a successful wound is made for an attack with this weapon, the target suffers D3 mortal wounds in addition to any other damage.",
      },
      "Weapon§Swiftstrike burst cannon": {},
      "Weapon§Swiftstrike Burst Cannon": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Heavy 12",
          },
        },
      },
      "Weapon§Swiftstrike Railgun": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D3+3",
          },
          Range: {
            value: '48"',
          },
          S: {
            value: 10,
          },
          Type: {
            value: "Heavy 2",
          },
        },
        text: "Each time a successful wound roll is made for an attack with this weapon, the target suffers 1 mortal wound in addition to any other damage.",
      },
      "Weapon§Swiftstrike railgun": {},
      "Weapon§T'au Flamer": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Assault D6+2",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
      },
      "Weapon§Thermoneutronic Projector (Melee)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Melee",
          },
        },
        text: "Each time the bearer fights, it makes D6+2 additional attacks with this weapon.",
      },
      "Weapon§Thermoneutronic Projector (Shooting)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Assault D6+2",
          },
        },
      },
      "Weapon§Thunderous Footfalls": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: "Melee",
          },
          S: {
            value: "User",
          },
          Type: {
            value: "Melee",
          },
        },
      },
      "Weapon§Tri-axis Ion Cannon (Overcharge)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '60"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Heavy 3D6",
          },
        },
        text: "Blast. Each time the bearer shoots with this weapon profile, if any unmodified hit rolls of 1 are made for attacks with this weapon, the bearer suffers D3 mortal wounds after shooting with this weapon.",
      },
      "Weapon§Tri-axis Ion Cannon (Standard)": {
        stats: {
          AP: {
            value: -2,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '60"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 9",
          },
        },
      },
      "Weapon§Twin Airbursting Fragmentation Projector": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Assault 2D6",
          },
        },
        text: "Blast. This weapon can target units that are not visible to the bearer.",
      },
      "Weapon§Twin Burst Cannon": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 12",
          },
        },
      },
      "Weapon§Twin Hazard Burst Cannons": {},
      "Weapon§Twin hazard burst cannons": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '18"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Assault 8",
          },
        },
      },
      "Weapon§Twin heavy fusion cannon": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: "D6+2",
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 9,
          },
          Type: {
            value: "Heavy 2",
          },
        },
        text: "Each time an attack made with this weapon targets a unit within half range, that attack has a damage characteristic of D6+4.",
      },
      "Weapon§Twin Kroot Gun": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: "D3",
          },
          Range: {
            value: '48"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Rapid Fire 2",
          },
        },
      },
      "Weapon§Twin Plasma Rifle": {
        stats: {
          AP: {
            value: -4,
          },
          D: {
            value: 3,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 8,
          },
          Type: {
            value: "Assault 2",
          },
        },
      },
      "Weapon§Twin Plasma Rifle [Legends]": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '24"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Rapid Fire 2",
          },
        },
      },
      "Weapon§Twin Smart Missile System": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '30"',
          },
          S: {
            value: 5,
          },
          Type: {
            value: "Heavy 8",
          },
        },
        text: "This weapon can target units that are not visible to the bearer. Each time an attack is made with this weapon, the target unit does not receive the benefits of Light Cover against that attack.",
      },
      "Weapon§Twin Swiftstrike Burst Cannon": {
        stats: {
          AP: {
            value: -1,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '36"',
          },
          S: {
            value: 6,
          },
          Type: {
            value: "Heavy 16",
          },
        },
      },
      "Weapon§Twin T'au Flamer": {
        stats: {
          AP: {
            value: 0,
          },
          D: {
            value: 1,
          },
          Range: {
            value: '12"',
          },
          S: {
            value: 4,
          },
          Type: {
            value: "Assault 2D6+4",
          },
        },
        text: "Each time an attack is made with this weapon, that attack automatically hits the target.",
      },
      "Weapon§Twin T'au plasma cannon": {
        stats: {
          AP: {
            value: -3,
          },
          D: {
            value: 2,
          },
          Range: {
            value: '48"',
          },
          S: {
            value: 7,
          },
          Type: {
            value: "Heavy 6",
          },
        },
      },
    },
  },
};

export {};
