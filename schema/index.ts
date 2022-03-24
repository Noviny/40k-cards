import { graphql, list } from "@keystone-6/core";
import {
  checkbox,
  integer,
  password,
  relationship,
  select,
  text,
  virtual,
} from "@keystone-6/core/fields";
import { Lists } from ".keystone/types";

const WeaponProfile: Lists.WeaponProfile = list({
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    range: text({ validation: { isRequired: true } }),
    type: select({
      options: [
        { label: "Rapid Fire", value: "Rapid Fire" },
        { label: "Assault", value: "Assault" },
        { label: "Heavy", value: "Heavy" },
        { label: "Grenade", value: "Grenade" },
        { label: "Pistol", value: "Pistol" },
        { label: "Melee", value: "Melee" },
      ],
      validation: { isRequired: true },
    }),
    shots: text(),
    AP: text({ validation: { isRequired: true } }),
    dmg: text({ validation: { isRequired: true } }),
    strength: text({ validation: { isRequired: true } }),
    notes: text(),
    profile: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve({ name, range, type, shots, strength, AP, dmg }) {
          return `${name}: ${range} ${type} ${shots} | ${strength} | ${AP} | ${dmg}`;
        },
      }),
    }),
    units: relationship({ ref: "Unit.weapons", many: true }),
  },
});
const UnitStat: Lists.UnitStat = list({
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    M: text({ validation: { isRequired: true } }),
    WS: text({ validation: { isRequired: true } }),
    BS: text({ validation: { isRequired: true } }),
    W: text({ validation: { isRequired: true } }),
    S: text({ validation: { isRequired: true } }),
    T: text({ validation: { isRequired: true } }),
    A: text({ validation: { isRequired: true } }),
    Sv: text({ validation: { isRequired: true } }),
    Ld: text({ validation: { isRequired: true } }),
    statLine: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve({ M, WS, BS, S, A }) {
          return `M: ${M}, WS: ${WS} BS: ${BS} S: ${S} A: ${A}`;
        },
      }),
    }),
    units: relationship({ ref: "Unit.stats", many: true }),
  },
});

const Tag: Lists.Tag = list({
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: "unique" }),
  },
});

const roles = [
  { value: "HQ", label: "HQ" },
  { value: "Flyer", label: "Flyer" },
  { value: "Elite", label: "Elite" },
  { value: "Troop", label: "Troop" },
  { value: "Drone", label: "Drone" },
  { value: "Transport", label: "Transport" },
  { value: "Heavy", label: "Heavy" },
  { value: "Fast", label: "Fast" },
  { value: "misc", label: "misc" },
] as const;

const Unit: Lists.Unit = list({
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    details: text({ ui: { displayMode: "textarea" } }),
    stats: relationship({
      ref: "UnitStat.units",
      ui: {
        displayMode: "cards",
        cardFields: ["statLine"],
        itemView: {
          fieldMode: "edit",
        },
        createView: {
          fieldMode: "edit",
        },
      },
    }),
    weapons: relationship({
      ref: "WeaponProfile.units",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["profile"],
        itemView: {
          fieldMode: "edit",
        },
        createView: {
          fieldMode: "edit",
        },
      },
    }),
    keywords: relationship({ ref: "Tag", many: true }),
    points: integer({ validation: { isRequired: true } }),
    abilities: relationship({
      ref: "Rule",
      many: true,
      ui: {
        inlineConnect: true,
        itemView: {
          fieldMode: "edit",
        },
        createView: {
          fieldMode: "edit",
        },
      },
    }),
    role: select({
      options: roles,
      validation: { isRequired: true },
      type: "enum",
    }),
    armies: relationship({ ref: "ArmyList.units", many: true }),
  },
});
const ArmyList = list({
  fields: {
    name: text(),
    description: text({ ui: { displayMode: "textarea" } }),
    notes: text({ ui: { displayMode: "textarea" } }),
    stratagems: relationship({ ref: "Stratagem.armies", many: true }),
    units: relationship({ ref: "Unit.armies", many: true }),
    armyRules: relationship({ ref: "Rule", many: true }),
  },
});
const Rule: Lists.Rule = list({
  fields: {
    name: text({ isIndexed: "unique", validation: { isRequired: true } }),
    displayName: text(),
    hideName: checkbox(),
    details: text({ validation: { isRequired: true } }),
  },
});

const Stratagem = list({
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    armies: relationship({ ref: "ArmyList.stratagems", many: true }),
    details: text({ validation: { isRequired: true } }),
    CP: text({ validation: { isRequired: true } }),
  },
});

const User = list({
  fields: {
    name: text({ isIndexed: "unique", validation: { isRequired: true } }),
    email: text({ isIndexed: "unique", validation: { isRequired: true } }),
    password: password({ validation: { isRequired: true } }),
  },
});

export const lists = {
  WeaponProfile,
  UnitStat,
  Unit,
  Rule,
  Tag,
  User,
  Stratagem,
  ArmyList,
};
