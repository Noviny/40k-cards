import { config, graphql, list } from "@keystone-6/core";
import {
  integer,
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
    shots: text({ validation: { isRequired: true } }),
    AP: text({ validation: { isRequired: true } }),
    dmg: text({ validation: { isRequired: true } }),
    strength: text({ validation: { isRequired: true } }),
    notes: text({ validation: { isRequired: true } }),
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
    S: text({ validation: { isRequired: true } }),
    A: text({ validation: { isRequired: true } }),
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
    role: select({ options: roles, validation: { isRequired: true } }),
  },
});
const Army = list({ fields: {} });
const Rule = list({
  fields: {
    name: text(),
    details: text({ validation: { isRequired: true } }),
  },
});

export default config({
  db: { provider: "sqlite", url: "file:./app.db" },
  experimental: {
    generateNextGraphqlAPI: true,
    generateNodeAPI: true,
  },
  lists: { WeaponProfile, UnitStat, Unit, Rule, Tag },
});
