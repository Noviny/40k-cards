const fs = require("fs").promises;
var parseString = require("xml2js").parseString;

const parseXml = () => {
  const myXMLString = fs.readFileSync("./necrons.xml", { encoding: "utf-8" });
  parseString(myXMLString, (err, result) => {
    console.log(Object.keys(result));
    fs.writeFileSync("necrons.json", JSON.stringify(result));

    console.log("done");
  });
};

const alwaysOnlyOne = new Set([
  "characteristicTypes",
  "constraints",
  "modifiers",
  "repeats",
  "conditionGroups",
  "conditions",
  "profiles",
  "characteristics",
  "infoLinks",
  "categoryLinks",
  "entryLinks",
  "costs",
  "selectionEntryGroups",
  "selectionEntries",
  "rules",
]);

let count = 0;
let thingy = new Map();
let randomSet = new Set();

const parse = (child) => {
  if (typeof child === "string") return child;
  if (Array.isArray(child)) {
    return child.map(parse);
  }
  if (typeof child === "object") {
    const entries = Object.entries(child);
    const [, keyObj] = entries.find(([k]) => k === "$") || [];

    if (keyObj) {
      entries.push(...Object.entries(keyObj));
    }

    const endObj = Object.fromEntries(
      entries
        .filter(([k]) => k !== "$")
        // .filter(([k]) => k !== "id")
        // .filter(([k]) => k !== "typeId")
        .filter(([k]) => k !== "hidden")
        .filter(([k]) => k !== "import")
        .filter(([k]) => k !== "publicationId")
        .map(([key, val]) => {
          if (key === "description" || key === "comment") {
            return [key, val];
          }

          if (key === "characteristics") {
            return [key, parse(val)[0].characteristic.reduce((acc, { name, _ }) => ({ ...acc, [name]: _ }), {})];
          }

          if (key === "type") {
            randomSet.add(val);
          }
          if (alwaysOnlyOne.has(key)) {
            const childKeys = Object.keys(val[0]);

            if (childKeys.length > 1) {
              throw new Error(`something whack is about to occur with ${key}:\n${JSON.stringify(val, undefined, 2)}`);
            } else {
              return [key, parse(beSolo(val)[beSolo(childKeys)])];
            }
          }

          return [key, parse(val)];
        })
    );

    if (endObj.id) {
      thingy.set(endObj.id, endObj);
    }

    return endObj;
  }

  throw new Error(`child was of unknown type: ${typeof child}: ${JSON.stringify(child)}`);
};

const beSolo = (arr) => {
  if (arr.length !== 1) {
    throw new Error(`we were parsed something that was not an array with length 1:\n${JSON.stringify(arr)}`);
  }

  return arr[0];
};

const exploreJSon = async () => {
  const file = await fs.readFile("./necrons.json", "utf-8");

  const parsedStuf = parse(JSON.parse(file).catalogue);
  await fs.writeFile("./necrons-modified.json", JSON.stringify(parsedStuf));
};

exploreJSon().then(() => console.log("done"));

