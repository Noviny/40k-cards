import React from "react";

import {
  UnitCard,
  Card,
  Stratagem,
  OptionsCard,
  LinedCard,
} from "../components/cards";
import {
  createRules,
  tags,
  weapons,
  statBlocks,
  units,
} from "../seed-data-also";
import { PageWrapper, PrintSeparator } from "./scratchings";

function genericMap<T extends { name?: string | null | undefined }>(
  thing: T[]
): ((str: string) => T | undefined) | null {
  if (thing.find(({ name }) => !name)) {
    return null;
  }

  const ourMap = new Map(thing.map((thing) => [thing.name!, thing]));

  const get = (str: string) => {
    let result = ourMap.get(str);

    if (!result) {
      console.log(`could not find an entry for ${str}`);
    }

    return result;
  };

  return get;
}

const getProfile = ({
  range,
  type,
  shots,
  strength,
  AP,
  dmg,
}: { [key: string]: any } = {}) =>
  type === "Melee"
    ? `${range} | ${strength} | ${AP} | ${dmg}`
    : `${range} ${type} ${shots} | ${strength} | ${AP} | ${dmg}`;

const H2: React.FC = (props) => (
  <h2 style={{ textAlign: "center", fontSize: "14px" }} {...props} />
);

const Something = () => {
  const getTag = genericMap(tags);
  const getWeapon = genericMap(weapons);
  const getRule = genericMap(createRules);
  const getStat = genericMap(statBlocks);

  if (!getTag || !getWeapon || !getRule || !getStat) {
    console.log({
      getTag,
      getWeapon,
      getRule,
      getStat,
    });

    return <div>Something went wrong</div>;
  }

  return (
    <PageWrapper>
      {units.map(({ abilities, keywords, stats, weapons, ...rest }, i) =>
        (i + 1) % 8 ? (
          <span key={rest.name}>
            <UnitCard
              key={rest.name}
              {...rest}
              abilities={
                (abilities &&
                  Array.isArray(abilities?.connect) &&
                  abilities.connect
                    .map(({ name }) => getRule(name))
                    .filter((a) => a)) ||
                []
              }
              weapons={
                (weapons &&
                  Array.isArray(weapons.connect) &&
                  weapons.connect
                    .map(({ name }) => {
                      let weapon = getWeapon(name);

                      return { ...weapon, profile: getProfile(weapon) };
                    })
                    .filter((a) => a)) ||
                []
              }
              keywords={keywords?.connect || []}
              stats={getStat(stats?.connect?.name)}
            />
          </span>
        ) : (
          <span key={rest.name}>
            <UnitCard
              {...rest}
              abilities={
                (abilities &&
                  Array.isArray(abilities?.connect) &&
                  abilities.connect
                    .map(({ name }) => getRule(name))
                    .filter((a) => a)) ||
                []
              }
              weapons={
                (weapons &&
                  Array.isArray(weapons.connect) &&
                  weapons.connect
                    .map(({ name }) => {
                      let weapon = getWeapon(name);

                      return { ...weapon, profile: getProfile(weapon) };
                    })
                    .filter((a) => a)) ||
                []
              }
              keywords={keywords?.connect || []}
              stats={getStat(stats?.connect?.name)}
            />
            <PrintSeparator />
          </span>
        )
      )}
      <Card>
        <h2 style={{ textAlign: "center", fontSize: "14px" }}>Turn Help</h2>
        <div style={{ fontSize: 12 }}>
          <div style={{ fontSize: 14 }}>Command Phase</div>
          <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
            <div>
              <b>Exemplar of Mont{"'"}ka:</b> select a CORE unit within 12{'"'}
            </div>
            <div>
              <b>Aggressive Tactics:</b> CRISIS CORE unit within 12{'"'} of the
              commander auto-advances 8{'"'}
            </div>
            <div>Invocations</div>
          </div>

          <div style={{ fontSize: 14 }}>Movement Phase</div>
          <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
            <div>START: High Altitude Manouevres</div>
            <div>START:Markerlights Action</div>
          </div>
          <div style={{ fontSize: 14 }}>Shooting</div>
          <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
            <div>START: Strike and Fade</div>
          </div>
          <div style={{ fontSize: 14 }}>Auras</div>
          <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
            <div>Commander: CORE reroll 1s to hit (9{'"'})</div>
            <div>
              Ethereal: CORE units within 9{'"'} use the ethereal{"'"}s
              leadership
            </div>
          </div>
          <div style={{ fontSize: 14 }}>Stratagems: P66</div>
        </div>
      </Card>
      <Card>
        <H2>Engage on All Fronts</H2>
        <div
          style={{
            paddingBottom: 4,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span>Turn 1:</span>
          <span>0 | 2 | 3</span>
        </div>
        <div
          style={{
            paddingBottom: 4,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span>Turn 2:</span>
          <span>0 | 2 | 3</span>
        </div>
        <div
          style={{
            paddingBottom: 4,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span>Turn 3:</span>
          <span>0 | 2 | 3</span>
        </div>
        <div
          style={{
            paddingBottom: 4,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span>Turn 4:</span>
          <span>0 | 2 | 3</span>
        </div>
        <div
          style={{
            paddingBottom: 4,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span>Turn 5:</span>
          <span>0 | 2 | 3</span>
        </div>
        <H2>To the last</H2>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <input type="checkbox" style={{ marginTop: 10 }} />
          <div style={{ paddingTop: 8, fontSize: 12 }}>
            Commander in Coldstar
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <input type="checkbox" style={{ marginTop: 10 }} />
          <div style={{ paddingTop: 8, fontSize: 12 }}>Crisis team</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <input type="checkbox" style={{ marginTop: 10 }} />
          <div style={{ paddingTop: 8, fontSize: 12 }}>Broadside</div>
        </div>
      </Card>
      <Card>
        <H2>Retrieve Nachmund Data</H2>
        <div style={{ display: "flex", height: "100%", flexWrap: "wrap" }}>
          <div
            style={{
              height: "50%",
              width: "50%",
              border: "1px solid black",
              textAlign: "center",
              paddingTop: 72,
            }}
          >
            <div>Home</div>
            <input type="checkbox" />
          </div>
          <div
            style={{
              height: "50%",
              width: "50%",
              border: "1px solid black",
              textAlign: "center",
              paddingTop: 72,
            }}
          >
            <div>NML1</div>
            <input type="checkbox" />
          </div>
          <div
            style={{
              height: "50%",
              width: "50%",
              border: "1px solid black",
              textAlign: "center",
              paddingTop: 72,
            }}
          >
            <div>NML2</div>
            <input type="checkbox" />
          </div>
          <div
            style={{
              height: "50%",
              width: "50%",
              border: "1px solid black",
              textAlign: "center",
              paddingTop: 72,
            }}
          >
            <div>Enemy</div>
            <input type="checkbox" />
          </div>
        </div>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 180,
            border: "1px solid black",
            position: "absolute",
            margin: "151px 74px",
            background: "white",
            zIndex: 3,
          }}
        ></div>
      </Card>
      <Card>
        <Stratagem
          CP="1"
          name="Strike and Fade"
          text={'Shoot, and then move 6"'}
        />

        <Stratagem
          name="Dynamic Offensive"
          phase="movement"
          CP="1"
          text={
            'A crisis team auto-advances 6" and ignores the -1 to shooting assualt weapons and advancing'
          }
          conditions=""
          faction="Tau"
        />
        <Stratagem
          name="Relentless Fusilade"
          phase="shooting"
          CP="1"
          text="Strike team CORE models in a unit rapid fire at full range, and gain -1 AP"
          conditions=""
          faction="Tau"
        />
      </Card>
      <Card>
        <Stratagem
          CP="1"
          name="Repulsor Impact"
          text="A unit charging battlesuits gets -2 to their charge roll"
        />
        <Stratagem
          CP="1"
          name="Photon Grenade"
          text="When a photon grenade unit is charged, the charger gets -2 to charge and -1 to hit (excluding vehicles and monsters"
        />
        <Stratagem
          CP="1"
          name="Combat Debarkation"
          text="Allow a devilfish's unit's to unlead and then move and shoot (but not charge)"
        />
      </Card>
      <PrintSeparator />
      <Card>
        <div style={{ fontSize: 12 }}>
          <H2>Primary</H2>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 1:
          </div>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 2:
          </div>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 3:
          </div>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 4:
          </div>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 5:
          </div>
        </div>
        <div>
          <H2>CP</H2>
          {new Array(7).fill(1).map((_, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid black", height: 22 }}
            ></div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 12 }}>
          <H2>Primary</H2>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 1:
          </div>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 2:
          </div>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 3:
          </div>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 4:
          </div>
          <div style={{ borderBottom: "1px solid black", height: 24 }}>
            Turn 5:
          </div>
        </div>
        <div>
          <H2>CP</H2>
          {new Array(7).fill(1).map((_, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid black", height: 22 }}
            ></div>
          ))}
        </div>
      </Card>
      <LinedCard />
      <LinedCard />
      <LinedCard />
      <LinedCard />
      <LinedCard />
      <LinedCard />
    </PageWrapper>
  );
};

export default Something;

/*
Breach and Clear: 1CP: Breacher team ignores cover, rerolls wounds
Relentless Fusillade: 1CP: Strike team shoots at full range and has extra -1 AP
On-Board Sensors: 1CP: Devilfish grants limited reroll 1s to hit
Dynamic Offensive: 1CP: Crisis unit advances 6" and ignores penalty for moving and firing assault
Pulse Onslaught: 1CP: Fire Warrior Team auto-wound on 6s
Point-Blank Volley: 1CP: Fire warrior team treats pulse blaster or carbine as pistol 2
Saviour Protocols: 1CP: Drone model within 3" dies to reduce an attack to 0 damage
Combat Debarkation: 1CP: Allow a devilfish's unit's to unlead and then move and shoot (but not charge)
Fail-Safe Detonator: 1CP: Explode a battlesuit
Orbital Ion Beam: 2CP: Line by line D3 mortal to some units in the line
Coordinated Engagement: 1CP: Two units that can see and are withing 18" of an enemy unit fire all shots into that unit, but get -1AP
Shocking Firestorm: 1CP: Debuff morale for one enemy unit
Designated Tasking: 1CP: Split drones in a model off from their unit
Strike and Fade: 1CP: Shoot, and then move 6"
Repulsor Impact Field: 1CP: A unit charging battlesuits gets -2 to their charge roll
 Photon Grenades: 1CP: When a photon grenade unit is charged, the charger gets -2 to charge and -1 to hit (excluding vehicles and monsters)

 aws configure
AWS Access Key ID [None]: ACCESSKEYAWSUSER
AWS Secret Access Key [None]: sEcreTKey
Default region name [None]: us-west-2
Default output format [None]: json
*/

/*
Shadow Operations
* Raise the banners high
* Investigate Signal
* Retrieve Nachmund Data
* Deploy Teleport Homer

Battlefield Supremacy
* Behind Enemy Lines
* Engage on all fronts
* Stranglehold

Purge the Enemy
* Assassination
* Bring it Down
* Titan Hunter

No Mercy, No Respite
* No prisoners
* Grind them down
* To the last

Warpcraft
* Abhor the witch
* Warp Ritual
* Pierce the Veil
* Psychic Interrogation



RND
  T1 Stealth Suit forward quarter
  T2 Stealth suit other quarter OR strike team
  T3 Breacher team forward quarter, or second strike team quarter
  T4 scramble for whatever is left

Engage on All Fronts

To the last: Crisis team, commander, broadside
Assassination

Alts: Raise the banners high instead RND
*/
