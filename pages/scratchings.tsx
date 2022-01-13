import React, { FC } from "react";
import {
  Card,
  UnitCard,
  OptionsCard,
  Ability,
  StratagemCard,
} from "../components/cards";
import { necronArmy, stratagems } from "../data/necrons";
import { units as tauUnits, stratagems as tauStrats } from "../data/tau";
import { UnitCardDetails, AbilityDetail } from "../types";

const PrintSeparator = () => <div style={{ height: "2cm", width: "100%" }} />;

const ArmySummary = ({
  units,
  CP,
}: {
  units: UnitCardDetails[];
  CP: string;
}) => (
  <>
    {units.map((unit) =>
      unit.name === "HBC Riptide" ? (
        <>
          <PrintSeparator />
          <UnitCard key={unit.name} {...unit} />
        </>
      ) : (
        <UnitCard key={unit.name} {...unit} />
      )
    )}
    <Card>
      <div
        style={{
          textAlign: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ paddingBottom: 8 }}>Army</div>
        <div style={{ fontSize: 12 }}>
          {units.map(({ name, points }) => (
            <div key={name}>
              <b>{name}</b>: {points}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Points: {units.reduce((a, b) => a + b.points, 0)}</div>
          <div>CP: {CP}</div>
        </div>
      </div>
    </Card>
  </>
);

const Protocols: Array<{
  abilities: AbilityDetail[];
  title: string;
}> = [
  {
    title: "Protocol of the Eternal Guardian",
    abilities: [
      {
        name: "Directive 1",
        details:
          "Units with this code have the Objective Secured ability. If a model in such a unit already has this ability, that model counts as one additional model when determining control of an objective marker.",
      },
      {
        name: "Directive 2",
        details:
          'At the start of the first battle round, before the first turn begins, units with this code can make a Normal Move of up to 6".',
      },
    ],
  },
  {
    title: "Protocol of the Hungry Void",
    abilities: [
      {
        name: "Directive 1",
        details:
          "Each time a model in this unit makes a melee attack, on an unmodified wound roll of 6, improve the Armour Penetration characteristic of that attack by 1",
      },
      {
        name: "Directive 2",
        details:
          "Each time a model in this unit makes a melee attack, if this unit made a charge move, was charged or performed a Heroic Intervention this turn, add 1 to that attack's Strength characteristic.",
      },
    ],
  },
  {
    title: "Protocol of the Sudden Storm",
    abilities: [
      {
        name: "Directive 1",
        details: 'Add 1" to the Move characteristic of models in this unit.',
      },
      {
        name: "Directive 2",
        details:
          "If this unit is performing an action, it can still make attacks with ranged weapons without that action failing.",
      },
    ],
  },
  {
    title: "Protocol of the Undying Legions",
    abilities: [
      {
        name: "Directive 1",
        details:
          "Each time this unit uses its Living Metal ability, each model in this unit regains 1 additional lost wound",
      },
      {
        name: "Directive 2",
        details:
          "Each time you make Reanimation Protocol rolls for this unit, you can re-roll one of the dice.",
      },
    ],
  },
  {
    title: "Protocol of the Vengeful Stars",
    abilities: [
      {
        name: "Directive 1",
        details:
          "Each time a model in this unit makes a ranged attack, on an unmodified wound roll of 6, improve the Armour Penetration characteristic of that attack by 1",
      },
      {
        name: "Directive 2",
        details:
          "Each time a model in this unit makes a ranged attack that targets a unit within half range, the target does not receive the benefits of cover to its saving throw against that attack.",
      },
    ],
  },
];

const NecronRules = () => (
  <>
    <Card>
      <div style={{ textAlign: "center" }}>Dynasty</div>
      <Ability
        name="Eternal Conquerors"
        details="Units with this code have the Objective Secured ability. If a model in such a unit already has this ability, that model counts as one additional model when determining control of an objective marker."
      />
      <Ability
        name="Relentlessly Expansionist"
        details={
          'At the start of the first battle round, before the first turn begins, units with this code can make a Normal Move of up to 6".'
        }
      />
    </Card>
    {Protocols.map((protocol) => (
      <OptionsCard key={protocol.title} {...protocol} />
    ))}
    <Card>
      <div>Random Rules</div>
      <Ability
        name="Command Protocols"
        details="After deployment, before 1st turn is determined, order 5 of 6 protocols. On each turn, enact the next protocol, picking either option."
      />
      <Ability
        name="Reanimation Protocols"
        details="After a unit is shot or fought, it begins to reanimate. Anything killed by that fight rolls a d6 for each wound of dead models. If you get 5+s equal to the wounds of a model, that model reanimates."
      />
      <Ability
        name="Veil of Darkness"
        details={
          'Once per battle, in the movement phase, teleport Overlord and 1 core unit within 3" and set up as deep strike within 3" of each other'
        }
      />
      <Ability
        name="Resurrection Orb"
        details={
          'Once per battle, command phase, pick a unit within 6", their reanimation protocols kick off for every unit in the model'
        }
      />
    </Card>
  </>
);

const Break = () => (
  <div
    style={{
      border: "0.5px solid black",
      width: "100%",
      marginTop: 8,
      marginBottom: 8,
    }}
  />
);

const TauRules = () => (
  <>
    <Card>
      <div style={{ textAlign: "center" }}>Firesight Enclaves</div>
      <Ability
        name="Aggressive Footing"
        details={
          'Shooting a unit within 12" treat the target as having one markerlight'
        }
      />
      <Ability
        name="Devastating Counter-strike"
        details={'Shooting a unit within 6" reroll wound rolls of 1'}
      />
      <Break />
      <div style={{ textAlign: "center" }}>Markerlights</div>
      <Ability name="1" details="Reroll hit rolls of 1" />
      <Ability name="2" details="-" />
      <Ability name="3" details="no cover saving throw bonuses" />
      <Ability name="4" details="-" />
      <Ability name="5" details="+1 to hit" />
      <Break />
      <Ability
        name="For the Greater Good"
        details={
          'Free overwatch, can FTTG shoot if a unit within 6" is charged, but this turns off future overwatch'
        }
      />
    </Card>
  </>
);

const NecronStratagems = () => (
  <>
    <StratagemCard stratagems={[stratagems[0], stratagems[1]]} />
    <StratagemCard stratagems={[stratagems[2], stratagems[3]]} />
    <StratagemCard stratagems={[stratagems[4], stratagems[5]]} />
    <StratagemCard stratagems={[stratagems[6], stratagems[7]]} />
  </>
);

const TauStratagems = () => (
  <>
    <StratagemCard stratagems={[tauStrats[0], tauStrats[1], tauStrats[2]]} />
    <StratagemCard stratagems={[tauStrats[3], tauStrats[4], tauStrats[5]]} />
    <StratagemCard stratagems={[tauStrats[16], tauStrats[17], tauStrats[15]]} />
    <StratagemCard stratagems={[tauStrats[6], tauStrats[7], tauStrats[14]]} />
    <StratagemCard stratagems={[tauStrats[7], tauStrats[8], tauStrats[13]]} />
    <StratagemCard stratagems={[tauStrats[9], tauStrats[10]]} />
    <StratagemCard stratagems={[tauStrats[11], tauStrats[12]]} />
  </>
);

const PrimaryCard: FC<{ player1: string; player2: string }> = ({
  player1,
  player2,
}) => (
  <Card>
    <div style={{ textAlign: "center", paddingBottom: 16 }}>Primary</div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid black",
      }}
    >
      <div>Round</div>
      <div>{player1}</div>
      <div>{player2}</div>
    </div>
    <div
      style={{
        paddingLeft: 16,
        borderBottom: "1px solid black",
        paddingBottom: 16,
        paddingTop: 16,
      }}
    >
      <div>2</div>
    </div>
    <div
      style={{
        paddingLeft: 16,
        borderBottom: "1px solid black",
        paddingBottom: 16,
        paddingTop: 16,
      }}
    >
      <div>3</div>
    </div>
    <div
      style={{
        paddingLeft: 16,
        borderBottom: "1px solid black",
        paddingBottom: 16,
        paddingTop: 16,
      }}
    >
      <div>4</div>
    </div>
    <div
      style={{
        paddingLeft: 16,
        borderBottom: "1px solid black",
        paddingBottom: 16,
        paddingTop: 16,
      }}
    >
      <div>5</div>
    </div>
  </Card>
);

const TotalLine = () => (
  <div style={{ marginLeft: "auto", marginTop: "auto", paddingRight: "32px" }}>
    Total:
  </div>
);

export const PageWrapper: React.FC<{}> = ({ children }) => (
  <div
    style={{
      width: "29.7cm",
      height: "21cm",
      // backgroundColor: "lavender",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
    }}
  >
    {children}
  </div>
);
const Page = () => {
  return (
    <PageWrapper>
      <PrimaryCard player1="Player 1" player2="Player 2" />
      {/* <ArmySummary units={tauUnits} CP="7" />
      <TauRules /> */}
      {/* <TauStratagems /> */}
      <ArmySummary units={necronArmy} CP="3" />
      {/* <NecronRules />
      <NecronStratagems /> */}
      {/* <Card>
        <div style={{ textAlign: "center", paddingBottom: 16 }}>
          Pre-battle CP
        </div>
        <div>
          2 CP: Veteran Cadre (BS and WS improved by 1 for a crisis squad)
        </div>
        <div>3 CP: Emergency Dispensation (2 extra relics)</div>
        <div>
          Relics are: magna rail rifle on broadsides, Advanced Ion Accelerator,
          and gatling burst cannons on crisis team
        </div>
      </Card> */}
      <Card>
        <div>Engage on All Fronts</div>
        <div>T1:</div>
        <div>T2:</div>
        <div>T3:</div>
        <div>T4:</div>
        <div>T5:</div>
        <TotalLine />
      </Card>
      <Card>
        <div>Retrieve Octarius Data</div>
        <div
          style={{
            width: "100%",
            display: "flex",
            height: "90%",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ width: "50%", border: "1px solid black", height: "50%" }}
          ></div>
          <div
            style={{ width: "50%", border: "1px solid black", height: "50%" }}
          ></div>
          <div
            style={{ width: "50%", border: "1px solid black", height: "50%" }}
          ></div>
          <div
            style={{ width: "50%", border: "1px solid black", height: "50%" }}
          ></div>
          <TotalLine />
        </div>
      </Card>
    </PageWrapper>
  );
};

export default Page;