const necronWarrios = [
  // in categoryEntries
  {
    id: "c9db-16b2-d65f-708b",
    name: "Necron Warriors",
    hidden: "false",
  },
  // in entryLinks
  {
    categoryLinks: [
      {
        id: "3dc4-0440-c700-97a4",
        name: "New CategoryLink",
        hidden: "false",
        targetId: "5d76b6f5-20ae-4d70-8f59-ade72a2add3a",
        primary: "true",
      },
    ],
    id: "881a-dcaf-c88b-8ff1",
    name: "Necron Warriors",
    hidden: "false",
    collective: "false",
    import: "true",
    targetId: "12ec-e22a-a06b-c611",
    type: "selectionEntry",
  },
  {
    id: "2013-9954-8da3-6631",
    name: "Necron Warriors",
    hidden: "false",
    targetId: "c9db-16b2-d65f-708b",
    primary: "false",
  },
  {
    modifiers: [
      {
        conditions: [
          {
            field: "selections",
            scope: "12ec-e22a-a06b-c611",
            value: "10.0",
            percentValue: "false",
            shared: "true",
            includeChildSelections: "true",
            includeChildForces: "false",
            childId: "model",
            type: "greaterThan",
          },
        ],
        type: "set",
        field: "e356-c769-5920-6e14",
        value: "12.0",
      },
    ],
    profiles: [
      {
        characteristics: [
          {
            _: "Re-roll Reanimation Protocol rolls of 1 made for this unit.",
            name: "Description",
            typeId: "21befb24-fc85-4f52-a745-64b2e48f8228",
          },
        ],
        id: "b417-7393-a241-64fd",
        name: "Their Number Is Legion",
        publicationId: "61c6-c8c5-pubN65537",
        page: "92",
        hidden: "false",
        typeId: "72c5eafc-75bf-4ed9-b425-78009f1efe82",
        typeName: "Abilities",
      },
    ],
    infoLinks: [
      {
        id: "8f40-242c-16e3-3bfc",
        name: "Reanimation Protocols",
        publicationId: "61c6-c8c5-pubN65537",
        hidden: "false",
        targetId: "cba7-3427-625e-eb99",
        type: "rule",
      },
      {
        id: "8771-80d1-ce98-0f1c",
        name: "Objective Secured",
        publicationId: "61c6-c8c5-pubN65537",
        hidden: "false",
        targetId: "e07e-8dbf-0b15-7485",
        type: "rule",
      },
      {
        id: "d9f9-0e03-b6be-6ada",
        name: "Command Protocols",
        publicationId: "61c6-c8c5-pubN65537",
        hidden: "false",
        targetId: "aa07-b2de-6de0-3dd9",
        type: "rule",
      },
    ],
    categoryLinks: [
      {
        id: "43c1-84fc-a494-656c",
        name: "",
        publicationId: "61c6-c8c5-pubN65537",
        hidden: "false",
        targetId: "6a37-4c9f-a323-a8f2",
        primary: "false",
      },
      {
        id: "3201-4622-692a-6494",
        name: "",
        publicationId: "61c6-c8c5-pubN65537",
        hidden: "false",
        targetId: "876e-ea78-1fdf-f250",
        primary: "false",
      },
      {
        id: "f9cd-89e5-b788-e406",
        name: "",
        publicationId: "61c6-c8c5-pubN65537",
        hidden: "false",
        targetId: "3d52-fccf-10c0-3fae",
        primary: "false",
      },
      {
        id: "9c25-8e8a-7582-ff58",
        name: "Core",
        hidden: "false",
        targetId: "08f1-d244-eb44-7e01",
        primary: "false",
      },
      {
        id: "2013-9954-8da3-6631",
        name: "Necron Warriors",
        hidden: "false",
        targetId: "c9db-16b2-d65f-708b",
        primary: "false",
      },
    ],
    selectionEntryGroups: [
      {
        constraints: [
          {
            field: "selections",
            scope: "parent",
            value: "20.0",
            percentValue: "false",
            shared: "true",
            includeChildSelections: "false",
            includeChildForces: "false",
            id: "93cb-5f5e-ac6a-c77a",
            type: "max",
          },
          {
            field: "selections",
            scope: "parent",
            value: "10.0",
            percentValue: "false",
            shared: "true",
            includeChildSelections: "false",
            includeChildForces: "false",
            id: "543d-a94b-3f3b-940d",
            type: "min",
          },
        ],
        entryLinks: [
          {
            constraints: [
              {
                field: "selections",
                scope: "parent",
                value: "20.0",
                percentValue: "false",
                shared: "true",
                includeChildSelections: "false",
                includeChildForces: "false",
                id: "1725-853d-6d16-2293",
                type: "max",
              },
            ],
            id: "a881-d8ce-8c45-b8d6",
            name: "Necron Warrior (Gauss Flayer)",
            publicationId: "61c6-c8c5-pubN65537",
            hidden: "false",
            collective: "false",
            import: "true",
            targetId: "631d-38b4-1b15-59f9",
            type: "selectionEntry",
          },
          {
            constraints: [
              {
                field: "selections",
                scope: "parent",
                value: "20.0",
                percentValue: "false",
                shared: "true",
                includeChildSelections: "false",
                includeChildForces: "false",
                id: "544a-7a10-cd7e-1ae3",
                type: "max",
              },
            ],
            id: "d0f5-831a-a452-d251",
            name: "Necron Warrior (Gauss Reaper)",
            publicationId: "61c6-c8c5-pubN65537",
            hidden: "false",
            collective: "false",
            import: "true",
            targetId: "7cc6-7137-ae78-7abc",
            type: "selectionEntry",
          },
        ],
        id: "7478-d7a3-53f7-0068",
        name: "Warriors",
        hidden: "false",
        collective: "false",
        import: "true",
        defaultSelectionEntryId: "a881-d8ce-8c45-b8d6",
      },
    ],
    entryLinks: [
      {
        id: "f1a7-5cd8-30d9-859a",
        name: "Has Battle Honours (Chapter Approved 2018)",
        hidden: "false",
        collective: "false",
        import: "true",
        targetId: "4763-757f-499f-d998",
        type: "selectionEntry",
      },
      {
        id: "6f8c-5eb8-3889-944e",
        name: "Battle Honours (Chapter Approved 2018)",
        hidden: "false",
        collective: "false",
        import: "true",
        targetId: "5518-d0f5-a880-d71c",
        type: "selectionEntryGroup",
      },
    ],
    costs: [
      {
        name: "pts",
        typeId: "points",
        value: "0.0",
      },
      {
        name: " PL",
        typeId: "e356-c769-5920-6e14",
        value: "6.0",
      },
      {
        name: "CP",
        typeId: "2d3b-b544-ad49-fb75",
        value: "0.0",
      },
    ],
    id: "12ec-e22a-a06b-c611",
    name: "Necron Warriors",
    publicationId: "61c6-c8c5-pubN65537",
    hidden: "false",
    collective: "false",
    import: "true",
    type: "unit",
  },
];
